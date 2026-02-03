import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { DataProvider } from "./context/DataContext";
import Login from "./pages/Login";
import NotFound from "./pages/not-found";
import StudentLayout from "./components/layout/StudentLayout";
import AdminLayout from "./components/layout/AdminLayout";
import StudentDashboard from "./pages/student/Dashboard";
import StudentMenu from "./pages/student/Menu";
import StudentOrder from "./pages/student/Order";
import StudentHistory from "./pages/student/History";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/Students";
import AdminMenu from "./pages/admin/Menu";
import AdminOrders from "./pages/admin/Orders";
import AdminReports from "./pages/admin/Reports";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      
      {/* Student Routes */}
      <Route path="/student/dashboard">
        <StudentLayout><StudentDashboard /></StudentLayout>
      </Route>
      <Route path="/student/menu">
        <StudentLayout><StudentMenu /></StudentLayout>
      </Route>
      <Route path="/student/order">
        <StudentLayout><StudentOrder /></StudentLayout>
      </Route>
      <Route path="/student/history">
        <StudentLayout><StudentHistory /></StudentLayout>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/dashboard">
        <AdminLayout><AdminDashboard /></AdminLayout>
      </Route>
      <Route path="/admin/students">
        <AdminLayout><AdminStudents /></AdminLayout>
      </Route>
      <Route path="/admin/menu">
        <AdminLayout><AdminMenu /></AdminLayout>
      </Route>
      <Route path="/admin/orders">
        <AdminLayout><AdminOrders /></AdminLayout>
      </Route>
      <Route path="/admin/reports">
        <AdminLayout><AdminReports /></AdminLayout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <Router />
        <Toaster />
      </DataProvider>
    </QueryClientProvider>
  );
}

export default App;
