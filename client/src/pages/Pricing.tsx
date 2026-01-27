import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { toast } from "sonner";
import { 
  Check, 
  X, 
  Sparkles, 
  ArrowLeft,
  Zap,
  Crown,
  Star,
  Users,
  BarChart3,
  Gift,
  Loader2,
  AlertCircle,
  CreditCard
} from "lucide-react";
import { getLoginUrl } from "@/const";

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: Zap,
    color: "from-gray-500 to-gray-600",
    popular: false,
    limits: {
      projectSlots: 3,
      commission: 25,
      aiTrainingSessions: 2,
      dataCredits: 5,
      templateDownloads: 3,
      appTrials: 5,
      teamMembers: 0,
      storage: "2GB",
    },
    features: [
      { name: "Project Slots", value: "3", included: true },
      { name: "Marketplace Commission", value: "25%", included: true },
      { name: "AI Training Sessions", value: "2/month", included: true },
      { name: "Training Compute Priority", value: "Lowest", included: true },
      { name: "Data Marketplace Credits", value: "$5/month", included: true },
      { name: "Template Downloads", value: "3/month", included: true },
      { name: "Paid App Trials", value: "5 total", included: true },
      { name: "Team Collaboration", value: null, included: false },
      { name: "Revenue Splitting", value: null, included: false },
      { name: "Analytics Dashboard", value: "Basic", included: true },
      { name: "Custom Branding", value: null, included: false },
      { name: "Featured Listings", value: null, included: false },
      { name: "Custom Project Requests", value: null, included: false },
      { name: "Storage Space", value: "2GB", included: true },
      { name: "Support Level", value: "Community Forum", included: true },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For serious creators and small teams",
    monthlyPrice: 14.99,
    yearlyPrice: 143.90,
    icon: Star,
    color: "from-amber-500 to-orange-600",
    popular: true,
    limits: {
      projectSlots: 15,
      commission: 15,
      aiTrainingSessions: 10,
      dataCredits: 20,
      templateDownloads: 15,
      appTrials: 25,
      teamMembers: 3,
      storage: "25GB",
    },
    features: [
      { name: "Project Slots", value: "15", included: true },
      { name: "Marketplace Commission", value: "15%", included: true },
      { name: "AI Training Sessions", value: "10/month", included: true },
      { name: "Training Compute Priority", value: "Medium", included: true },
      { name: "Data Marketplace Credits", value: "$20/month", included: true },
      { name: "Template Downloads", value: "15/month", included: true },
      { name: "Paid App Trials", value: "25/month", included: true },
      { name: "Team Collaboration", value: "Up to 3 members", included: true },
      { name: "Revenue Splitting", value: "Basic", included: true },
      { name: "Analytics Dashboard", value: "Standard", included: true },
      { name: "Custom Branding", value: null, included: false },
      { name: "Featured Listings", value: "$7/week", included: true },
      { name: "Custom Project Requests", value: "$500+ budget", included: true },
      { name: "Storage Space", value: "25GB", included: true },
      { name: "Support Level", value: "Email (48hr)", included: true },
    ],
  },
  {
    id: "master",
    name: "Master",
    description: "For power users and enterprises",
    monthlyPrice: 49.99,
    yearlyPrice: 479.90,
    icon: Crown,
    color: "from-purple-500 to-indigo-600",
    popular: false,
    limits: {
      projectSlots: 30,
      commission: 10,
      aiTrainingSessions: 40,
      dataCredits: 50,
      templateDownloads: 40,
      appTrials: -1,
      teamMembers: 10,
      storage: "100GB",
    },
    features: [
      { name: "Project Slots", value: "30", included: true },
      { name: "Marketplace Commission", value: "10%", included: true },
      { name: "AI Training Sessions", value: "40/month", included: true },
      { name: "Training Compute Priority", value: "High", included: true },
      { name: "Data Marketplace Credits", value: "$50/month", included: true },
      { name: "Template Downloads", value: "40/month", included: true },
      { name: "Paid App Trials", value: "Unlimited", included: true },
      { name: "Team Collaboration", value: "Up to 10 members", included: true },
      { name: "Revenue Splitting", value: "Advanced", included: true },
      { name: "Analytics Dashboard", value: "Advanced", included: true },
      { name: "Custom Branding", value: "Yes", included: true },
      { name: "Featured Listings", value: "2 free/month", included: true },
      { name: "Custom Project Requests", value: "Any budget", included: true },
      { name: "Storage Space", value: "100GB", included: true },
      { name: "Support Level", value: "Priority (24hr)", included: true },
    ],
  },
];

const additionalBenefits = [
  { icon: Gift, title: "14-Day Free Trial", description: "Try any paid plan risk-free" },
  { icon: BarChart3, title: "20% Annual Discount", description: "Save when you pay yearly" },
  { icon: Users, title: "Team Plans", description: "Shared seats at discount" },
  { icon: Star, title: "Education Discount", description: "40% off for students/teachers" },
];

