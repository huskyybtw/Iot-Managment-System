import React from "react";
import { AuthProvider } from "../../lib/providers/authProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
