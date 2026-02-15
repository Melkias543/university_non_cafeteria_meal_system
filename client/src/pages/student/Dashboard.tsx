import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, UtensilsCrossed, Clock, Wallet } from "lucide-react";
import { useAuth } from "@/feature/Context/authContext";
import api from "@/apiService/api";
import { useEffect, useState } from "react";
const imageUrl = import.meta.env.VITE_IMAGE_API_URL;

export default function StudentDashboard() {
  const [menuNumber, setMenuNumber] = useState(0);
  const [Orders, setMyOrders] = useState<any[]>([]);
  const [scanQR, setScanQR] = useState<string | null>(null);

  const { user, balance } = useAuth();

  useEffect(() => {
    numberOfMenu();
    myOrderList();
  }, []);

  const myOrderList = async () => {
    try {
      const response = await api.get(`/orders/${user?.id}`);
      setMyOrders(response.data.data || []);
    } catch (error: any) {
      console.error("error fetching orders", error);
    }
  };

  const numberOfMenu = async () => {
    try {
      const response = await api.get("/menu-count");
      setMenuNumber(response.data.data || 0);
    } catch (error: any) {
      console.error("menu count error", error);
    }
  };

  const pendingOrders = Orders.filter((o) => o.status === "pending");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Welcome,
            <span className="text-shadow-yellow-700 text-2xl">
              {" "}
              {user?.name?.split(" ")[0]}
            </span>
          </h1>
          <p className="text-gray-500">
            Here's what's happening with your meals today.
          </p>
        </div>

        <Link to="/student/order">
          <Button size="lg" className="bg-primary hover:bg-orange-600">
            Order Meal <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-soft border-l-4 border-l-accent">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Wallet className="h-4 w-4" /> Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{balance} ETB</div>
            <p className="text-xs text-destructive mt-1">
              {(balance ?? 0) < 500
                ? "Low balance - please top up soon."
                : "Ready for your next meal!"}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" /> Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              Orders waiting approval
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-l-4 border-l-secondary">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" /> Total Meals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{menuNumber}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime meals ordered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>

          <CardContent>
            {Orders.length > 0 ? (
              <div className="space-y-4">
                {Orders.slice(0, 4).map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    {/* LEFT */}
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-mono">
                        QR: {order.qr_code}
                      </p>

                      <div className="text-sm space-y-1">
                        {order.items?.length ? (
                          order.items.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between gap-8">
                              <span>
                                {item.quantity}x {item.menu?.name}
                              </span>
                              <span className="font-semibold">
                                $
                                {(
                                  Number(item.price) * Number(item.quantity)
                                ).toFixed(2)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span>Order</span>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {(order.items || []).reduce(
                          (acc: number, i: any) =>
                            acc + Number(i.quantity || 0),
                          0,
                        )}{" "}
                        item(s)
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-bold text-sm">
                        ${Number(order.total_price).toFixed(2)}
                      </span>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                          order.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status}
                      </span>

                      {/* Scan QR */}
                      {order.qr_image_url && (
                        <button
                          className="text-[11px] bg-primary text-white px-2 py-1 rounded-md cursor-pointer"
                          onClick={() => setScanQR(order.qr_image_url)}
                        >
                          Scan
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No recent orders found.
              </p>
            )}

            <div className="mt-4 pt-2 border-t text-center">
              <Link to="/student/history">
                <Button variant="link" size="sm">
                  View All History
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {(balance ?? 0) < 500 && (
              <p className="text-sm text-red-500">
                Low balance. Please top up.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ✅ QR Modal Popup */}
      {scanQR && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center relative">
            <button
              onClick={() => setScanQR(null)}
              className="absolute top-2 right-3 text-lg font-bold"
            >
              ✕
            </button>

            <h3 className="font-semibold mb-4">Scan QR Code</h3>

            {/* Display backend-generated QR image */}
            <img
              src={`${imageUrl}${scanQR}`} // comes from order.qr_image_url
              alt="QR Code"
              className="w-48 h-48 mx-auto object-contain"
            />

            <p className="text-xs text-muted-foreground mt-3">
              Show this code to receive your meal
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
