import { Student, MenuItem, Order } from "../types";

export const INITIAL_STUDENTS: Student[] = [
  { id: 1, name: "John Doe", email: "john@uni.edu", balance: 25.00, studentId: "STU-1001" },
  { id: 2, name: "Jane Smith", email: "jane@uni.edu", balance: 10.50, studentId: "STU-1002" },
  { id: 3, name: "Alice Johnson", email: "alice@uni.edu", balance: 45.00, studentId: "STU-1003" },
  { id: 4, name: "Bob Brown", email: "bob@uni.edu", balance: 0.00, studentId: "STU-1004" },
];

export const INITIAL_MENU: MenuItem[] = [
  { id: 1, name: "Pepperoni Pizza", description: "Classic pepperoni with mozzarella", price: 5.00, category: "Main", is_available: true, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1000&auto=format&fit=crop" },
  { id: 2, name: "Cheeseburger", description: "Juicy beef patty with cheddar", price: 3.50, category: "Main", is_available: true, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop" },
  { id: 3, name: "Caesar Salad", description: "Fresh romaine with caesar dressing", price: 4.00, category: "Sides", is_available: true, image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=1000&auto=format&fit=crop" },
  { id: 4, name: "Soda (Can)", description: "Coke, Pepsi, or Sprite", price: 1.50, category: "Drinks", is_available: true, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1000&auto=format&fit=crop" },
  { id: 5, name: "Chocolate Cookie", description: "Freshly baked", price: 1.00, category: "Dessert", is_available: true, image: "https://images.unsplash.com/photo-1499636138143-bd630f5cf388?q=80&w=1000&auto=format&fit=crop" },
];

export const INITIAL_ORDERS: Order[] = [
  { 
    order_id: "uuid-123", 
    student_id: 1, 
    items: [{ menuItemId: 1, quantity: 2, name: "Pepperoni Pizza", price: 5.00 }], 
    total_price: 10.00, 
    status: "approved", 
    timestamp: new Date(Date.now() - 86400000).toISOString()
  }
];
