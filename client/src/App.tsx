import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SchemesList from "@/pages/SchemesList";
import SchemeDetail from "@/pages/SchemeDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Registration from "@/pages/Registration";
import FormulirSertifikasi from "@/pages/FormulirSertifikasi";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function Router() {
  return (
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
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
