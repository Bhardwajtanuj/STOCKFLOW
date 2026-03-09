"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
    LayoutDashboard,
    Package,
    Settings,
    LogOut,
    Warehouse,
    ChevronRight
} from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    const navItems = [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Inventory", href: "/products", icon: Package },
        { label: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <div className="fixed inset-y-0 left-0 w-64 bg-primary text-white flex flex-col z-20 shadow-2xl">
            <div className="p-8">
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                    <div className="p-2 bg-accent rounded-xl shadow-lg shadow-accent/20">
                        <Warehouse className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tight leading-none">StockFlow</h1>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Enterprise</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 mt-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between group px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive
                                    ? "bg-accent text-white shadow-lg shadow-accent/20"
                                    : "text-white/50 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className="font-bold text-sm tracking-wide">{item.label}</span>
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <div className="bg-white/5 rounded-2xl p-2 border border-white/5">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl text-white/50 hover:bg-white/10 hover:text-white transition-all font-bold text-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
                <div className="px-4 py-4 text-center">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">v1.0.4-beta</p>
                </div>
            </div>
        </div>
    );
}
