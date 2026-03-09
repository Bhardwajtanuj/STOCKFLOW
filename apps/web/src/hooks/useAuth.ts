import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";

export function useAuth() {
    const router = useRouter();

    const { data, isLoading, error } = useQuery({
        queryKey: ["auth-me"],
        queryFn: async () => {
            const response = await apiClient.get("/auth/me");
            return response.data;
        },
        retry: false,
    });

    const logout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return {
        user: data?.user,
        organization: data?.organization,
        isLoading,
        isAuthenticated: !!data && !error,
        logout,
    };
}
