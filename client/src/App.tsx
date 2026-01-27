import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import ListingDetail from "./pages/ListingDetail";
import Dashboard from "./pages/Dashboard";
import MyListings from "./pages/MyListings";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import MyPurchases from "./pages/MyPurchases";
import AIBuilder from "./pages/AIBuilder";
import AIProjectDetail from "./pages/AIProjectDetail";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import PurchaseSuccess from "./pages/PurchaseSuccess";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/listing/:slug" component={ListingDetail} />
      
      {/* Protected Routes - User Dashboard */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/my-listings" component={MyListings} />
      <Route path="/my-listings/new" component={CreateListing} />
      <Route path="/my-listings/:id/edit" component={EditListing} />
      <Route path="/my-purchases" component={MyPurchases} />
      <Route path="/profile" component={Profile} />
      <Route path="/purchase-success" component={PurchaseSuccess} />
      
      {/* AI Builder Routes */}
      <Route path="/ai-builder" component={AIBuilder} />
      <Route path="/ai-builder/:id" component={AIProjectDetail} />
      
      {/* Admin Routes */}
      <Route path="/admin" component={AdminPanel} />
      
      {/* Fallback */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
