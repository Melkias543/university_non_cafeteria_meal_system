import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function StudentMenu() {
  const { menu, currentUser, placeOrder } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cart, setCart] = useState<{item: any, quantity: number}[]>([]);

  const addToCart = (item: any) => {
    // In a real app we'd have a cart context, but for now let's just create a direct order flow 
    // OR create a local cart state that redirects to Order page.
    // Let's modify the requirement slightly: "Add to Order" usually implies building a cart.
    // The prompt says "Menu: List all menu items with Add to Order buttons".
    // And "Order Page: Select items, show order summary, generate QR".
    
    // So "Menu" page could just be a view, and "Order" page is where action happens?
    // OR Menu page adds to a global cart? 
    // Let's assume the "Order" page is a standalone ordering flow, and "Menu" is just for browsing.
    // BUT, usually you pick from Menu.
    
    // Let's make "Menu" page allow adding to a "Order Session" which is actually the Order Page.
    // Since I don't have a global cart context, I'll use localStorage or just Redirect to Order with query param?
    // Simpler: Just make the Order page THE menu selection page.
    
    // Actually, let's make this Menu page redirect to the Order page with the item pre-selected? 
    // Or just make this the Order page?
    // The prompt separates "Menu" and "Order".
    // I will treat "Menu" as a "Browse" page, and clicking "Order Now" takes you to the Order page.
    navigate('/student/order');
  };

  const categories = Array.from(new Set(menu.map(item => item.category)));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Today's Menu</h1>
        <Link to="/student/order">
            <Button>Go to Order Page</Button>
        </Link>
      </div>

      {categories.map(category => (
        <div key={category} className="space-y-4">
          <h2 className="text-xl font-bold text-primary border-b border-gray-200 pb-2">{category}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.filter(item => item.category === category).map(item => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow group h-full flex flex-col">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img 
                    src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000"} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {!item.is_available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold uppercase tracking-wider rounded">Sold Out</span>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <span className="font-bold text-lg text-primary">${item.price.toFixed(2)}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full gap-2" 
                    onClick={() => addToCart(item)}
                    disabled={!item.is_available}
                  >
                    <Plus className="h-4 w-4" /> 
                    {item.is_available ? "Order Now" : "Unavailable"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
