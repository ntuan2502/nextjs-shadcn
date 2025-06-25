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
    const id = searchParams.get("id") || "";
    const email = searchParams.get("email") || "";
    const name = searchParams.get("name") || "";
    loginWithMicrosoft(accessToken, refreshToken, id, email, name);
  }, [searchParams, loginWithMicrosoft]);

  return (
    <LoadingDot/>
  );
}
