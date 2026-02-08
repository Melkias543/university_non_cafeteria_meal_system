import { createContext, useContext, useState, useMemo, ReactNode, useEffect } from "react";

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
};

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

useEffect(() => {
 const stored = localStorage.getItem("authData");
 if (stored) {
   const { token, user } = JSON.parse(stored);
   setAccessToken(token);
   setUser(user);
 }


},[] )// Optional: Add logic to check for existing auth data in localStorage on mount



 const login = (token: string, userData: User) => {
   setAccessToken(token);
   setUser(userData);

   localStorage.setItem("authData", JSON.stringify({ token, user: userData }));
 };


  const logout = () => {
    localStorage.removeItem("authData");
    setAccessToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: !!accessToken,
      login,
      logout,
    }),
    [user, accessToken],
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
