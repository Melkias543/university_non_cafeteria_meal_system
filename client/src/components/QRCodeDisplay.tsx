import QRCode from "react-qr-code";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QRCodeDisplayProps {
  value: string;
  title?: string;
  size?: number;
}

export function QRCodeDisplay({ value, title = "Order QR Code", size = 200 }: QRCodeDisplayProps) {
  return (
    <Card className="w-fit mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-center text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center p-6 bg-white rounded-lg">
        <div className="bg-white p-2">
            <QRCode 
            value={value} 
            size={size}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            viewBox={`0 0 ${size} ${size}`}
            />
        </div>
      </CardContent>
    </Card>
  );
}
