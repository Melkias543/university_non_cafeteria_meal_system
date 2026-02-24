import api from "@/apiService/api";
import React, { useEffect, useState } from "react";

interface Order {
  id: string;
  qr_code: string;
  user_id: string;
  total_price: number;
  status: "pending" | "used";
  created_at: string;
  expires_at: string;
}

const dummyOrders: Order[] = [
  {
    id: "1",
    qr_code: "0000000013",
    user_id: "019c4669-454f-7081-bd0a-49c5feb8e8ad",
    total_price: 1,
    status: "pending",
    created_at: "2026-02-20T11:49:45",
    expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
  },
  {
    id: "2",
    qr_code: "0000000012",
    user_id: "019c4669-454f-7081-bd0a-49c5feb8e8ad",
    total_price: 1,
    status: "pending",
    created_at: "2026-02-20T05:55:27",
    expires_at: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    qr_code: "0000000011",
    user_id: "019c4669-454f-7081-bd0a-49c5feb8e8ad",
    total_price: 1,
    status: "used",
    created_at: "2026-02-20T05:42:24",
    expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    qr_code: "0000000010",
    user_id: "019c4669-454f-7081-bd0a-49c5feb8e8ad",
    total_price: 1,
    status: "used",
    created_at: "2026-02-15T13:58:38",
    expires_at: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
  },
];

function OrderQueue() {
  const [orders, setOrders] = useState<Order[]>([]);
useEffect(() => {
    fetchOrder();
  }, [])

const fetchOrder = async () => {
    try {
      const response = await api.get("/orders/order-queues");
      
console.log(response.data);    

} catch (error:any) {
      console.error("Failed to fetch orders:", error.response);
    }
  };
  useEffect(() => {
    // Sort from 6 hours from now to past
    const sortedOrders = [...dummyOrders].sort(
      (a, b) =>
        new Date(b.expires_at).getTime() - new Date(a.expires_at).getTime(),
    );
    setOrders(sortedOrders);
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Today's Orders </h2>
      {orders.map((order) => (
        <div
          key={order.id}
          className={`p-4 rounded-lg shadow flex justify-between items-center ${
            order.status === "pending"
              ? "bg-[#FFEDCC] border-l-4 border-[#FFA500]" // soft yellow for pending
              : "bg-[#D1F7DD] border-l-4 border-[#00C851]" // soft green for used
          }`}
        >
          <div>
            <p className="font-semibold">Order Code: {order.qr_code}</p>
            <p className="text-sm text-gray-600">User ID: {order.user_id}</p>
            <p className="text-sm text-gray-600">
              Total: ${order.total_price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              Expires at: {new Date(order.expires_at).toLocaleString()}
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full font-bold text-white ${
              order.status === "pending" ? "bg-orange-500" : "bg-green-500"
            }`}
          >
            {order.status.toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderQueue;
