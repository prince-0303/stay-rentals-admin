import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { loginAdmin } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: loginAdmin,
        onSuccess: (res) => {
            console.log("LOGIN RESPONSE", res.data);
            const { admin, user } = res.data;
            const userData = admin || user;

            if (userData?.role !== "admin") {
                toast.error("Access denied. Admin privileges required.");
                return;
            }

            setAuth(true, userData);
            toast.success("Welcome back, Admin!");
            navigate("/");
        },
        onError: (err) => {
            const msg = err.response?.data?.detail || err.response?.data?.message || "Login failed. Check your credentials.";
            toast.error(msg);
        },
    });

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            {/* Background gradient */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex w-14 h-14 bg-primary rounded-2xl items-center justify-center mb-4 shadow-lg shadow-primary/25">
                        <Shield className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Rental Platform Administration</p>
                </div>

                {/* Card */}
                <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Email Address
                            </label>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="admin@platform.com"
                                autoComplete="email"
                                className="w-full px-3 py-2.5 text-sm bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                            />
                            {errors.email && (
                                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full px-3 py-2.5 pr-10 text-sm bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all shadow-sm shadow-primary/30 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                        >
                            {isPending && (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            )}
                            {isPending ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    Restricted access — authorized administrators only
                </p>
            </div>
        </div>
    );
}
