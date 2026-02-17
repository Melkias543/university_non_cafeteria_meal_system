import { useData } from "@/context/DataContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useEffect, useState } from "react";
import api from "@/apiService/api";

export default function AdminReports() {
  const { menu } = useData();

  const [systemLogData, setSystemLogData] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    getSystemLog();
  }, []);

  const getSystemLog = async () => {
    try {
      const response = await api.get("/admin/system_log");
      setSystemLogData(response.data.data);
    } catch (error: any) {
      console.error("Failed to fetch system log", error?.response);
    } finally {
      setLoadingLogs(false);
    }
  };

  // Weekly revenue mock data
  const data = [
    { name: "Mon", revenue: 400, orders: 24 },
    { name: "Tue", revenue: 300, orders: 18 },
    { name: "Wed", revenue: 550, orders: 35 },
    { name: "Thu", revenue: 450, orders: 28 },
    { name: "Fri", revenue: 600, orders: 42 },
    { name: "Sat", revenue: 200, orders: 15 },
    { name: "Sun", revenue: 150, orders: 10 },
  ];

  // Menu category distribution
  const categoryData = menu.reduce((acc: any[], item: any) => {
    const found = acc.find((c) => c.name === item.category);
    if (found) found.value++;
    else acc.push({ name: item.category, value: 1 });
    return acc;
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // Format action text
  const formatAction = (action: string) =>
    action.replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

  // Action color styling
  const actionColor = (action: string) => {
    if (action.includes("created")) return "text-green-600";
    if (action.includes("deleted")) return "text-red-600";
    if (action.includes("updated")) return "text-blue-600";
    if (action.includes("used")) return "text-purple-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground">
          Insights into system performance
        </p>
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Revenue</CardTitle>
            <CardDescription>Total sales last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v) => [`$${v}`, "Revenue"]} />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category */}
        <Card>
          <CardHeader>
            <CardTitle>Menu Distribution</CardTitle>
            <CardDescription>Items by category</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex justify-center gap-4 text-sm mt-4 flex-wrap">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SYSTEM LOG TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
          <CardDescription>Recent system activities</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Date</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loadingLogs && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center">
                      Loading logs...
                    </td>
                  </tr>
                )}

                {!loadingLogs && systemLogData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center">
                      No logs found
                    </td>
                  </tr>
                )}

                {systemLogData.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-muted/40">
                    <td className="py-2">
                      {new Date(log.created_at).toLocaleString()}
                    </td>

                    <td>{log.user?.full_name ?? "Unknown"}</td>

                    <td className={`font-medium ${actionColor(log.action)}`}>
                      {formatAction(log.action)}
                    </td>

                    <td>
                      <span className="text-xs px-2 py-1 rounded bg-muted">
                        {log.user?.status ?? "active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
