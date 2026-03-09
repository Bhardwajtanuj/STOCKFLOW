"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginInput } from "@stockflow/shared";
import { apiClient } from "@/lib/api-client";
import { Warehouse, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema as any),
    });

    const onSubmit = async (data: LoginInput) => {
        setError(null);
        try {
            const response = await apiClient.post("/auth/login", data);
            localStorage.setItem("token", response.data.token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-[2.5rem] mb-6 shadow-2xl shadow-primary/20 rotate-3">
                    <Warehouse className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-black text-primary tracking-tight">Welcome Back</h1>
                <p className="text-gray-500 mt-3 font-medium">Control your inventory with ease.</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-primary/5 border border-gray-100">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {error && (
                        <div className="bg-danger/5 text-danger px-4 py-3 rounded-xl text-sm font-bold border border-danger/10 animate-in shake-in duration-300">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                        <input
                            {...register("email")}
                            type="email"
                            className={`input-field h-12 ${errors.email ? "border-danger ring-danger/10" : ""}`}
                            placeholder="name@company.com"
                        />
                        {errors.email && <p className="text-danger text-[10px] font-bold mt-1 pl-1 uppercase tracking-wider">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between pl-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
                            <Link href="#" className="text-[10px] font-black text-accent uppercase tracking-widest hover:text-primary transition-colors">Forgot?</Link>
                        </div>
                        <input
                            {...register("password")}
                            type="password"
                            className={`input-field h-12 ${errors.password ? "border-danger ring-danger/10" : ""}`}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-danger text-[10px] font-bold mt-1 pl-1 uppercase tracking-wider">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full h-14 text-base font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/20 group"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                    <p className="text-gray-400 text-sm font-medium">
                        New to StockFlow?{" "}
                        <Link href="/signup" className="text-accent font-black hover:text-primary transition-colors">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
