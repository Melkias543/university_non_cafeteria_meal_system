import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuItem } from "@/types";

export default function StudentOrder() {
  const { menu, currentUser, placeOrder, getStudent } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cart, setCart] = useState<{item: MenuItem, quantity: number}[]>([]);
  const student = currentUser?.id ? getStudent(currentUser.id) : null;

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => prev.filter(i => i.item.id !== itemId));
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.item.id === itemId) {
        const newQ = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQ };
      }
      return i;
    }));
  };

  const cartTotal = cart.reduce((sum, i) => sum + (i.item.price * i.quantity), 0);

  const handleCheckout = async () => {
    if (!currentUser?.id) return;
    try {
      await placeOrder(currentUser.id, cart);
      setCart([]);
      navigate('/student/history'); // Or to a success page / QR display
    } catch (error) {
      // Error handled in context
    }
  };

  const categories = Array.from(new Set(menu.map(item => item.category)));

  if (!student) return null;

  return (
    <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-500 h-[calc(100vh-140px)]">
      {/* Menu Selection */}
      <div className="lg:col-span-2 overflow-y-auto pr-2 pb-20">
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Start Your Order</h1>
        
        {categories.map(category => (
          <div key={category} className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-secondary block"></span>
               {category}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {menu.filter(item => item.category === category).map(item => (
                <Card key={item.id} className="flex flex-col hover:border-primary/50 transition-colors">
                  <div className="flex p-4 gap-4">
                    <div className="h-20 w-20 rounded-md overflow-hidden shrink-0 bg-gray-100">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                        <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 mb-3">{item.description}</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full h-8 text-xs border-dashed border-primary text-primary hover:bg-primary hover:text-white"
                        onClick={() => addToCart(item)}
                        disabled={!item.is_available}
                      >
                        {item.is_available ? "Add to Order" : "Sold Out"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24 shadow-lg border-t-4 border-t-primary h-auto max-h-[calc(100vh-120px)] flex flex-col">
          <CardHeader className="bg-gray-50/50 pb-4">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Your Order
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>Your cart is empty.</p>
                <p className="text-xs mt-1">Select items from the menu to start.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(({ item, quantity }) => (
                  <div key={item.id} className="flex items-center gap-3 bg-white p-2 rounded-lg border shadow-sm">
                    <div className="h-12 w-12 rounded bg-gray-100 overflow-hidden shrink-0">
                        <img src={item.image} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.name}</h4>
                      <div className="text-xs text-muted-foreground">${item.price.toFixed(2)} x {quantity}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-bold">${(item.price * quantity).toFixed(2)}</span>
                        <div className="flex items-center gap-1">
                             <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}>
                                <Minus className="h-3 w-3" />
                             </Button>
                             <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeFromCart(item.id)}>
                                <Trash2 className="h-3 w-3" />
                             </Button>
                             <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}>
                                <Plus className="h-3 w-3" />
                             </Button>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          <div className="p-4 bg-gray-50 space-y-4 border-t">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-primary">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-xs pt-2 border-t border-gray-200">
                 <span className="text-muted-foreground">Current Balance</span>
                 <span className={student.balance < cartTotal ? "text-red-500 font-bold" : "text-gray-700"}>
                    ${student.balance.toFixed(2)}
                 </span>
              </div>
            </div>

            <Button 
                className="w-full bg-primary hover:bg-blue-800 h-12 text-lg shadow-md" 
                disabled={cart.length === 0 || student.balance < cartTotal}
                onClick={handleCheckout}
            >
              {student.balance < cartTotal ? "Insufficient Balance" : "Generate Order QR"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
