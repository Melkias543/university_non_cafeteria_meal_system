import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Clock, CheckCircle, XCircle } from "lucide-react";

export default function StudentHistory() {
  const { currentUser, orders } = useData();
  
  if (!currentUser?.id) return null;
  
  const myOrders = orders.filter(o => o.student_id === currentUser.id);

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'approved': return 'bg-green-100 text-green-800 hover:bg-green-200';
        case 'rejected': return 'bg-red-100 text-red-800 hover:bg-red-200';
        case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
        case 'approved': return <CheckCircle className="h-4 w-4 mr-1" />;
        case 'rejected': return <XCircle className="h-4 w-4 mr-1" />;
        case 'pending': return <Clock className="h-4 w-4 mr-1" />;
        default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-serif font-bold text-gray-900">Order History</h1>

      <div className="grid gap-4">
        {myOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-dashed">
                <p className="text-muted-foreground">No orders found.</p>
            </div>
        ) : (
            myOrders.map(order => (
                <Card key={order.order_id} className="overflow-hidden">
                    <div className="md:flex">
                        {/* Order Details */}
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg">{order.order_id}</h3>
                                        <Badge className={`${getStatusColor(order.status)} border-0 flex items-center`}>
                                            {getStatusIcon(order.status)}
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(order.timestamp).toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">${order.total_price.toFixed(2)}</p>
                                    <p className="text-xs text-muted-foreground">{order.items.reduce((acc, i) => acc + i.quantity, 0)} items</p>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between">
                                        <span className="text-gray-700">{item.quantity}x {item.name}</span>
                                        <span className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* QR Action Section - Only for Pending/Approved */}
                        {['pending', 'approved'].includes(order.status) && (
                             <div className="bg-blue-50/50 p-6 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l w-full md:w-64 shrink-0 gap-3">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="w-full gap-2 bg-white text-primary border border-blue-200 hover:bg-blue-50 shadow-sm">
                                            <QrCode className="h-4 w-4" />
                                            Show QR Code
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="text-center">Order QR Code</DialogTitle>
                                        </DialogHeader>
                                        <div className="flex flex-col items-center py-6">
                                            <QRCodeDisplay value={JSON.stringify({
                                                order_id: order.order_id,
                                                student_id: order.student_id,
                                                total_price: order.total_price,
                                                expires_at: new Date(new Date(order.timestamp).getTime() + 3600000).toISOString() // 1 hour expiry mock
                                            })} />
                                            <p className="text-sm text-center text-muted-foreground mt-4 max-w-[200px]">
                                                Show this code to the cafeteria staff to pick up your order.
                                            </p>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <p className="text-xs text-center text-muted-foreground">
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
