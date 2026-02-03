import { Link, useLocation } from "wouter";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Utensils, 
  ClipboardList, 
  BarChart3, 
  LogOut,
  Menu as MenuIcon
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useData();
  const [location] = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full text-white">
      <div className="p-6 border-b border-blue-800">
        <h1 className="font-serif font-bold text-2xl text-yellow-400">Admin Portal</h1>
        <p className="text-blue-200 text-sm">Meal System Management</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <NavItem href="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem href="/admin/students" icon={Users} label="Students" />
        <NavItem href="/admin/menu" icon={Utensils} label="Menu Management" />
        <NavItem href="/admin/orders" icon={ClipboardList} label="Orders & QR" />
        <NavItem href="/admin/reports" icon={BarChart3} label="Reports" />
      </nav>

      <div className="p-4 border-t border-blue-800">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-blue-200 hover:bg-blue-800 hover:text-white gap-2"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const isActive = location === href;
    return (
      <Link href={href}>
        <a className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
          isActive 
            ? "bg-yellow-500 text-blue-900 font-bold shadow-md" 
            : "text-blue-100 hover:bg-blue-800 hover:pl-6"
        }`}>
          <Icon className="h-5 w-5" />
          {label}
        </a>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-primary shrink-0">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-primary p-4 text-white flex justify-between items-center sticky top-0 z-50">
          <span className="font-bold font-serif">Admin Portal</span>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-blue-800">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-primary border-r-blue-800 w-64">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
