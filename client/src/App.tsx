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
import Pricing from "./pages/Pricing";
import Affiliate from "./pages/Affiliate";
import CustomProject from "./pages/CustomProject";
import Community from "./pages/Community";
import Analytics from "./pages/Analytics";
import Teams from "./pages/Teams";
import DataMarketplace from "./pages/DataMarketplace";
import ProjectDashboard from "./pages/ProjectDashboard";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/data-marketplace" component={DataMarketplace} />
      <Route path="/listing/:slug" component={ListingDetail} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/affiliate" component={Affiliate} />
      <Route path="/community" component={Community} />
      
      {/* Protected Routes - User Dashboard */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/projects" component={ProjectDashboard} />
      <Route path="/my-listings" component={MyListings} />
      <Route path="/my-listings/new" component={CreateListing} />
      <Route path="/my-listings/:id/edit" component={EditListing} />
      <Route path="/my-purchases" component={MyPurchases} />
      <Route path="/profile" component={Profile} />
      <Route path="/purchase-success" component={PurchaseSuccess} />
      <Route path="/subscription-success" component={SubscriptionSuccess} />
      <Route path="/custom-project" component={CustomProject} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/teams" component={Teams} />
      
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
