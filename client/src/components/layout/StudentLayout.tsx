import { Link, useLocation } from "wouter";
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

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, getStudent } = useData();
  const [location] = useLocation();
  const student = currentUser?.id ? getStudent(currentUser.id) : null;

  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const isActive = location === href;
    return (
      <Link href={href}>
        <a className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          isActive 
            ? "bg-yellow-400 text-blue-900 font-semibold" 
            : "text-blue-100 hover:bg-blue-800 hover:text-white"
        }`}>
          <Icon className="h-4 w-4" />
          {label}
        </a>
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
              <span className="bg-yellow-400 text-blue-900 rounded p-1 w-8 h-8 flex items-center justify-center">U</span>
              Meal System
            </h1>
            
            <nav className="hidden md:flex gap-2">
              <NavItem href="/student/dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavItem href="/student/menu" icon={UtensilsCrossed} label="Menu" />
              <NavItem href="/student/order" icon={ShoppingBag} label="Order" />
              <NavItem href="/student/history" icon={History} label="History" />
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {student && (
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-sm font-medium">{student.name}</span>
                <span className="text-xs text-yellow-300 font-mono">
                  ${student.balance.toFixed(2)}
                </span>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={logout}
              className="text-blue-100 hover:bg-blue-800 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Nav (Bottom) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-primary border-t border-blue-800 flex justify-around p-2 z-50">
        <Link href="/student/dashboard">
          <a className={`p-2 rounded ${location === '/student/dashboard' ? 'text-yellow-400' : 'text-blue-200'}`}>
            <LayoutDashboard className="h-6 w-6" />
          </a>
        </Link>
        <Link href="/student/menu">
          <a className={`p-2 rounded ${location === '/student/menu' ? 'text-yellow-400' : 'text-blue-200'}`}>
            <UtensilsCrossed className="h-6 w-6" />
          </a>
        </Link>
        <Link href="/student/order">
          <a className={`p-2 rounded ${location === '/student/order' ? 'text-yellow-400' : 'text-blue-200'}`}>
            <ShoppingBag className="h-6 w-6" />
          </a>
        </Link>
        <Link href="/student/history">
          <a className={`p-2 rounded ${location === '/student/history' ? 'text-yellow-400' : 'text-blue-200'}`}>
            <History className="h-6 w-6" />
          </a>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 md:p-6 pb-20 md:pb-6">
        {children}
      </main>
    </div>
  );
}
