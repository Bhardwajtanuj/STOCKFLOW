import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useInventory(search = "", page = 1) {
    const queryClient = useQueryClient();

    const productsQuery = useQuery({
        queryKey: ["products", search, page],
        queryFn: async () => {
            const response = await apiClient.get("/products", {
                params: { search, page, limit: 10 }
            });
            return response.data;
        },
    });

    const adjustStockMutation = useMutation({
        mutationFn: async ({ id, adjustment, note }: { id: string; adjustment: number; note?: string }) => {
            await apiClient.post(`/products/${id}/adjust-stock`, { adjustment, note });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
            queryClient.invalidateQueries({ queryKey: ["product"] });
        },
    });

    const deleteProductMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/products/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
        },
    });

    return {
        products: productsQuery.data?.products ?? [],
        total: productsQuery.data?.total ?? 0,
        isLoading: productsQuery.isLoading,
        adjustStock: adjustStockMutation.mutate,
        deleteProduct: deleteProductMutation.mutate,
    };
}
