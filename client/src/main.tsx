import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/feature/Context/authContext";
import { CartProvider } from "./feature/Context/CartContext";
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
  <CartProvider>
  <AuthProvider>
    <App />
    </AuthProvider>
  </CartProvider>
  </BrowserRouter>,
);
