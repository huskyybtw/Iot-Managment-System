"use client";
import type React from "react";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { AuthProvider } from "../lib/providers/authProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigation } from "@/components/common/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <html lang="en">
          <body className={`font-sans antialiased`}>
            <Navigation />
            {children}
          </body>
        </html>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
