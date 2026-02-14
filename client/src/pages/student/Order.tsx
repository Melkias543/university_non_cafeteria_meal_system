import api from "@/apiService/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/feature/Context/authContext";
import { useCart } from "@/feature/Context/CartContext";

import { MenuItemInput } from "@/types/validadion";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

/* ================= DUMMY TYPES ================= */

const imageUrl = import.meta.env.VITE_IMAGE_API_URL;

export default function StudentOrder() {
  const [menus, setMenus] = useState<MenuItemInput[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 0,
    loading: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    getMenus();
  }, []);
  const getMenus = async (page = 1) => {
    try {
      const res = await api.get("/student-menu");
      // console.log("all menus", res.data);
      setMenus(res.data.data.data);
    } catch (error: any) {
      console.error("Error during fetching ", error);
    }
  };
  /* ================= DUMMY DATA ================= */

  const { user } = useAuth();
  const { state, dispatch } = useCart();

  // console.log("state", state);

  const currentUser = user;

  
  // const menu: MenuItem[] = [
  //   {
  //     id: 1,
  //     name: "Cheese Burger",
  //     description: "Delicious beef burger with cheese",
  //     price: 8.5,
  //     image: "https://via.placeholder.com/150",
  //     category: "Burgers",
  //     is_available: true,
  //   },
  //   {
  //     id: 2,
  //     name: "Chicken Pizza",
  //     description: "Crispy pizza with chicken topping",
  //     price: 12.0,
  //     image: "https://via.placeholder.com/150",
  //     category: "Pizza",
  //     is_available: true,
  //   },
  //   {
  //     id: 3,
  //     name: "French Fries",
  //     description: "Golden crispy fries",
  //     price: 4.0,
  //     image: "https://via.placeholder.com/150",
  //     category: "Sides",
  //     is_available: true,
  //   },
  //   {
  //     id: 4,
  //     name: "Orange Juice",
  //     description: "Fresh orange juice",
  //     price: 3.5,
  //     image: "https://via.placeholder.com/150",
  //     category: "Drinks",
  //     is_available: false,
  //   },
  // ];

  /* ================= LOCAL CART ================= */

  const addToCart = (item: any) => {
    // console.log('to be added from here order',item)
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
      },
    });
  };
  const clearCart = () => {
dispatch({
  type:'CLEAR_CART'
}) };


  const clearSpecificFood=(item:any)=>{
    dispatch({
      type:"REMOVE",
      payload:item.id
    })

  }
  const IncreaseItemNumber = (item:any) => {
    dispatch({
      type: "INCREASE",
      payload:item.id
   
    });
  };
  const decreaseItemNumber = (item:any) => {
    dispatch({
      type: 'DECREASE',
      payload:item.id
    
    });
  };

  const finishYourOrder = async () => {
    if (!currentUser?.id) return;
    try {
      const response = await api.post("/orders", {
        total_price: state.totalAmount,
        items: state.cart,
      });
      if (response.data.success) {
     console.log(response)
     Swal.fire({
       title: "Order Created!",
       html: `
          <p>${response.data.message}</p>
          <p><strong>Total Price:</strong> $${response.data.data.total_price}</p>
          <img src="http://127.0.0.1:8000${response.data.qr_url}" 
               alt="Order QR" 
 style="
    display: block;
    margin: 10px auto; /* centers horizontally */
    width: 200px;
    height: 200px;
  "
/>        `,
       icon: "success",
       confirmButtonText: "OK",
     });
     clearCart()
     navigate("/student/dashboard");
   }
    } catch (error:any) {
      console.error("Error of ordering", error.response)
        Swal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Something went wrong",
          icon: "error",
        });
    }

  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 h-[calc(100vh-120px)]">
      {/* ================= MENU ================= */}
      <div className="lg:col-span-2 overflow-y-auto pr-2 pb-10">
        <h1 className="text-3xl font-bold mb-8">🍽 Add To Your Order</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {menus.map((item) => (
            <Card
              key={item.id}
              className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
            >
              {/* IMAGE */}
              <div className="h-64 w-full overflow-hidden">
                <img
                  src={`${imageUrl}/storage/${item.image}`}
                  alt={item.name}
                  className="h-full w-full object-cover hover:scale-105 transition duration-300"
                />
              </div>

              {/* CONTENT */}
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <span className="font-bold text-primary text-lg">
                    ${item.price}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>

                <Button
                  className="w-full h-10 text-sm cursor-pointer"
                  onClick={() => addToCart(item)}
                  disabled={!item.is_available}
                >
                  Add to Your Orders
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ================= CART ================= */}
      <div className="lg:col-span-1">
        <Card className="sticky top-20 shadow-xl rounded-2xl flex flex-col max-h-[calc(100vh-120px)]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">Your Cart</span>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={clearCart}
                className="flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Orders{" "}
              </Button>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto space-y-4">
            {!state?.totalItems ? (
              <div className="text-center text-muted-foreground py-10">
                Your cart is empty
              </div>
            ) : (
              state?.cart?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      ${item.price} × {item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="cursor-pointer"
                      onClick={() => decreaseItemNumber(item)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <span className="font-semibold gap-2 flex ">
                      {/* {quantity} */}
                      {item.quantity}
                      <span>MIGIB</span>
                    </span>

                    <Button
                      size="icon"
                      className="cursor-pointer"
                      variant="ghost"
                      onClick={() => IncreaseItemNumber(item)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="cursor-pointer"
                      onClick={() => clearSpecificFood(item)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>

          <div className="p-4 border-t space-y-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="flex gap-2">
                {state?.totalAmount}
                <span> ETB</span>
              </span>
            </div>

            <Button
              className="w-full h-12 text-lg cursor-pointer"
              onClick={finishYourOrder}
              // disabled{!state?.totalItems}
              disabled={!state?.totalItems}
            >
              Confirm Order
              {/* {student.balance < cartTotal ? "Insufficient Balance" : "Checkout"} */}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
