import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import SearchBlood from "./pages/SearchBlood";
import BloodBanks from "./pages/BloodBanks";
import FindDonors from "./pages/FindDonors";
import RegisterDonor from "./pages/RegisterDonor";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BloodCamps from "./pages/BloodCamps";
import CampRegister from "./pages/CampRegister";
import Certificate from "./pages/Certificate";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<SearchBlood />} />
              <Route path="/blood-banks" element={<BloodBanks />} />
              <Route path="/blood-camps" element={<BloodCamps />} />
              <Route path="/camp-register/:campId" element={<CampRegister />} />
              <Route path="/certificate/:registrationId" element={<Certificate />} />
              <Route path="/find-donors" element={<FindDonors />} />
              <Route path="/register-donor" element={<RegisterDonor />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<AdminDashboard />} />
              </Route>
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
