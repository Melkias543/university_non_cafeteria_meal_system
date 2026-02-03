export type Role = 'admin' | 'student';

export interface Student {
  id: number;
  name: string;
  email: string; // Added for completeness
  balance: number;
  studentId: string; // The visible ID (e.g., "STU-001")
}

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  is_available: boolean;
}

export type OrderStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface OrderItem {
  menuItemId: number;
  quantity: number;
  name: string; // Snapshot of name at time of order
  price: number; // Snapshot of price at time of order
}

export interface Order {
  order_id: string;
  student_id: number;
  items: OrderItem[];
  total_price: number;
  status: OrderStatus;
  timestamp: string;
}

export interface QRData {
  order_id: string;
  student_id: number;
  total_price: number;
  expires_at: string;
}

export interface Report {
  totalRevenue: number;
  totalOrders: number;
  popularItems: { name: string; count: number }[];
  dailyStats: { date: string; revenue: number }[];
}
