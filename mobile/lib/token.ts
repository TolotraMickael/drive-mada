import { useAuthStore } from "@/store/auth-store";

export function getAuthToken() {
  const token = useAuthStore.getState().token;
  return token;
}
