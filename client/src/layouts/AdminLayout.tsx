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
    <div className="flex h-screen">
      <div className="w-64 h-screen fixed left-0 top-0 overflow-y-auto">
        <AdminSidebar />
      </div>
      <div className="pl-64 flex-1 overflow-y-auto bg-gray-50">
        <main className="h-full">{children}</main>
      </div>
    </div>
  );
}