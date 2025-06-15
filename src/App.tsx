
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DiscoveryHook from "./pages/DiscoveryHook";
import Samples from "./pages/Samples";
import NotFound from "./pages/NotFound";
import DiscoveryFunnel from "./pages/DiscoveryFunnel";
import DetailedInput from "./pages/DetailedInput";
import IntentMirror from "./pages/IntentMirror";
import SparkLayer from "./pages/SparkLayer";
import PurchaseFlow from "./pages/PurchaseFlow";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/discovery-hook" element={<DiscoveryHook />} />
          <Route path="/samples" element={<Samples />} />
          {/* Future CanAI routes will be added here */}
          <Route path="/discovery-funnel" element={<DiscoveryFunnel />} />
          <Route path="/detailed-input" element={<DetailedInput />} />
          <Route path="/intent-mirror" element={<IntentMirror />} />
          <Route path="/spark-layer" element={<SparkLayer />} />
          <Route path="/purchase" element={<PurchaseFlow />} />
          <Route path="/checkout" element={<div>Checkout - Coming Soon</div>} />
          <Route path="/generating" element={<div>Generating - Coming Soon</div>} />
          <Route path="/spark-split" element={<div>SparkSplit - Coming Soon</div>} />
          <Route path="/feedback" element={<div>Feedback - Coming Soon</div>} />
          <Route path="/business-builder" element={<div>Business Builder - Coming Soon</div>} />
          <Route path="/social-email" element={<div>Social Email - Coming Soon</div>} />
          <Route path="/site-audit" element={<div>Site Audit - Coming Soon</div>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
