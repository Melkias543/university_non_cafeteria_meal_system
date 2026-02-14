import api from "@/apiService/api";
import { createContext, useContext, useState, useMemo, ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";

/* ================= TYPES ================= */

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "student";
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  balance: number | null;
  // setBalance: (value: number) => void;
  // getUserBalance: () => Promise<void>;
};

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [balance, setBalance] =useState(null)
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
    // console.log(balance);

useEffect(() => {
 const stored = localStorage.getItem("authData");
 if (stored) {
   const { token, user } = JSON.parse(stored);
   setAccessToken(token);
   setUser(user);
   getUserBalance()
 }




},[] )// Optional: Add logic to check for existing auth data in localStorage on mount


const  getUserBalance= async()=>{
  try {
    const res = await api.get(`/user/balance`)
    setBalance(res.data.balance)
    // console.log(res.data)
    
  } catch (error:any) {
    console.error("Failed to fetch user balance", error);
    
  }
}
 const login = async(token: string, userData: User) => {
   setAccessToken(token);
   setUser(userData);

   localStorage.setItem("authData", JSON.stringify({ token, user: userData ,balance}));
   await getUserBalance()
 };


  const logout = () => {
    localStorage.removeItem("authData");
    setAccessToken(null);
    setUser(null);
    setBalance(null);
    <Navigate to="/login" />
    setBalance(null)
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: !!accessToken,
      login,
      logout,
      balance,
    }),
    [user, accessToken,balance],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ================= HOOK ================= */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
