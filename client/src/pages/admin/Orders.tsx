import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { QrCode, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/apiService/api";
import { json } from "stream/consumers";
import Swal from "sweetalert2";

export default function AdminOrders() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [cameraMode, setCameraMode] = useState(true);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data.data ?? []);
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Failed to load orders" });
    }
  };

  // ================= CAMERA SCANNER =================
  useEffect(() => {
    if (!isScanOpen || !cameraMode || !readerRef.current) return;

    const scanner = new Html5Qrcode(readerRef.current.id);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          setScanResult(decodedText);
          toast({
            variant: "default",
            title: "QR detected!",
            description: decodedText,
          });
          scanner.stop().catch(() => {});
        },
        (errorMessage) => {
          // ignore continuous scan errors
        },
      )
      .catch((err) => console.error("Camera start error:", err));

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop()?.catch(() => {});
        scannerRef.current.clear?.();
        scannerRef.current = null;
      }
    };
  }, [isScanOpen, cameraMode]);

  // ================= FILE SCANNER =================
  const handleFileScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCameraMode(false);
    scannerRef.current?.stop()?.catch(() => {});
    scannerRef.current?.clear?.();
    scannerRef.current = null;

    if (!readerRef.current) return;

    const html5Qr = new Html5Qrcode(readerRef.current.id);

    try {
      const result = await html5Qr.scanFile(file, true);
      if (!result) throw new Error("QR not detected");
      setScanResult(result);
      toast({ variant: "default", title: "QR detected!", description: result });
    } catch {
      toast({
        variant: "destructive",
        title: "Invalid image or QR not detected",
      });
    } finally {
      html5Qr.clear?.();
    }
  };

  const handleScanAndSend = async () => {
    if (!scanResult) {
      toast({ variant: "destructive", title: "No QR scanned" });
      return;
    }
    const parser = JSON.parse(scanResult);
console.log(parser.qr_code);
    try {
   const response = await api.patch("/admin/scan", { qr_code: parser.qr_code });
     console.log(response.data)
    Swal.fire({
      icon: "success",
      title: "Success",
      text: response?.data?.data?.message ?? "QR code verified successfully.",
      timer: 2000,
      showConfirmButton: false,
    });

      setIsScanOpen(false);
      setScanResult("");
      setCameraMode(true);
      getOrders();
    } catch (error:any){

console.error(error.response?.data?.message || "An error occurred");
Swal.fire({
  icon: "error",
  title: "verifying Qr code is fail.",
  text: error?.response?.data?.message ?? error.message ?? "Something went wrong",
});

    }
  };

  // ================= SEARCH FILTER =================
  const filtered = orders.filter((o) => {
    const qr = o.qr_code ?? "";
    const name = o.user?.full_name ?? "";
    return (
      qr.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  const statusStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    used: "bg-blue-100 text-blue-800",
    default: "bg-gray-100 text-gray-700",
  };


  // ================= ORDER CARD =================
  const OrderCard = ({ order }: any) => {
    const items = order.items ?? [];
    return (
      <Card
        className="mb-4 border-l-4"
        style={{
          borderLeftColor:
            order.status === "pending"
              ? "#FBBF24"
              : order.status === "approved"
                ? "#16A34A"
                : order.status === "used"
                  ? "#2563EB"
                  : "#9CA3AF",
        }}
      >
        <div className="p-6">
          <div className="flex justify-between">
            <div>
              <div className="font-mono font-bold">
                QR: {order.qr_code ?? "N/A"} —{" "}
                {order.user?.full_name ?? "Unknown"}
              </div>
              <p className="text-xs text-muted-foreground">
                {order.created_at
                  ? new Date(order.created_at).toLocaleString()
                  : ""}
              </p>
            </div>

            {/* ✅ STATUS COLOR ONLY */}
            <Badge
              className={statusStyles[order.status] || statusStyles.default}
            >
              {order.status ?? "unknown"}
            </Badge>
          </div>

          <div className="mt-4 space-y-1">
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground">No items</p>
            )}
            {items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {item.quantity}x {item.menu?.name ?? "Menu"}
                </span>
                <span>
                  ${(Number(item.price ?? 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="pt-2 mt-2 border-t flex justify-between font-bold">
              <span>Total</span>
              <span>${Number(order.total_price ?? 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Order Management</h1>

        <Dialog open={isScanOpen} onOpenChange={setIsScanOpen}>
          <DialogTrigger asChild>
            <Button>
              <QrCode className="mr-2 h-5 w-5" />
              Scan QR
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Scan Order QR</DialogTitle>
              <DialogDescription>
                Scan using camera, upload QR, or enter manually.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 flex flex-col gap-4">
              <div
                id="reader"
                ref={readerRef}
                className="border rounded-lg w-full h-64 flex justify-center items-center"
              />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCameraMode(true);
                    setScanResult("");
                  }}
                >
                  Use Camera
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload QR Image
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileScan}
              />

              <div className="space-y-2">
                <Label>Manual QR Code</Label>
                <Input
                  value={scanResult}
                  onChange={(e) => setScanResult(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleScanAndSend} className="w-full">
                Confirm Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          className="pl-8"
          placeholder="Search by QR or student..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABS */}
      <Tabs defaultValue="pending">
        <TabsList className="grid grid-cols-5 max-w-xl">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="used">Used</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        {["pending", "approved", "used", "rejected", "all"].map((status) => {
          const list = filtered.filter((o) => {
            const orderStatus = o.status ?? "pending";
            return status === "all" || orderStatus === status;
          });

          return (
            <TabsContent key={status} value={status}>
              {list.length === 0 ? (
                <p className="mt-10 ml-10 flex justify-baseline items-start text-center text-gray-500 text-xl font-semibold animate-pulse hover:text-gray-700 transition-colors duration-300 cursor-default">
                  No {status === "all" ? "" : status} orders found
                </p>
              ) : (
                list.map((o) => <OrderCard key={o.id ?? null} order={o} />)
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
