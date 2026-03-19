import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Clock, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/apiService/api";
import { useAuth } from "@/feature/Context/authContext";
const imageUrl = import.meta.env.VITE_IMAGE_API_URL;

export default function StudentHistory() {
  const [Orders, setOrders] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/orders/${user?.id}`);
      // console.log("Fetched Orders:", response.data.data);
      setOrders(response.data.data || []);
    } catch (error: any) {
      console.error("Error fetching orders:", error.response);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "rejected":
        return <XCircle className="h-4 w-4 mr-1" />;
      case "pending":
        return <Clock className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-serif font-bold text-gray-900">
        Order History
      </h1>

      <div className="grid gap-4">
        {Orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-dashed">
            <p className="text-muted-foreground">No orders found.</p>
          </div>
        ) : (
          Orders.map((order: any) => (
            <Card key={order.id} className="overflow-hidden">
              <div className="md:flex">
                {/* Order Details */}
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">
                          Order Code: {order.qr_code}
                        </h3>

                        <Badge
                          className={`${getStatusColor(
                            order.status,
                          )} border-0 flex items-center`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        ${Number(order.total_price).toFixed(2)}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {order.items?.reduce(
                          (acc: number, i: any) =>
                            acc + Number(i.quantity || 0),
                          0,
                        ) ?? 0}{" "}
                        items
                      </p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-gray-700">
                          {item.quantity}x {item.menu?.name}
                        </span>
                        <span className="text-gray-500">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QR Section */}
                {["pending", "approved"].includes(order.status) &&
                  order.qr_image_url && (
                    <div className="bg-blue-50 p-6 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l w-full md:w-64 gap-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full gap-2 bg-white border">
                            <QrCode className="h-4 w-4" />
                            Show QR Code
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-center">
                              Order QR Code
                            </DialogTitle>
                          </DialogHeader>

                          <div className="flex flex-col items-center py-6">
                            {/* ✅ Display backend-generated QR code */}
                            <img
                              src={`${imageUrl}${order.qr_image_url}`}
                              alt={`QR Code for ${order.qr_code}`}
                              className="w-48 h-48 object-contain"
                            />

                            <p className="text-sm text-center text-muted-foreground mt-4">
                              Show this code to pick up your order.
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <p className="text-xs text-muted-foreground text-center">
                        Scan to pick up
                      </p>
                    </div>
                  )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
