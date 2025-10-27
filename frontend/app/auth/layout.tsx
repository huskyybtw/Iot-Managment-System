"use client";
import React, { useState } from "react";
import { AuthProvider } from "../../lib/providers/authProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
