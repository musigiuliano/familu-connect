import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SubscriptionProvider } from "@/hooks/useSubscription";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterFamily from "./pages/RegisterFamily";
import RegisterOperator from "./pages/RegisterOperator";
import RegisterOrganization from "./pages/RegisterOrganization";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import FamilyProfile from "./pages/FamilyProfile";
import OperatorProfile from "./pages/OperatorProfile";
import OrganizationProfile from "./pages/OrganizationProfile";
import Search from "./pages/Search";
import Pricing from "./pages/PricingSelection";
import PricingFamilies from "./pages/PricingFamilies";
import PricingOneTime from "./pages/PricingOneTime";
import PricingOperators from "./pages/PricingOperators";
import PricingOrganizations from "./pages/PricingOrganizations";
import Resources from "./pages/Resources";
import FamilyDashboard from "./pages/FamilyDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import Contact from "./pages/Contact";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

// Register components fix

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SubscriptionProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-family" element={<RegisterFamily />} />
          <Route path="/register-operator" element={<RegisterOperator />} />
          <Route path="/register-organization" element={<RegisterOrganization />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard-family" element={<ProtectedRoute><FamilyDashboard /></ProtectedRoute>} />
          <Route path="/dashboard-operator" element={<ProtectedRoute><OperatorDashboard /></ProtectedRoute>} />
          <Route path="/dashboard-organization" element={<ProtectedRoute><OrganizationDashboard /></ProtectedRoute>} />
          <Route path="/profile/family" element={<ProtectedRoute><FamilyProfile /></ProtectedRoute>} />
          <Route path="/profile/operator" element={<ProtectedRoute><OperatorProfile /></ProtectedRoute>} />
          <Route path="/profile/organization" element={<ProtectedRoute><OrganizationProfile /></ProtectedRoute>} />
          <Route path="/search" element={<Search />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/pricing-families" element={<PricingFamilies />} />
            <Route path="/pricing-one-time" element={<PricingOneTime />} />
            <Route path="/pricing-operators" element={<PricingOperators />} />
            <Route path="/pricing-organizations" element={<PricingOrganizations />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
        </TooltipProvider>
      </SubscriptionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
