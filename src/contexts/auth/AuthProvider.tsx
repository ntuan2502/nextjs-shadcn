"use client";

import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

import { AuthContext, AuthContextType } from "./AuthContext";
import { User } from "@/types/auth";
import {
  handleAxiosError,
  handleAxiosSuccess,
} from "@/lib/handleAxiosFeedback";
import { ENV } from "@/constants";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const updateUserInContext = (updatedUser: User) => {
    Cookies.set("user", JSON.stringify(updatedUser), { path: "/", expires: 7 });
    setUser(updatedUser);
  };

  // 👉 Hàm sync từ API
  const syncUser = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`${ENV.API_URL}/auth/profile`);
      const user = res.data.data.user;

      Cookies.set("user", JSON.stringify(user), { path: "/", expires: 7 });
      setUser(user);
    } catch (err) {
      handleAxiosError(err);
    }
  }, []);

  // ✅ Gọi sync khi app load lần đầu (nếu có accessToken)
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      syncUser();
    }
  }, [syncUser]);

  const login: AuthContextType["login"] = async (payload) => {
    try {
      const res = await axiosInstance.post(
        `${ENV.API_URL}/auth/login`,
        payload
      );

      const { user, accessToken, refreshToken } = res.data.data;

      Cookies.set("accessToken", accessToken, { path: "/", expires: 7 });
      Cookies.set("refreshToken", refreshToken, { path: "/", expires: 7 });
      Cookies.set("user", JSON.stringify(user), { path: "/", expires: 7 });

      setUser(user);
      router.push("/");

      handleAxiosSuccess(res);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const loginWithMicrosoft: AuthContextType["loginWithMicrosoft"] = useCallback(
    async (
      accessToken: string,
      refreshToken: string,
      user: string
    ) => {
      const newUser = JSON.parse(user);
      Cookies.set("accessToken", accessToken, { path: "/", expires: 7 });
      Cookies.set("refreshToken", refreshToken, { path: "/", expires: 7 });
      Cookies.set("user", user, { path: "/", expires: 7 });

      setUser(newUser);
      router.push("/");
    },
    [setUser, router]
  );

  const logout: AuthContextType["logout"] = async () => {
    try {
      const res = await axiosInstance.post(`${ENV.API_URL}/auth/logout`);

      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("user");
      setUser(null);
      router.push("/auth/login");

      handleAxiosSuccess(res);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithMicrosoft,
        logout,
        syncUser,
        updateUserInContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
