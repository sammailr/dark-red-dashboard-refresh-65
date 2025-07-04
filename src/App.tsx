
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { OrderProvider } from "./contexts/OrderContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OrderInboxesPage from "./pages/OrderInboxes";
import OrderGoogleInboxesPage from "./pages/OrderGoogleInboxes";
import OrderMicrosoftInboxesPage from "./pages/OrderMicrosoftInboxes";
import SendingPlatformPage from "./pages/SendingPlatform";
import DomainsPage from "./pages/Domains";
import NameserverUpdatePage from "./pages/NameserverUpdate";
import MasterInboxPage from "./pages/MasterInbox";
import GuidePage from "./pages/Guide";
import ToolsPage from "./pages/Tools";
import AffiliatePage from "./pages/Affiliate";
import SettingsPage from "./pages/Settings";
import OrderDetail from "./pages/OrderDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SubscriptionProvider>
      <OrderProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/order-inboxes" element={<OrderInboxesPage />} />
              <Route path="/order-google-inboxes" element={<OrderGoogleInboxesPage />} />
              <Route path="/order-microsoft-inboxes" element={<OrderMicrosoftInboxesPage />} />
              <Route path="/sending-platform" element={<SendingPlatformPage />} />
              <Route path="/domains" element={<DomainsPage />} />
              <Route path="/nameserver-update/:domainId" element={<NameserverUpdatePage />} />
              <Route path="/master-inbox" element={<MasterInboxPage />} />
              <Route path="/guide" element={<GuidePage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/affiliate" element={<AffiliatePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </OrderProvider>
    </SubscriptionProvider>
  </QueryClientProvider>
);

export default App;
