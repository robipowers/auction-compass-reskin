import { PasswordGate } from "@/components/PasswordGate";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MarketDataProvider } from "@/contexts/MarketDataContext";
import { KnowledgeProvider } from "@/contexts/KnowledgeContext";
import { AlertProvider } from "@/contexts/AlertContext";
import { KnowledgeSidebar } from "@/components/knowledge";
import { AlertToastContainer } from "@/components/alerts";
import { useAlertContext } from "@/contexts/AlertContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreatePlan from "./pages/CreatePlan";
import History from "./pages/History";
import AdminKnowledge from "./pages/AdminKnowledge";
import Knowledge from "./pages/Knowledge";
import Alerts from "./pages/Alerts";
import AlertHistory from "./pages/AlertHistory";
import Settings from "./pages/Settings";
import LiveSession from "./pages/LiveSession";
import WorkspaceLive from "./pages/WorkspaceLive";
import Journal from "./pages/Journal";
import Psychologist from "./pages/Psychologist";
import Analytics from "./pages/Analytics";
import ChartingDemo from "./pages/ChartingDemo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Alert toasts need to be inside AlertProvider
function AlertToasts() {
  const { triggeredAlerts, dismissTriggeredAlert } = useAlertContext();
  return (
    <AlertToastContainer 
      alerts={triggeredAlerts} 
      onDismiss={dismissTriggeredAlert} 
    />
  );
}

const App = () => (
  <PasswordGate><QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <MarketDataProvider>
        <KnowledgeProvider>
          <AlertProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="min-h-screen bg-background transition-colors duration-300 pb-16 md:pb-0">
                  <Header />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/plan" element={<CreatePlan />} />
                    <Route path="/live" element={<LiveSession />} />
                    <Route path="/workspace" element={<WorkspaceLive />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/psychologist" element={<Psychologist />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/charting" element={<ChartingDemo />} />
                    <Route path="/knowledge" element={<Knowledge />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/alerts/history" element={<AlertHistory />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/admin/knowledge" element={<AdminKnowledge />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <MobileNav />
                  <KnowledgeSidebar />
                  <AlertToasts />
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </AlertProvider>
        </KnowledgeProvider>
      </MarketDataProvider>
    </ThemeProvider>
  </QueryClientProvider></PasswordGate>
);

export default App;
