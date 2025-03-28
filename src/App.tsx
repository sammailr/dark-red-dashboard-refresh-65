
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OrderInboxesPage from "./pages/OrderInboxes";
import SendingPlatformPage from "./pages/SendingPlatform";
import DomainsPage from "./pages/Domains";
import MasterInboxPage from "./pages/MasterInbox";
import GuidePage from "./pages/Guide";
import ToolsPage from "./pages/Tools";
import AffiliatePage from "./pages/Affiliate";
import SettingsPage from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/order-inboxes" element={<OrderInboxesPage />} />
          <Route path="/sending-platform" element={<SendingPlatformPage />} />
          <Route path="/domains" element={<DomainsPage />} />
          <Route path="/master-inbox" element={<MasterInboxPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/affiliate" element={<AffiliatePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
