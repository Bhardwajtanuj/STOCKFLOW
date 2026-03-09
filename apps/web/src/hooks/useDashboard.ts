import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useDashboard() {
    const summaryQuery = useQuery({
        queryKey: ["dashboard-summary"],
        queryFn: async () => {
            const response = await apiClient.get("/dashboard/summary");
            return response.data;
        },
    });

    return {
        summary: summaryQuery.data,
        isLoading: summaryQuery.isLoading,
        isError: summaryQuery.isError,
    };
}
