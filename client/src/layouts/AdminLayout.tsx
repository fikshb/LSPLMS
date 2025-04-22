import { ReactNode } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuth();

  // Redirect non-admin users
  if (user && user.role !== "admin") {
    return <Redirect to="/unauthorized" />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto ml-64">
        <main>{children}</main>
      </div>
    </div>
  );
}