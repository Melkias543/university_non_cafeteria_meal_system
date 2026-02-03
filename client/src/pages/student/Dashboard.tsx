import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, UtensilsCrossed, Clock, Wallet } from "lucide-react";

export default function StudentDashboard() {
  const { currentUser, getStudent, orders } = useData();
  
  if (!currentUser?.id) return null;
  
  const student = getStudent(currentUser.id);
  const myOrders = orders.filter(o => o.student_id === currentUser.id);
  const pendingOrders = myOrders.filter(o => o.status === 'pending');
  const recentOrders = myOrders.slice(0, 3);

  if (!student) return <div>Loading...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Welcome, {student.name.split(' ')[0]}</h1>
            <p className="text-gray-500">Here's what's happening with your meals today.</p>
        </div>
        <Link href="/student/order">
            <Button size="lg" className="bg-primary hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all">
                Order Meal <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <Card className="border-l-4 border-l-accent shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4 text-accent" /> Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">${student.balance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
                {student.balance < 5 ? "Low balance - please top up soon." : "Ready for your next delicious meal!"}
            </p>
          </CardContent>
        </Card>

        {/* Active Orders Card */}
        <Card className="border-l-4 border-l-orange-500 shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" /> Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{pendingOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Orders waiting for approval</p>
          </CardContent>
        </Card>

        {/* Total Orders Card */}
        <Card className="border-l-4 border-l-secondary shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4 text-secondary" /> Total Meals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{myOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime orders placed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
                {recentOrders.length > 0 ? (
                    <div className="space-y-4">
                        {recentOrders.map(order => (
                            <div key={order.order_id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium text-sm">{order.items.map(i => i.name).join(", ")}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(order.timestamp).toLocaleDateString()}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="font-bold text-sm">${order.total_price.toFixed(2)}</span>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                        order.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        order.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm">No recent orders found.</p>
                )}
                <div className="mt-4 pt-2 border-t text-center">
                    <Link href="/student/history">
                        <Button variant="link" size="sm" className="text-primary">View All History</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>

        {/* Quick Actions / Notifications */}
        <Card className="shadow-soft bg-orange-50 border-orange-100">
            <CardHeader>
                <CardTitle className="text-lg text-primary">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {student.balance < 10 && (
                        <div className="bg-white p-3 rounded-md border border-orange-100 flex gap-3 shadow-sm">
                            <div className="h-2 w-2 rounded-full bg-accent mt-2 shrink-0" />
                            <div>
                                <h4 className="font-medium text-sm text-gray-900">Low Balance Warning</h4>
                                <p className="text-xs text-gray-500">Your balance is running low. Please visit the admin office to top up.</p>
                            </div>
                        </div>
                    )}
                     <div className="bg-white p-3 rounded-md border border-orange-100 flex gap-3 shadow-sm">
                        <div className="h-2 w-2 rounded-full bg-secondary mt-2 shrink-0" />
                        <div>
                            <h4 className="font-medium text-sm text-gray-900">New Menu Items</h4>
                            <p className="text-xs text-gray-500">Check out the new specials added to the menu this week!</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
