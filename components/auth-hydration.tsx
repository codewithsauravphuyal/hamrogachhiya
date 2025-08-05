"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function AuthHydration() {
  const { setHasHydrated, hasHydrated } = useAuthStore();

  useEffect(() => {
    // The Zustand persist middleware handles the hydration automatically
    // We just need to mark that hydration is complete
    if (!hasHydrated) {
      setHasHydrated(true);
    }
  }, [hasHydrated, setHasHydrated]);

  return null;
} 