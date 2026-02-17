import { Link, useLocation } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  History, 
  LogOut, 
  UserCircle 
} from "lucide-react";
// import { CardTitle } from "../ui//card";

import { ShoppingBasket } from "lucide-react";
import { useCart } from "@/feature/Context/CartContext";
import { useAuth } from "@/feature/Context/authContext";

export default function StudentLayout({ children }: { children: React.ReactNode }) {

  const {state,dispatch}= useCart()
  const {logout,user,balance} =useAuth()
  const currentUser = user
  const student = currentUser?.id ? currentUser.id : null;





  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const isActive = location.pathname === href;
    return (
      <Link to={href} className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
        isActive 
          ? "bg-accent text-gray-900 font-semibold shadow-sm" 
          : "text-orange-100 hover:bg-orange-600 hover:text-white"
      }`}>
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-primary text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="font-serif font-bold text-xl tracking-wide flex items-center gap-2">
              <span className="bg-accent text-gray-900 rounded p-1 w-8 h-8 flex items-center justify-center font-black">
                U
              </span>
              Meal System
            </h1>

            <nav className="hidden md:flex gap-2">
              <NavItem
                href="/student/dashboard"
                icon={LayoutDashboard}
                label="Dashboard"
              />
              <NavItem
                href="/student/menu"
                icon={UtensilsCrossed}
                label="Menu"
              />
              <NavItem href="/student/order" icon={ShoppingBag} label="Order" />
              <NavItem href="/student/history" icon={History} label="History" />
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {student && (
              <div className="hidden sm:flex flex-col items-end mr-4 space-y-1">
                {/* User Name */}
                <span className="text-sm font-medium text-gray-800">
                  {currentUser?.name}
                </span>

                {/* Balance Display */}
                <span className="text-sm font-mono font-bold text-gray-700">
                  Your Total Balance:{" "}
                  <span className="text-green-600 text-lg font-extrabold bg-green-50 px-3 py-1 rounded-lg shadow-md border border-green-200">
                    💰 ${balance ?? 0}
                  </span>
                </span>
              </div>
            )}

            <Link to="/student/order">
              <div className="text-orange-100 cursor-pointer hover:text-white">
                <span className="items-center justify-center ml-1">
                  {state.totalItems}
                </span>
                <ShoppingBasket className="h-5 w-5" />
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-orange-100 hover:bg-orange-600 hover:text-white cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Nav (Bottom) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-primary border-t border-orange-600 flex justify-around p-2 z-50 shadow-lg">
        <Link
          to="/student/dashboard"
          className={`p-2 rounded ${location.pathname === "/student/dashboard" ? "text-accent bg-orange-600" : "text-orange-100"}`}
        >
          <LayoutDashboard className="h-6 w-6" />
        </Link>
        <Link
          to="/student/menu"
          className={`p-2 rounded ${location.pathname === "/student/menu" ? "text-accent bg-orange-600" : "text-orange-100"}`}
        >
          <UtensilsCrossed className="h-6 w-6" />
        </Link>
        <Link
          to="/student/order"
          className={`p-2 rounded ${location.pathname === "/student/order" ? "text-accent bg-orange-600" : "text-orange-100"}`}
        >
          <ShoppingBag className="h-6 w-6" />
        </Link>
        <Link
          to="/student/history"
          className={`p-2 rounded ${location.pathname === "/student/history" ? "text-accent bg-orange-600" : "text-orange-100"}`}
        >
          <History className="h-6 w-6" />
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 md:p-6 pb-20 md:pb-6">
        {children}
      </main>
    </div>
  );
}
