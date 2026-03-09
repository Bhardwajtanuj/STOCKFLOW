"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema, SignupInput } from "@stockflow/shared";
import { apiClient } from "@/lib/api-client";
import { Warehouse, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { z } from "zod";

// Extend shared schema with confirmation for the UI
const clientSignupSchema = SignupSchema.extend({
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ClientSignupInput = z.infer<typeof clientSignupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ClientSignupInput>({
        resolver: zodResolver(clientSignupSchema),
    });

    const onSubmit = async (data: ClientSignupInput) => {
        setError(null);
        try {
            const response = await apiClient.post("/auth/signup", {
                orgName: data.orgName,
                email: data.email,
                password: data.password,
            });
            localStorage.setItem("token", response.data.token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="w-full max-w-md my-12">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-[2.5rem] mb-6 shadow-2xl shadow-accent/20 -rotate-3">
                    <Warehouse className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-black text-primary tracking-tight">Get Started</h1>
                <p className="text-gray-500 mt-3 font-medium">Empower your business with StockFlow.</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-primary/5 border border-gray-100">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {error && (
                        <div className="bg-danger/5 text-danger px-4 py-3 rounded-xl text-sm font-bold border border-danger/10">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Business Name</label>
                        <input
                            {...register("orgName")}
                            className={`input-field h-11 ${errors.orgName ? "border-danger ring-danger/10" : ""}`}
                            placeholder="Acme Global Inc."
                        />
                        {errors.orgName && <p className="text-danger text-[10px] font-bold mt-1 pl-1 uppercase tracking-wider">{errors.orgName.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Company Email</label>
                        <input
                            {...register("email")}
                            type="email"
                            className={`input-field h-11 ${errors.email ? "border-danger ring-danger/10" : ""}`}
                            placeholder="admin@acme.com"
                        />
                        {errors.email && <p className="text-danger text-[10px] font-bold mt-1 pl-1 uppercase tracking-wider">{errors.email.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Password</label>
                            <input
                                {...register("password")}
                                type="password"
                                className={`input-field h-11 ${errors.password ? "border-danger ring-danger/10" : ""}`}
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Confirm</label>
                            <input
                                {...register("confirmPassword")}
                                type="password"
                                className={`input-field h-11 ${errors.confirmPassword ? "border-danger ring-danger/10" : ""}`}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    {(errors.password || errors.confirmPassword) && (
                        <p className="text-danger text-[10px] font-bold pl-1 uppercase tracking-wider">
                            {errors.password?.message || errors.confirmPassword?.message}
                        </p>
                    )}

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl mt-2">
                        <ShieldCheck className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <p className="text-[10px] leading-relaxed text-gray-400 font-medium italic">
                            By creating an account, you agree to our <span className="text-primary font-bold cursor-pointer underline">Terms</span> and <span className="text-primary font-bold cursor-pointer underline">Privacy Policy</span>.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full h-14 text-base font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/20 group mt-4"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Create Account
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                    <p className="text-gray-400 text-sm font-medium">
                        Already have an account?{" "}
                        <Link href="/login" className="text-accent font-black hover:text-primary transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
