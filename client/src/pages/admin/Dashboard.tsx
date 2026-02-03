import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, ShoppingCart, DollarSign, Utensils, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { students, orders, menu } = useData();

  const totalRevenue = orders
    .filter(o => o.status === 'approved' || o.status === 'completed')
    .reduce((sum, o) => sum + o.total_price, 0);

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalOrders = orders.length;
  const activeStudents = students.length; // Assuming all are active for demo
  const lowBalanceStudents = students.filter(s => s.balance < 5).length;

  const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
    <Card className="border-l-4 shadow-sm" style={{ borderLeftColor: color }}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4" style={{ color }} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">
            Overview of system performance
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            title="Total Revenue" 
            value={`$${totalRevenue.toFixed(2)}`} 
            subtext="From approved orders"
            icon={DollarSign}
            color="#16A34A"
        />
        <StatCard 
            title="Pending Orders" 
            value={pendingOrders} 
            subtext="Requires approval"
            icon={ShoppingCart}
            color="#FBBF24"
        />
        <StatCard 
            title="Active Students" 
            value={activeStudents} 
            subtext={`${lowBalanceStudents} with low balance`}
            icon={Users}
            color="#1E40AF"
        />
        <StatCard 
            title="Menu Items" 
            value={menu.length} 
            subtext="Total items available"
            icon={Utensils}
            color="#6B7280"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Recent Revenue</CardTitle>
                <CardDescription>Daily revenue over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-md m-4">
                <TrendingUp className="h-10 w-10 mr-2 opacity-20" />
                <span>Chart visualization available in Reports</span>
            </CardContent>
        </Card>
        
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 cursor-pointer transition-colors border border-blue-100">
                        <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <span className="text-sm font-medium">Add Student</span>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center hover:bg-yellow-100 cursor-pointer transition-colors border border-yellow-100">
                         <DollarSign className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                        <span className="text-sm font-medium">Top Up</span>
                    </div>
                     <div className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100 cursor-pointer transition-colors border border-green-100">
                         <Utensils className="h-6 w-6 mx-auto mb-2 text-green-600" />
                        <span className="text-sm font-medium">Add Menu Item</span>
                    </div>
                     <div className="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100 cursor-pointer transition-colors border border-purple-100">
                         <ShoppingCart className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                        <span className="text-sm font-medium">Review Orders</span>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
