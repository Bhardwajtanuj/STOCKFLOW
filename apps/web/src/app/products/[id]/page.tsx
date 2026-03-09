"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { ArrowLeft, Package, AlertTriangle, TrendingUp, DollarSign, Box } from "lucide-react";
import StockHistoryPanel from "@/features/inventory/components/StockHistoryPanel";

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const { data: product, isLoading, error } = useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            const response = await apiClient.get(`/products/${id}`);
            return response.data;
        },
    });

    const { data: settings } = useQuery({
        queryKey: ["settings"],
        queryFn: async () => {
            const resp = await apiClient.get("/settings");
            return resp.data;
        }
    });

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-8">
                <div className="h-8 bg-gray-100 rounded w-1/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-32 bg-gray-50 rounded-xl"></div>
                    <div className="h-32 bg-gray-50 rounded-xl"></div>
                    <div className="h-32 bg-gray-50 rounded-xl"></div>
                </div>
                <div className="h-64 bg-gray-50 rounded-xl"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertTriangle className="w-12 h-12 text-danger mb-4" />
                <h2 className="text-2xl font-bold text-primary">Product Not Found</h2>
                <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or you don't have access.</p>
                <button
                    onClick={() => router.push("/products")}
                    className="btn-primary px-6 py-2"
                >
                    Back to Products
                </button>
            </div>
        );
    }

    const threshold = product.lowStockThreshold ?? settings?.defaultLowStockThreshold ?? 5;
    const isLow = product.quantityOnHand <= threshold;

    return (
        <div className="space-y-8">
            <button
                onClick={() => router.push("/products")}
                className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Products
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/5 rounded-lg">
                            <Package className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{product.sku}</span>
                    </div>
                    <h1 className="text-4xl font-bold text-primary">{product.name}</h1>
                    <p className="text-gray-500 mt-2 max-w-2xl">{product.description || "No description provided."}</p>
                </div>

                <div className="flex items-center gap-3">
                    {isLow && (
                        <div className="badge-warning flex items-center gap-2 px-4 py-2">
                            <AlertTriangle className="w-4 h-4" />
                            Low Stock Alert
                        </div>
                    )}
                    <div className={`px-4 py-2 rounded-full font-bold ${isLow ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                        {product.quantityOnHand} units in stock
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card border-l-4 border-accent">
                    <div className="flex items-center gap-3 mb-2 text-gray-400">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Selling Price</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                        {product.sellingPrice ? `$${Number(product.sellingPrice).toFixed(2)}` : "Not set"}
                    </div>
                </div>

                <div className="card border-l-4 border-gray-200">
                    <div className="flex items-center gap-3 mb-2 text-gray-400">
                        <Box className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Cost Price</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                        {product.costPrice ? `$${Number(product.costPrice).toFixed(2)}` : "Not set"}
                    </div>
                </div>

                <div className="card border-l-4 border-primary">
                    <div className="flex items-center gap-3 mb-2 text-gray-400">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Total Value</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                        {product.sellingPrice ? `$${(product.quantityOnHand * Number(product.sellingPrice)).toFixed(2)}` : "N/A"}
                    </div>
                </div>
            </div>

            <StockHistoryPanel productId={id as string} />
        </div>
    );
}
