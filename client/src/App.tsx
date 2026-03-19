import { Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { DataProvider } from "./context/DataContext";
import Login from "./pages/auth/Login";
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
import LandingPage from "./pages/landinPages";
import Register from "./pages/auth/Register";
import {
  ProtectedRoute,
  StudentPages,
  AdminPages,
} from "./Routes/protectedRoutes";
import OrderQueue from "./pages/student/OrderQueue";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ---------------- STUDENT ---------------- */}
      <Route element={<ProtectedRoute />}>
        <Route element={<StudentPages />}>
          <Route
            path="/student/dashboard"
            element={
              <StudentLayout>
                <StudentDashboard />
              </StudentLayout>
            }
          />
          <Route
            path="/student/order-queues"
            element={
              <StudentLayout>
                <OrderQueue />
              </StudentLayout>
            }
          />
          {/* /student/order-queues */}
          <Route
            path="/student/menu"
            element={
              <StudentLayout>
                <StudentMenu />
              </StudentLayout>
            }
          />
          <Route
            path="/student/order"
            element={
              <StudentLayout>
                <StudentOrder />
              </StudentLayout>
            }
          />
          <Route
            path="/student/history"
            element={
              <StudentLayout>
                <StudentHistory />
              </StudentLayout>
            }
          />
        </Route>
      </Route>

      {/* ---------------- ADMIN ---------------- */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminPages />}>
          <Route
            path="/admin/dashboard"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/students"
            element={
              <AdminLayout>
                <AdminStudents />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <AdminLayout>
                <AdminMenu />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <AdminLayout>
                <AdminReports />
              </AdminLayout>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
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
