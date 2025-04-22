import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// Halaman Publik
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SchemesList from "@/pages/SchemesList";
import SchemeDetail from "@/pages/SchemeDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Registration from "@/pages/Registration";
import FormulirSertifikasi from "@/pages/FormulirSertifikasi";
import UjianPenjamahMakanan from "@/pages/UjianPenjamahMakanan";
import FormulirAsesor from "@/pages/FormulirAsesor";
import FormDetail from "@/pages/FormDetail";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Halaman Autentikasi
import AuthPage from "@/pages/auth-page";
import UnauthorizedPage from "@/pages/unauthorized-page";

// Dashboard berdasarkan Role
import AdminDashboard from "@/pages/admin/dashboard";
import AsesorDashboard from "@/pages/asesor/dashboard";
import AsesiDashboard from "@/pages/asesi/dashboard";
import QuestionsPage from "@/pages/admin/questions";
import ExaminationTemplatesPage from "@/pages/admin/examination-templates";

function Router() {
  return (
    <Switch>
      {/* Rute role-based */}
      <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} roles={["admin"]} />
      <ProtectedRoute path="/admin/questions" component={QuestionsPage} roles={["admin"]} />
      <ProtectedRoute path="/admin/examination-templates" component={ExaminationTemplatesPage} roles={["admin"]} />
      <ProtectedRoute path="/asesor/dashboard" component={AsesorDashboard} roles={["asesor"]} />
      <ProtectedRoute path="/asesi/dashboard" component={AsesiDashboard} roles={["asesi"]} />
      
      {/* Rute khusus */}
      <Route path="/auth" component={AuthPage} />
      <Route path="/unauthorized" component={UnauthorizedPage} />
      
      {/* Rute publik dengan layout header dan footer */}
      <Route path="/">
        <>
          <Header />
          <main>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/skema" component={SchemesList} />
              <Route path="/skema/:slug" component={SchemeDetail} />
              <Route path="/tentang-kami" component={About} />
              <Route path="/kontak" component={Contact} />
              <Route path="/registrasi" component={Registration} />
              <Route path="/formulir-sertifikasi" component={FormulirSertifikasi} />
              <Route path="/ujian-penjamah-makanan" component={UjianPenjamahMakanan} />
              <Route path="/formulir-asesor" component={FormulirAsesor} />
              <Route path="/forms/:formCode" component={FormDetail} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
