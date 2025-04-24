
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { LanguageProvider } from "./components/LanguageProvider";
import AuthProvider from "./auths/AuthProvider";
import AxiosProvider from "./axios/AxiosProvider";

import Index from "./pages/Index";
import RobotDetail from "./pages/RobotDetail";
import InvoiceDetail from "./pages/subpages/invoice/InvoiceDetail";
import MspoDetail from "./pages/subpages/mspo/MspoDetail";
import Analytics from "./pages/Analytics";
import Insights from "./pages/Insights";
import NotFound from "./pages/NotFound";
import LABReport from "./robots/lab/report";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="rpa-dashboard-theme">
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AxiosProvider>
            <AuthProvider mustLogin={true}>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/lab/report" element={<LABReport />} />
                  <Route path="/robot/:id" element={<RobotDetail />} />
                  <Route path="/invoice" element={<InvoiceDetail />} />
                  <Route path="/mspo" element={<MspoDetail />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/insights" element={<Insights />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </AxiosProvider>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
