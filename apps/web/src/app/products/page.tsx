"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    PlusCircle,
    MinusCircle,
    AlertCircle,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useInventory } from "@/features/inventory/hooks/useInventory";
import ProductForm from "@/features/inventory/components/ProductForm";

export default function ProductsPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const { products, total, isLoading, adjustStock, deleteProduct } = useInventory(search, page);

    const { data: settings } = useQuery({
        queryKey: ["settings"],
        queryFn: async () => {
            const resp = await apiClient.get("/settings");
            return resp.data;
        }
    });

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const defaultThreshold = settings?.defaultLowStockThreshold ?? 5;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Products</h1>
                    <p className="text-gray-500">Manage your inventory catalog</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="btn-primary flex items-center gap-2 py-3 px-6 shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            <div className="flex items-center gap-4 max-w-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        className="input-field pl-10"
                        placeholder="Search by name or SKU..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            <div className="card !p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-widest">
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4">SKU</th>
                                <th className="px-6 py-4">Stock Level</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                [1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-4 h-16 bg-gray-50/50"></td>
                                    </tr>
                                ))
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-gray-400 italic font-medium">
                                        No products found. Start by adding one!
                                    </td>
                                </tr>
                            ) : (
                                products.map((product: any) => {
                                    const threshold = product.lowStockThreshold ?? defaultThreshold;
                                    const isLow = product.quantityOnHand <= threshold;

                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/products/${product.id}`}
                                                    className="font-bold text-primary hover:text-accent transition-colors"
                                                >
                                                    {product.name}
                                                </Link>
                                                <div className="text-xs text-gray-400 mt-1 max-w-[200px] truncate">
                                                    {product.description || "No description"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">{product.sku}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => adjustStock({ id: product.id, adjustment: -1 })}
                                                        className="text-gray-300 hover:text-danger hover:scale-110 transition-all"
                                                    >
                                                        <MinusCircle className="w-5 h-5" />
                                                    </button>
                                                    <span className={`text-lg font-bold min-w-[3ch] text-center ${isLow ? "text-danger" : "text-primary"}`}>
                                                        {product.quantityOnHand}
                                                    </span>
                                                    <button
                                                        onClick={() => adjustStock({ id: product.id, adjustment: 1 })}
                                                        className="text-gray-300 hover:text-success hover:scale-110 transition-all"
                                                    >
                                                        <PlusCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-primary">
                                                {product.sellingPrice ? `$${Number(product.sellingPrice).toFixed(2)}` : "-"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {isLow ? (
                                                    <span className="badge-warning flex items-center gap-1 w-fit">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Low
                                                    </span>
                                                ) : (
                                                    <span className="badge-success w-fit">In Stock</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="p-2 text-gray-400 hover:text-accent hover:bg-accent/5 rounded-full transition-all"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm("Delete this product?")) deleteProduct(product.id);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-danger hover:bg-danger/5 rounded-full transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {total > 10 && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            Showing <span className="font-bold text-primary">{(page - 1) * 10 + 1}-{Math.min(page * 10, total)}</span> of <span className="font-bold text-primary">{total}</span> products
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="p-1 rounded border border-gray-200 hover:bg-white disabled:opacity-50 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-500" />
                            </button>
                            <button
                                disabled={page * 10 >= total}
                                onClick={() => setPage(page + 1)}
                                className="p-1 rounded border border-gray-200 hover:bg-white disabled:opacity-50 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showForm && (
                <ProductForm
                    product={editingProduct}
                    onSuccess={() => setShowForm(false)}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </div>
    );
}
