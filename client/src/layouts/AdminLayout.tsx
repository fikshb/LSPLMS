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
    <>
      <div className="fixed left-0 top-0 h-screen z-10">
        <AdminSidebar />
      </div>
      <div className="min-h-screen bg-gray-50 pl-64">
        <main>{children}</main>
      </div>
    </>
  );
}