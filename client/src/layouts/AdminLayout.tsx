import { ReactNode } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen w-full">
      <div className="fixed left-0 top-0 h-screen overflow-y-auto z-10 bg-white">
        <div className="w-64">
          <AdminSidebar />
        </div>
      </div>
      <div className="ml-64 flex-1 p-6 overflow-y-auto bg-gray-50">
        <main className="h-full w-full">{children}</main>
      </div>
    </div>
  );
}