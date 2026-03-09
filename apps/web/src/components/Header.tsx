"use client";

import { useAuth } from "@/hooks/useAuth";
import { Bell, User, Search, Loader2 } from "lucide-react";

export default function Header() {
    const { user, organization, isLoading } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                {isLoading ? (
                    <div className="h-6 w-32 bg-gray-50 animate-pulse rounded"></div>
                ) : (
                    <h2 className="text-sm font-bold text-primary uppercase tracking-widest">
                        {organization?.name || "Inventory Control"}
                    </h2>
                )}
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-2 text-gray-400 group cursor-pointer">
                    <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
                    <span className="text-xs font-medium group-hover:text-primary transition-colors">Quick Search (⌘K)</span>
                </div>

                <div className="h-8 w-px bg-gray-100 hidden sm:block"></div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-full transition-all relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
                    </button>

                    <div className="flex items-center gap-3 pl-2 border-l border-gray-100">
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-bold text-primary truncate max-w-[150px]">
                                {user?.email.split('@')[0] || "Guest"}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                Admin
                            </p>
                        </div>
                        <div className="w-9 h-9 bg-primary/5 border border-primary/10 rounded-full flex items-center justify-center text-primary font-black shadow-inner">
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                user?.email?.charAt(0).toUpperCase() || "A"
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
