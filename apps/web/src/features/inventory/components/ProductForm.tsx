"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductCreateSchema, ProductCreateInput } from "@stockflow/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { X, Loader2 } from "lucide-react";
import { useEffect } from "react";

interface ProductFormProps {
    product?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
    const queryClient = useQueryClient();
    const isEditing = !!product;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProductCreateInput>({
        resolver: zodResolver(ProductCreateSchema as any),
        defaultValues: product || {
            name: "",
            sku: "",
            description: "",
            quantityOnHand: 0,
            costPrice: undefined,
            sellingPrice: undefined,
            lowStockThreshold: 5,
        },
    });

    useEffect(() => {
        if (product) reset(product);
    }, [product, reset]);

    const mutation = useMutation({
        mutationFn: async (data: ProductCreateInput) => {
            if (isEditing) {
                return apiClient.patch(`/products/${product.id}`, data);
            }
            return apiClient.post("/products", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            onSuccess();
        },
    });

    const onSubmit = (data: ProductCreateInput) => {
        mutation.mutate(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-xl font-bold text-primary">
                        {isEditing ? "Edit Product" : "New Product"}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded-full transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                Product Name
                            </label>
                            <input
                                {...register("name")}
                                className={`input-field ${errors.name ? "border-danger ring-danger/10" : ""}`}
                                placeholder="e.g. Wireless Mouse"
                            />
                            {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                SKU
                            </label>
                            <input
                                {...register("sku")}
                                disabled={isEditing}
                                className={`input-field ${errors.sku ? "border-danger ring-danger/10" : ""} disabled:bg-gray-50 disabled:cursor-not-allowed`}
                                placeholder="PROD-001"
                            />
                            {errors.sku && <p className="mt-1 text-xs text-danger">{errors.sku.message}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                Initial Stock
                            </label>
                            <input
                                type="number"
                                {...register("quantityOnHand", { valueAsNumber: true })}
                                disabled={isEditing}
                                className={`input-field ${errors.quantityOnHand ? "border-danger ring-danger/10" : ""} disabled:bg-gray-50 disabled:cursor-not-allowed`}
                            />
                            {errors.quantityOnHand && (
                                <p className="mt-1 text-xs text-danger">{errors.quantityOnHand.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                Cost Price
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register("costPrice", { valueAsNumber: true })}
                                    className="input-field pl-7"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                Selling Price
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register("sellingPrice", { valueAsNumber: true })}
                                    className="input-field pl-7"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="col-span-2 font-medium">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                Description
                            </label>
                            <textarea
                                {...register("description")}
                                rows={3}
                                className="input-field resize-none"
                                placeholder="Product details and specifications..."
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 italic">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-primary transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || mutation.isPending}
                            className="btn-primary flex items-center gap-2 px-8 py-2.5 shadow-lg shadow-primary/10"
                        >
                            {(isSubmitting || mutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEditing ? "Save Changes" : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
