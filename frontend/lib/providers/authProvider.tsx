"use client";
import React, { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useMeAuthMeGet } from "../api/auth/auth";
import { useQueryClient } from "@tanstack/react-query";
import { AuthResponseSchema, UserResponseSchema } from "../api/model";

interface AuthContextType {
  user: UserResponseSchema | null;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [token, setToken] = React.useState<string | undefined>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || undefined
      : undefined
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("accessToken") || undefined);
    }
  }, []);

  useEffect(() => {
    axios.interceptors.request.use((config) => {
      if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    });
  }, [token]);

  const { data, isLoading, error, refetch } = useMeAuthMeGet();

  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token, refetch]);

  useEffect(() => {
    if (!isLoading && (!data || !data.data?.user?.id)) {
      router.replace("/");
    }
  }, [isLoading, data, router]);

  return (
    <AuthContext.Provider
      value={{
        user: data?.data.user ?? null,
        isLoading,
        error: error?.message ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  const { user, isLoading, error } = context;
  return { user, isLoading, error };
};
