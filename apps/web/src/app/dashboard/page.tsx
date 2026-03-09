"use client";

import { useDashboard } from "@/hooks/useDashboard";
import {
    Package,
    Layers,
    AlertTriangle,
    TrendingUp,
    ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const { summary, isLoading } = useDashboard();

    if (isLoading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-gray-50 rounded-xl"></div>
                    ))}
                </div>
                <div className="h-96 bg-gray-50 rounded-xl"></div>
            </div>
        );
    }

    const stats = [
        {
            label: "Total Products",
            value: summary?.totalProducts || 0,
            icon: Package,
            color: "bg-primary",
            description: "Active items in catalog"
        },
        {
            label: "Total Units",
            value: summary?.totalUnits || 0,
            icon: Layers,
            color: "bg-accent",
            description: "Inventory volume"
        },
        {
            label: "Low Stock Items",
            value: summary?.lowStockCount || 0,
            icon: AlertTriangle,
            color: summary?.lowStockCount > 0 ? "bg-danger" : "bg-success",
            description: "Items needing attention"
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
                <p className="text-gray-500">Real-time overview of your business</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="card flex items-start justify-between group hover:border-primary/20 transition-all">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-4xl font-bold mt-2 text-primary">{stat.value}</h3>
                                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    {stat.description}
                                </p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg shadow-${stat.color.split('-')[1]}/20`}>
                                <Icon className="w-6 h-6" />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="card !p-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                        <AlertTriangle className="w-5 h-5 text-warning" />
                        Low Stock Alerts
                    </h2>
                    <Link
                        href="/products"
                        className="text-accent text-sm font-bold flex items-center gap-1 hover:text-primary transition-colors"
                    >
                        View All
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {summary?.lowStockItems?.length === 0 ? (
                    <div className="text-center py-20 bg-white">
                        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-success" />
                        </div>
                        <p className="text-gray-500 font-medium">Your inventory levels are healthy!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-gray-100">
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">SKU</th>
                                    <th className="px-6 py-4">Quantity</th>
                                    <th className="px-6 py-4">Threshold</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {summary?.lowStockItems?.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-primary">{item.name}</td>
                                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">{item.sku}</td>
                                        <td className="px-6 py-4 font-bold text-danger">{item.quantityOnHand}</td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">{item.lowStockThreshold || 5}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="badge-warning">Action Required</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
