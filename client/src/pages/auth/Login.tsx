import React, { useState } from "react";
import {
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Activity,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LoginInput, loginSchema } from "@/types/validadion";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import api from "@/apiService/api";
import { useAuth } from "@/feature/Context/authContext";

const Login = () => {
  const [error, setEror] = useState<string | null>(null);

const { login } = useAuth(); // Use the auth context if needed u
const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

 const onSubmit = async (data: LoginInput) => {
   try {
     const response = await api.post("/login", data);
     const apiData = response.data.data;

     const user = {
       id: apiData.id,
       name: apiData.full_name,
       email: apiData.email,
       role: apiData.roles[0].name,
     };

     // 1. UPDATE STATE FIRST (Crucial)
     // This ensures that when the route changes, the Auth Guard sees the user
      login(response.data.access_token, user);

     // 2. SHOW SUCCESS MESSAGE
     Swal.fire({
       title: "Login Successful",
       text: response.data.message || "You have successfully logged in.",
       icon: "success",
       timer: 1500, // Optional: auto-close so user gets to the dashboard faster
       showConfirmButton: false,
     });

     // 3. NAVIGATE BASED ON ROLE
     // Using a simple check or a mapping object
     const role = user.role.toLowerCase();
     if (role === "admin") {
       navigate("/admin/dashboard", { replace: true });
     } else {
       navigate("/student/dashboard", { replace: true });
     }

     setEror(null);
   } catch (error: any) {
     const errorMessage =
       error.response?.data?.message || "An unexpected error occurred.";
     setEror(errorMessage);

     Swal.fire({
       title: "Login Failed",
       text: errorMessage,
       icon: "error",
     });
   }
 };

  return (
    <div className="min-h-screen bg-[#F6863E] flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Soft Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern
            id="dots"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle fill="#FFF" cx="2" cy="2" r="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="w-full max-w-5xl relative z-10">
        {/* Main Container: Shifted from Black to Glass/White */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.2)] overflow-hidden border border-white/20">
          <div className="grid md:grid-cols-2">
            {/* Left Side: Clean Form */}
            <div className="p-10 md:p-16 bg-white flex flex-col justify-center">
              <header className="mb-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-[#F6863E] p-2 rounded-xl">
                    <ShieldCheck className="text-white" size={24} />
                  </div>
                  <h1 className="text-zinc-900 font-bold tracking-tight text-xl">
                    UniMeal<span className="text-[#F6863E]">Secure</span>
                  </h1>
                </div>

                <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight mb-2">
                  Welcome Back
                </h2>
                <p className="text-zinc-500 text-sm">
                  Please enter your credentials to access the system.
                </p>

                {error && (
                  <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-semibold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                    {error}
                  </div>
                )}
              </header>

              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#F6863E] transition-colors"
                      size={18}
                    />
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="e.g. admin@unimeal.com"
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-12 pr-4 text-zinc-900 text-sm focus:outline-none focus:border-[#F6863E] focus:ring-4 focus:ring-[#F6863E]/5 transition-all"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-[10px] mt-1 font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#F6863E] transition-colors"
                      size={18}
                    />
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...register("password")}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-12 pr-4 text-zinc-900 text-sm focus:outline-none focus:border-[#F6863E] focus:ring-4 focus:ring-[#F6863E]/5 transition-all"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-[10px] mt-1 font-medium">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-1">
                  <a
                    href="#"
                    className="text-xs font-semibold text-[#F6863E] hover:underline decoration-2"
                  >
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#F6863E] text-white font-bold text-sm py-4 rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#F6863E]/30 transition-all active:scale-[0.98] disabled:opacity-70 mt-4"
                >
                  {isSubmitting ? "Authenticating..." : "Sign In to Dashboard"}
                  <ArrowRight size={18} />
                </button>
              </form>

              <div className="mt-10 text-center border-t border-zinc-50 pt-8">
                <p className="text-zinc-500 text-sm">
                  New to the platform?{" "}
                  <Link
                    to="/register"
                    className="text-[#F6863E] font-bold hover:text-[#d76e2d] transition-colors"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Side: Professional High-Key Image */}
            <div className="hidden md:block relative bg-zinc-50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F6863E]/20 to-white/80 z-10" />
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"
                alt="Office Space"
                className="w-full h-full object-cover"
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 z-20 p-12 flex flex-col justify-end">
                <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/50 shadow-sm">
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-1 rounded-full bg-[#F6863E]/40"
                      />
                    ))}
                  </div>
                  <h3 className="text-zinc-900 font-bold text-2xl leading-tight mb-4">
                    Streamlining institutional nutrition management.
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Real-time inventory sync",
                      "Secure biometric IDs",
                      "Enterprise reporting",
                    ].map((text) => (
                      <div
                        key={text}
                        className="flex items-center gap-2 text-zinc-700 text-sm font-medium"
                      >
                        <CheckCircle2 size={16} className="text-[#F6863E]" />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Footer */}
        <div className="mt-8 text-center text-white/80 text-xs font-medium tracking-wide">
          © 2026 UNIMEAL SECURE SYSTEMS • ALL RIGHTS RESERVED
        </div>
      </div>
    </div>
  );
};

export default Login;
