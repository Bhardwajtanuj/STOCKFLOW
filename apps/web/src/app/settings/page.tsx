"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Settings as SettingsIcon, Save, Loader2, Info, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrgSettingsUpdateSchema, OrgSettingsUpdateInput } from "@stockflow/shared";
import { useEffect } from "react";

export default function SettingsPage() {
    const queryClient = useQueryClient();

    const { data: settings, isLoading } = useQuery({
        queryKey: ["settings"],
        queryFn: async () => {
            const response = await apiClient.get("/settings");
            return response.data;
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isDirty },
    } = useForm<OrgSettingsUpdateInput>({
        resolver: zodResolver(OrgSettingsUpdateSchema as any),
        defaultValues: {
            defaultLowStockThreshold: 5,
        },
    });

    useEffect(() => {
        if (settings) reset(settings);
    }, [settings, reset]);

    const mutation = useMutation({
        mutationFn: async (data: OrgSettingsUpdateInput) => {
            await apiClient.put("/settings", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
        },
    });

    const onSubmit = (data: OrgSettingsUpdateInput) => {
        mutation.mutate(data);
    };

    if (isLoading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-10 bg-gray-100 w-1/4 rounded-lg"></div>
                <div className="max-w-2xl h-64 bg-gray-50 rounded-2xl"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-primary">Settings</h1>
                <p className="text-gray-500 font-medium">Manage your organization preferences.</p>
            </div>

            <div className="max-w-2xl">
                <div className="card shadow-xl shadow-primary/5 border border-gray-100 overflow-hidden !p-0">
                    <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/5 rounded-xl text-primary border border-primary/10">
                                <SettingsIcon className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-primary tracking-tight">Organization Configuration</h2>
                        </div>
                        {mutation.isSuccess && (
                            <div className="flex items-center gap-2 text-success font-bold text-xs animate-in slide-in-from-right-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Changes Saved
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="block text-sm font-bold text-primary">
                                        Default Low Stock Threshold
                                    </label>
                                    <p className="text-xs text-gray-400 mt-1 max-w-[300px]">
                                        Alerts trigger when inventory levels fall below this baseline across all products.
                                    </p>
                                </div>
                                <div className="w-32">
                                    <input
                                        type="number"
                                        {...register("defaultLowStockThreshold", { valueAsNumber: true })}
                                        className={`input-field text-center font-bold text-lg h-12 ${errors.defaultLowStockThreshold ? "border-danger" : ""}`}
                                    />
                                </div>
                            </div>
                            {errors.defaultLowStockThreshold && (
                                <p className="text-danger text-xs font-bold pl-1 uppercase tracking-wider">{errors.defaultLowStockThreshold.message}</p>
                            )}
                        </div>

                        <div className="bg-accent/5 border border-accent/10 rounded-2xl p-4 flex items-start gap-3">
                            <Info className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                            <p className="text-xs leading-relaxed text-gray-500 font-medium">
                                Individual products can override this setting in their specific detail view.
                                Higher values provide a more conservative buffer for your supply chain.
                            </p>
                        </div>

                        <div className="pt-6 border-t border-gray-50 flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={mutation.isPending || !isDirty || !isValid}
                                className="btn-primary flex items-center gap-3 px-10 py-3 shadow-xl shadow-primary/10 disabled:grayscale disabled:opacity-50 transition-all font-black"
                            >
                                {mutation.isPending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                Update Preferences
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
