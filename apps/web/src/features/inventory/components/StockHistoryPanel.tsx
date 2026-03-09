"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
    History,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar,
    FileText,
    PackageCheck
} from "lucide-react";
import { format } from "date-fns";

interface StockHistoryPanelProps {
    productId: string;
}

export default function StockHistoryPanel({ productId }: StockHistoryPanelProps) {
    const { data: movements, isLoading } = useQuery({
        queryKey: ["product-movements", productId],
        queryFn: async () => {
            const response = await apiClient.get(`/products/${productId}/movements`);
            return response.data;
        },
    });

    if (isLoading) {
        return (
            <div className="card space-y-4 animate-pulse">
                <div className="h-6 bg-gray-100 rounded w-1/3"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-gray-50 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="card !p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-primary">Stock Movement History</h3>
                </div>
            </div>

            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {movements?.length === 0 ? (
                    <div className="px-6 py-12 text-center text-gray-400">
                        <PackageCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="italic">No inventory movements recorded yet.</p>
                    </div>
                ) : (
                    movements?.map((m: any) => {
                        const isIncrease = m.change > 0;
                        return (
                            <div key={m.id} className="px-6 py-4 hover:bg-gray-50/30 transition-colors flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl ${isIncrease ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                                        {isIncrease ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-lg font-bold ${isIncrease ? 'text-success' : 'text-danger'}`}>
                                                {isIncrease ? "+" : ""}{m.change}
                                            </span>
                                            <span className="text-sm font-semibold text-gray-500">units</span>
                                        </div>
                                        {m.note && (
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                                                <FileText className="w-3 h-3" />
                                                {m.note}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-primary">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {format(new Date(m.createdAt), "MMM d, yyyy")}
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-0.5">
                                        {format(new Date(m.createdAt), "HH:mm a")}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
