import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function AdminReports() {
  const { orders, menu } = useData();

  // Mock data generation based on orders
  // Since we only have mock orders, let's generate some fake historical data for the chart
  const data = [
    { name: 'Mon', revenue: 400, orders: 24 },
    { name: 'Tue', revenue: 300, orders: 18 },
    { name: 'Wed', revenue: 550, orders: 35 },
    { name: 'Thu', revenue: 450, orders: 28 },
    { name: 'Fri', revenue: 600, orders: 42 },
    { name: 'Sat', revenue: 200, orders: 15 },
    { name: 'Sun', revenue: 150, orders: 10 },
  ];

  // Category distribution
  const categoryData = menu.reduce((acc: any[], item) => {
    const existing = acc.find(c => c.name === item.category);
    if (existing) {
        existing.value += 1;
    } else {
        acc.push({ name: item.category, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-muted-foreground">Insights into sales and performance</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Weekly Revenue</CardTitle>
                <CardDescription>Total sales over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `$${value}`} />
                        <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                        <Bar dataKey="revenue" fill="#1E40AF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Menu Distribution</CardTitle>
                <CardDescription>Breakdown of items by category</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 text-sm mt-4 flex-wrap">
                    {categoryData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span>{entry.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>Order Volume Trend</CardTitle>
                <CardDescription>Number of orders processed daily</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="orders" stroke="#FBBF24" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    </div>
  );
}
