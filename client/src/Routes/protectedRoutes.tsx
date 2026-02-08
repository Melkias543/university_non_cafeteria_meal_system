

import { useAuth } from "@/feature/Context/authContext";
import { ReactNode } from "react";
import { set } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {UnAuthinticated} from "./UnAuthinticated";
import { Outlet } from "react-router-dom";
type props ={
    children:ReactNode
}

    //GENERAL PROTECTED ROUTE


export const ProtectedRoute = () => {
  const { isAuthenticated, user, accessToken } = useAuth();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user || !accessToken) {
      const timer = setTimeout(() => setRedirect(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, accessToken]);

  if (!isAuthenticated || !user || !accessToken) {
    if (redirect) return <Navigate to="/login" replace />;
    return (
    <UnAuthinticated/>
    );
  }

  return <Outlet />;   // ✅ THIS};
}

//STUDENT PAGES PROTECTED ROUTE
export const StudentPages = () => {
  const [redirect, setRedirect] = useState(false);

  const { isAuthenticated, user, accessToken } = useAuth();
  useEffect(() => {
    if (!isAuthenticated || !user || !accessToken) {
      const timer = setTimeout(() => setRedirect(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, accessToken]);
  if (!isAuthenticated || !user || user.role !== "student") {
    if (!isAuthenticated || !user || !accessToken || user.role !== "student") {
      if (redirect) return <Navigate to="/login" replace />;
      return <UnAuthinticated />;
    }
  }

  return <Outlet />; // ✅ THIS
}



//ADMIN PAGES PROTECTED ROUTE

    export const AdminPages = () => {
      const [redirect, setRedirect] = useState(false);

      const { isAuthenticated, user, accessToken } = useAuth();
      useEffect(() => {
        if (!isAuthenticated || !user || !accessToken) {
          const timer = setTimeout(() => setRedirect(true), 2000);
          return () => clearTimeout(timer);
        }
      }, [isAuthenticated, user, accessToken]);

      if (!isAuthenticated || !user || !accessToken || user.role !== "admin") {
        if (redirect) return <Navigate to="/login" replace />;
        return <UnAuthinticated />;
      }

      return <Outlet />; // ✅ THIS
    }