export default function Pricing() {
  const { isAuthenticated, user } = useAuth();
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Get current user's plan
  const currentPlan = user?.subscriptionTier || "free";
  const planOrder = ["free", "pro", "master"];
  const currentPlanIndex = planOrder.indexOf(currentPlan);

  // Subscription mutations
  const createCheckoutMutation = trpc.subscription.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.success("Redirecting to checkout...", {
          description: "Use test card: 4242 4242 4242 4242"
        });
        window.open(data.checkoutUrl, '_blank');
      }
      setIsLoading(null);
    },
    onError: (error) => {
      toast.error("Failed to create checkout", { description: error.message });
      setIsLoading(null);
    },
  });

  const cancelMutation = trpc.subscription.cancel.useMutation({
    onSuccess: () => {
      toast.success("Subscription will be canceled at end of billing period");
      setShowCancelDialog(false);
    },
    onError: (error) => {
      toast.error("Failed to cancel subscription", { description: error.message });
    },
  });

  const billingPortalMutation = trpc.subscription.getBillingPortal.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, '_blank');
      }
    },
    onError: (error) => {
      toast.error("Failed to open billing portal", { description: error.message });
    },
  });

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    
    if (planId === "free") {
      if (currentPlan !== "free") {
        setSelectedPlan(planId);
        setShowDowngradeDialog(true);
      } else {
        toast.info("You're already on the Free plan!");
      }
      return;
    }

    if (planId === currentPlan) {
      toast.info("You're already on this plan!");
      return;
    }

    const targetPlanIndex = planOrder.indexOf(planId);
    const isDowngrade = targetPlanIndex < currentPlanIndex;

    if (isDowngrade) {
      setSelectedPlan(planId);
      setShowDowngradeDialog(true);
      return;
    }

    // Upgrade flow
    setIsLoading(planId);
    createCheckoutMutation.mutate({
      planId: planId as "pro" | "master",
      isYearly,
    });
  };

  const handleDowngrade = () => {
    if (selectedPlan === "free") {
      // Cancel subscription
      cancelMutation.mutate();
    } else {
      // Downgrade to lower paid plan
      setIsLoading(selectedPlan);
      createCheckoutMutation.mutate({
        planId: selectedPlan as "pro" | "master",
        isYearly,
      });
    }
    setShowDowngradeDialog(false);
  };

  const handleManageBilling = () => {
    billingPortalMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">Swarm</span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            {isAuthenticated && currentPlan !== "free" && (
              <Button variant="outline" size="sm" onClick={handleManageBilling}>
                <CreditCard className="w-4 h-4 mr-2" />
                Manage Billing
              </Button>
            )}
            {isAuthenticated && (
              <Badge variant="outline" className="text-sm">
                Current Plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
              </Badge>
            )}
            <Link href="/marketplace">
              <Button variant="outline" size="sm">Marketplace</Button>
            </Link>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="sm">Sign In</Button>
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="container py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-100">
            Pricing Plans
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Start free and scale as you grow. All plans include access to the marketplace and AI builder.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!isYearly ? "font-semibold" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <span className={`text-sm ${isYearly ? "font-semibold" : "text-muted-foreground"}`}>
              Yearly
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                Save 20%
              </Badge>
            </span>
          </div>
        </div>

        {/* Test Mode Alert */}
        <Alert className="mb-8 max-w-3xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Test Mode:</strong> Use card number <code className="bg-muted px-1 rounded">4242 4242 4242 4242</code> with any future expiry date and CVC to test payments.
          </AlertDescription>
        </Alert>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const isCurrentPlan = plan.id === currentPlan;
            const targetPlanIndex = planOrder.indexOf(plan.id);
            const isUpgrade = targetPlanIndex > currentPlanIndex;
            const isDowngrade = targetPlanIndex < currentPlanIndex;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden ${plan.popular ? "border-amber-500 border-2 shadow-lg" : ""} ${isCurrentPlan ? "ring-2 ring-green-500" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-none rounded-bl-lg bg-gradient-to-r from-amber-500 to-orange-600">
                      Most Popular
                    </Badge>
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute top-0 left-0">
                    <Badge className="rounded-none rounded-br-lg bg-green-500">
                      Current Plan
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      ${isYearly 
                        ? (plan.yearlyPrice / 12).toFixed(2) 
                        : plan.monthlyPrice.toFixed(2)
                      }
                    </span>
                    <span className="text-muted-foreground">/month</span>
                    {isYearly && plan.yearlyPrice > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Billed ${plan.yearlyPrice.toFixed(2)}/year
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-3 text-left">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 shrink-0" />
                        )}
                        <span className={`text-sm ${!feature.included ? "text-muted-foreground" : ""}`}>
                          {feature.name}
                          {feature.value && (
                            <span className="font-medium ml-1">({feature.value})</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${plan.popular 
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700" 
                      : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isLoading !== null || isCurrentPlan}
                  >
                    {isLoading === plan.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : isCurrentPlan ? (
                      "Current Plan"
                    ) : plan.id === "free" ? (
                      isDowngrade ? "Downgrade to Free" : "Get Started"
                    ) : isUpgrade ? (
                      "Upgrade Now"
                    ) : (
                      "Downgrade"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Additional Benefits */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">All Plans Include</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalBenefits.map((benefit, i) => (
              <Card key={i} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I switch plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the change takes effect at the end of your current billing period.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept all major credit cards (Visa, MasterCard, American Express) through our secure payment processor, Stripe.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a refund policy?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact support within 14 days of your purchase for a full refund.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Downgrade Confirmation Dialog */}
      <Dialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Plan Change</DialogTitle>
            <DialogDescription>
              {selectedPlan === "free" ? (
                <>
                  Are you sure you want to cancel your subscription and downgrade to the Free plan? 
                  You'll lose access to premium features at the end of your current billing period.
                </>
              ) : (
                <>
                  Are you sure you want to downgrade to the {selectedPlan?.charAt(0).toUpperCase()}{selectedPlan?.slice(1)} plan?
                  Your new plan will take effect at the end of your current billing period.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDowngradeDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDowngrade}>
              {selectedPlan === "free" ? "Cancel Subscription" : "Confirm Downgrade"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
