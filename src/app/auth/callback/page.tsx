"use client";
import LoadingDot from "@/components/loading-dot";
import { useAuth } from "@/contexts/auth";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const { loginWithMicrosoft } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken") || "";
    const refreshToken = searchParams.get("refreshToken") || "";
    const user = searchParams.get("user") || "";
    loginWithMicrosoft(accessToken, refreshToken, user);
  }, [searchParams, loginWithMicrosoft]);

  return <LoadingDot />;
}
