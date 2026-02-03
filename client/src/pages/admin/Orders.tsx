import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { QrCode, Search, Check, X, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrders() {
  const { orders, students, updateOrderStatus } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const { toast } = useToast();

  const handleSimulateScan = () => {
    // In a real app this would use the camera
    // Here we simulate scanning an order ID
    // Let's pick a random pending order or the one entered
    const orderIdToScan = scanResult || orders.find(o => o.status === 'pending')?.order_id;
    
    if (orderIdToScan) {
        const order = orders.find(o => o.order_id === orderIdToScan);
        if (order) {
            updateOrderStatus(order.order_id, 'approved'); // Auto-approve on scan
            toast({ title: "Scan Successful", description: `Order ${order.order_id} approved.` });
            setIsScanOpen(false);
            setScanResult("");
        } else {
             toast({ variant: "destructive", title: "Scan Failed", description: "Order not found." });
        }
    } else {
         toast({ variant: "destructive", title: "No Pending Orders", description: "Could not find a pending order to simulate scan for." });
    }
  };

  const getStudentName = (id: number) => students.find(s => s.id === id)?.name || "Unknown Student";

  const OrderCard = ({ order }: { order: any }) => (
    <Card className="mb-4 overflow-hidden border-l-4" style={{ borderLeftColor: order.status === 'pending' ? '#FBBF24' : order.status === 'approved' ? '#16A34A' : '#9CA3AF' }}>
        <div className="flex flex-col sm:flex-row">
            <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-gray-500">{order.order_id}</span>
                            <span className="text-sm font-medium text-primary">— {getStudentName(order.student_id)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{new Date(order.timestamp).toLocaleString()}</p>
                    </div>
                    <Badge variant={order.status === 'pending' ? 'outline' : 'secondary'} className={
                        order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        order.status === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100'
                    }>
                        {order.status.toUpperCase()}
                    </Badge>
                </div>
                
                <div className="mt-4 space-y-1">
                    {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="pt-2 mt-2 border-t flex justify-between font-bold">
                        <span>Total</span>
                        <span>${order.total_price.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            {order.status === 'pending' && (
                <div className="bg-gray-50 p-4 flex sm:flex-col justify-center gap-2 border-t sm:border-t-0 sm:border-l sm:w-32">
                    <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 w-full"
                        onClick={() => updateOrderStatus(order.order_id, 'approved')}
                    >
                        <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button 
                        size="sm" 
                        variant="destructive" 
                        className="w-full"
                        onClick={() => updateOrderStatus(order.order_id, 'rejected')}
                    >
                        <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                </div>
            )}
             {order.status === 'approved' && (
                <div className="bg-green-50/30 p-4 flex justify-center items-center border-t sm:border-t-0 sm:border-l sm:w-32">
                    <div className="text-center text-green-700 text-sm font-medium">
                        <Check className="h-6 w-6 mx-auto mb-1" />
                        Ready
                    </div>
                </div>
            )}
        </div>
    </Card>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Order Management</h1>
            <p className="text-muted-foreground">Process orders and scan QR codes</p>
        </div>
        
        <Dialog open={isScanOpen} onOpenChange={setIsScanOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg">
                    <QrCode className="mr-2 h-5 w-5" /> Scan QR Code
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Scan Order QR</DialogTitle>
                    <DialogDescription>Simulate scanning a student's order QR code.</DialogDescription>
                </DialogHeader>
                <div className="py-8 flex flex-col items-center justify-center space-y-4">
                    <div className="w-48 h-48 border-4 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                        <QrCode className="h-16 w-16 text-gray-300 animate-pulse" />
                    </div>
                    <div className="w-full max-w-xs">
                         <Label>Manual Entry (Simulation)</Label>
                         <Input 
                            placeholder="Enter Order ID (e.g. ORD-XYZ...)" 
                            value={scanResult}
                            onChange={(e) => setScanResult(e.target.value)}
                         />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSimulateScan} className="w-full">Simulate Successful Scan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
                placeholder="Search orders..." 
                className="pl-9 bg-white" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">Pending</TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All History</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
            <TabsContent value="pending" className="space-y-4">
                {orders.filter(o => o.status === 'pending').length === 0 ? (
                    <div className="text-center py-12 text-gray-400">No pending orders.</div>
                ) : (
                    orders.filter(o => o.status === 'pending').map(order => <OrderCard key={order.order_id} order={order} />)
                )}
            </TabsContent>
            
            <TabsContent value="approved" className="space-y-4">
                 {orders.filter(o => o.status === 'approved').map(order => <OrderCard key={order.order_id} order={order} />)}
            </TabsContent>

             <TabsContent value="rejected" className="space-y-4">
                 {orders.filter(o => o.status === 'rejected').map(order => <OrderCard key={order.order_id} order={order} />)}
            </TabsContent>

             <TabsContent value="all" className="space-y-4">
                 {orders.map(order => <OrderCard key={order.order_id} order={order} />)}
            </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
