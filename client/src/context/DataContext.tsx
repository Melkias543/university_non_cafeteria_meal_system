import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, MenuItem, Order, OrderStatus } from '../types';
import { INITIAL_STUDENTS, INITIAL_MENU, INITIAL_ORDERS } from '../lib/initialData';
import { useToast } from '@/hooks/use-toast';

interface DataContextType {
  students: Student[];
  menu: MenuItem[];
  orders: Order[];
  currentUser: { role: 'admin' | 'student'; id?: number } | null;
  
  // Actions
  login: (role: 'admin' | 'student', studentId?: number) => void;
  logout: () => void;
  
  // Student Actions
  getStudent: (id: number) => Student | undefined;
  placeOrder: (studentId: number, items: { item: MenuItem; quantity: number }[]) => Promise<Order>;
  
  // Admin Actions
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudentBalance: (id: number, amount: number) => void;
  deleteStudent: (id: number) => void;
  
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: number, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: number) => void;
  
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [currentUser, setCurrentUser] = useState<{ role: 'admin' | 'student'; id?: number } | null>(null);
  const { toast } = useToast();

  // Auth Simulation
  const login = (role: 'admin' | 'student', studentId?: number) => {
    setCurrentUser({ role, id: studentId });
    // Simulate navigation/toast
    toast({
      title: `Logged in as ${role === 'admin' ? 'Admin' : 'Student'}`,
      description: "Welcome to the University Meal System",
    });
  };

  const logout = () => {
    setCurrentUser(null);
    toast({ title: "Logged out" });
  };

  // Getters
  const getStudent = (id: number) => students.find(s => s.id === id);

  // Student Actions
  const placeOrder = async (studentId: number, items: { item: MenuItem; quantity: number }[]) => {
    const student = getStudent(studentId);
    if (!student) throw new Error("Student not found");

    const total = items.reduce((sum, { item, quantity }) => sum + (item.price * quantity), 0);

    if (student.balance < total) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: `You need $${(total - student.balance).toFixed(2)} more.`,
      });
      throw new Error("Insufficient funds");
    }

    // Deduct balance immediately or upon approval? 
    // Usually deducted on approval, but for simplicity let's deduct now and refund if rejected
    // OR: Pending orders just verify balance. Let's deduct on placement for this MVP.
    setStudents(prev => prev.map(s => 
      s.id === studentId ? { ...s, balance: s.balance - total } : s
    ));

    const newOrder: Order = {
      order_id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      student_id: studentId,
      items: items.map(i => ({
        menuItemId: i.item.id,
        quantity: i.quantity,
        name: i.item.name,
        price: i.item.price
      })),
      total_price: total,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    toast({
      title: "Order Placed",
      description: `Order ${newOrder.order_id} is pending approval.`,
    });
    return newOrder;
  };

  // Admin Actions
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent = { ...studentData, id: Math.max(...students.map(s => s.id), 0) + 1 };
    setStudents(prev => [...prev, newStudent]);
    toast({ title: "Student Added", description: `${newStudent.name} added successfully.` });
  };

  const updateStudentBalance = (id: number, amount: number) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, balance: s.balance + amount } : s));
    toast({ title: "Balance Updated", description: `Added $${amount.toFixed(2)}` });
  };

  const deleteStudent = (id: number) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    toast({ title: "Student Deleted" });
  };

  const addMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    const newItem = { ...itemData, id: Math.max(...menu.map(m => m.id), 0) + 1 };
    setMenu(prev => [...prev, newItem]);
    toast({ title: "Menu Item Added" });
  };

  const updateMenuItem = (id: number, updates: Partial<MenuItem>) => {
    setMenu(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    toast({ title: "Menu Item Updated" });
  };

  const deleteMenuItem = (id: number) => {
    setMenu(prev => prev.filter(m => m.id !== id));
    toast({ title: "Menu Item Deleted" });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const order = orders.find(o => o.order_id === orderId);
    if (!order) return;

    // Handle refunds if rejected
    if (status === 'rejected' && order.status !== 'rejected') {
      setStudents(prev => prev.map(s => 
        s.id === order.student_id ? { ...s, balance: s.balance + order.total_price } : s
      ));
      toast({ title: "Order Rejected", description: "Funds refunded to student." });
    } else if (status === 'approved') {
       toast({ title: "Order Approved", className: "bg-green-600 text-white" });
    }

    setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status } : o));
  };

  return (
    <DataContext.Provider value={{
      students, menu, orders, currentUser,
      login, logout,
      getStudent, placeOrder,
      addStudent, updateStudentBalance, deleteStudent,
      addMenuItem, updateMenuItem, deleteMenuItem,
      updateOrderStatus
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
