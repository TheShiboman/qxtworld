import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { auth } from "./firebase";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

async function getAuthHeaders() {
  const user = auth.currentUser;
  if (!user) {
    console.log('No current user found for auth headers');
    return {};
  }

  try {
    console.log('Refreshing Firebase token...');
    const token = await user.getIdToken(true); // Force refresh token
    console.log('Token refreshed successfully, length:', token.length);
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  } catch (error) {
    console.error("Error getting Firebase token:", error);
    return {};
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const headers = await getAuthHeaders();
  console.log(`Making ${method} request to ${url}, auth header present:`, !!headers.Authorization);

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const headers = await getAuthHeaders();
    console.log(`Making query request to ${queryKey[0]}, auth header present:`, !!headers.Authorization);

    const res = await fetch(queryKey[0] as string, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      console.log('Received 401, returning null as configured');
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});