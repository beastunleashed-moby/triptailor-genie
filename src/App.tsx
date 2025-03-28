
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TripProvider } from "@/contexts/TripContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Preferences from "./pages/Preferences";
import CreateTrip from "./pages/CreateTrip";
import Itinerary from "./pages/Itinerary"; 
import Activities from "./pages/Activities";
import Budget from "./pages/Budget";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TripProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route element={<Layout />}>
              <Route path="/create-trip" element={<CreateTrip />} />
              <Route path="/itinerary" element={<Itinerary />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/budget" element={<Budget />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </TripProvider>
  </QueryClientProvider>
);

export default App;
