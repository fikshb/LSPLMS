import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Shield, AlertTriangle } from "lucide-react";

export default function UnauthorizedPage() {
  const { user, logoutMutation } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-red-50 p-4 rounded-full mb-6">
        <AlertTriangle className="w-16 h-16 text-red-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
        Akses Ditolak
      </h1>
      <p className="text-gray-600 text-center max-w-md mb-8">
        Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Halaman ini memerlukan tingkat akses yang lebih tinggi.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        {user ? (
          <>
            <Button
              className="bg-[#79A84B]"
              asChild
            >
              <Link href={
                user.role === "admin" 
                  ? "/admin/dashboard" 
                  : user.role === "asesor" 
                    ? "/asesor/dashboard" 
                    : "/asesi/dashboard"
              }>
                Kembali ke Dashboard
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
            >
              Keluar
            </Button>
          </>
        ) : (
          <Button
            className="bg-[#79A84B]"
            asChild
          >
            <Link href="/auth">
              Masuk
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}