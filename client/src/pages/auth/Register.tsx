import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import {
  Mail,
  Lock,
  UserCheck,
  Shield,
  ChevronRight,
  Loader2,
  Eye,
  EyeOff,
  Globe,
  CheckCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { RegisterInput, registerSchema } from "@/types/validadion";
import api from "@/apiService/api";

const Register = () => {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      full_name: "",
      email: "",
      status: "pending",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setError(null);
      const response = await api.post("/register", data);
      Swal.fire({
        title: "Registration Successful",
        text: response.data.message,
        icon: "success",
        confirmButtonColor: "#F6863E",
      });
      navigate("/login");
    } catch (error: any) {
      setError(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F6863E] flex items-center justify-center p-4 lg:p-12 relative overflow-hidden font-sans">
      {/* BACKGROUND ELEMENTS */}
      {/* Subtle Dot Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <pattern
            id="dots"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle fill="#FFF" cx="2" cy="2" r="1.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Decorative Glowing Orbs for Depth */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/20 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-6xl relative z-10 transition-all duration-700">
        {/* MAIN CONTAINER: Added backdrop-blur-xl and semi-transparent bg */}
        <div className="bg-white/85 backdrop-blur-xl rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] overflow-hidden border border-white/40">
          <div className="grid lg:grid-cols-12">
            {/* Left Column: Form Section (7 cols) */}
            {/* Using bg-white/50 to let the blur effect show through slightly */}
            <div className="lg:col-span-7 p-8 md:p-16 bg-white/60">
              <header className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6863E] text-white text-[10px] font-bold uppercase tracking-widest mb-4 shadow-sm">
                  <Shield size={12} /> Institutional Enrollment
                </div>
                <h2 className="text-4xl font-extrabold text-zinc-900 tracking-tight">
                  Create Account
                </h2>
                <p className="text-zinc-600 text-sm mt-2 font-medium">
                  Join the UniMeal network for secure resource management.
                </p>
                {error && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-200 rounded-2xl text-red-600 text-xs font-bold backdrop-blur-sm">
                    {error}
                  </div>
                )}
              </header>

              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid md:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="relative group md:col-span-2">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1 block">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserCheck
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#F6863E] transition-colors"
                        size={18}
                      />
                      <input
                        {...register("full_name")}
                        className="w-full bg-white/80 border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 text-zinc-900 text-sm focus:outline-none focus:border-[#F6863E] focus:ring-4 focus:ring-[#F6863E]/10 transition-all placeholder:text-zinc-400"
                        placeholder="e.g. Alexander Pierce"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="relative group md:col-span-2">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1 block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#F6863E] transition-colors"
                        size={18}
                      />
                      <input
                        {...register("email")}
                        className="w-full bg-white/80 border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 text-zinc-900 text-sm focus:outline-none focus:border-[#F6863E] focus:ring-4 focus:ring-[#F6863E]/10 transition-all placeholder:text-zinc-400"
                        placeholder="name@university.edu"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="relative group">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1 block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#F6863E] transition-colors"
                        size={18}
                      />
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        className="w-full bg-white/80 border border-zinc-200 rounded-2xl py-4 pl-12 pr-12 text-zinc-900 text-sm focus:outline-none focus:border-[#F6863E] focus:ring-4 focus:ring-[#F6863E]/10 transition-all placeholder:text-zinc-400"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#F6863E] transition-colors"
                      >
                        {showPassword ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="relative group">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1 block">
                      Verify Security
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#F6863E] transition-colors"
                        size={18}
                      />
                      <input
                        {...register("password_confirmation")}
                        type={showPassword ? "text" : "password"}
                        className="w-full bg-white/80 border border-zinc-200 rounded-2xl py-4 pl-12 pr-12 text-zinc-900 text-sm focus:outline-none focus:border-[#F6863E] focus:ring-4 focus:ring-[#F6863E]/10 transition-all placeholder:text-zinc-400"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#F6863E] transition-colors"
                      >
                        {showPassword ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#F6863E] text-white font-bold uppercase tracking-widest text-xs py-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-[#F6863E]/30 hover:shadow-[#F6863E]/50 hover:-translate-y-0.5 transition-all duration-300 mt-6 active:scale-[0.98] disabled:opacity-70 cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Complete Registration <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </form>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#F6863E] text-white font-bold uppercase tracking-widest text-xs py-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-[#F6863E]/30 hover:shadow-[#F6863E]/50 hover:-translate-y-0.5 transition-all duration-300 mt-6 active:scale-[0.98] disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                  Continue whith Google <ChevronRight size={18} />
                  </>
                )}
              </button>
              <div className="mt-10 text-center">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                  Existing Member?{" "}
                  <Link
                    to="/login"
                    className="text-[#F6863E] hover:underline ml-1"
                  >
                    Authorize Access
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Column: Visual Side (5 cols) */}
            <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-center p-16 overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1523050335192-ce1dee6507e1?auto=format&fit=crop&q=80&w=1000"
                  alt="University Hall"
                  className="w-full h-full object-cover scale-110"
                />
                {/* Gradient Overlay to blend with the orange theme */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F6863E]/90 to-[#F6863E]/40 mix-blend-multiply" />
              </div>

              <div className="relative z-10 space-y-8">
                <div className="bg-white/20 backdrop-blur-xl p-8 rounded-[2rem] border border-white/30 shadow-2xl">
                  <Globe className="text-white mb-4" size={32} />
                  <h3 className="text-2xl font-bold text-white leading-tight mb-4">
                    The Modern Standard for Campus Dining.
                  </h3>
                  <div className="space-y-4">
                    {[
                      "Real-time Balance Tracking",
                      "Biometric Authentication",
                      "Multi-Campus Support",
                    ].map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 text-sm font-bold text-white/90"
                      >
                        <CheckCircle size={18} className="text-white" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 px-4 text-white">
                  <div className="w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center font-bold bg-white/10 backdrop-blur-sm">
                    2k+
                  </div>
                  <p className="text-xs font-bold leading-tight uppercase tracking-widest">
                    Active Students <br /> Authenticated Daily
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-white font-black uppercase tracking-[0.3em] text-[10px] drop-shadow-md">
          Powered by UniMeal Security Protocol v4.0
        </p>
      </div>
    </div>
  );
};

export default Register;
