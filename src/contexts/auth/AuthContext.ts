import { createContext } from "react";
import { LoginPayload, User } from "@/types/auth";

export type AuthContextType = {
  user: User | null;
  login: (payload: LoginPayload) => Promise<void>;
  loginWithMicrosoft: (
    accessToken: string,
    refreshToken: string,
    user: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  syncUser: () => Promise<void>;
  updateUserInContext: (user: User) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
