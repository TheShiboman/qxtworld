import { QueryClient } from "@tanstack/react-query";
import { auth } from "./firebase";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }
}

async function getAuthHeaders() {
  const user = auth.currentUser;
  if (!user) {
    console.log('No current user found for auth headers');
    return {
      "Content-Type": "application/json"
    };
  }

  try {
    console.log('Getting Firebase token...');
    const token = await user.getIdToken(true);
    console.log('Token obtained successfully');
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  } catch (error) {
    console.error("Error getting Firebase token:", error);
    throw error;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    console.log(`Making ${method} request to ${url}`);
    const headers = await getAuthHeaders();
    console.log('Got auth headers:', headers.Authorization ? 'Bearer token present' : 'No bearer token');

    const res = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    console.log(`Response status:`, res.status);
    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error(`API request failed (${method} ${url}):`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      try {
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
      } catch (error) {
        console.error(`Query failed (${queryKey[0]}):`, error);
        throw error;
      }
    };


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});