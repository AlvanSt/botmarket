import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  Lock,
  Loader2
} from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    stripePriceIdMonthly: null,
    stripePriceIdYearly: null,
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
    stripePriceIdMonthly: "price_pro_monthly",
    stripePriceIdYearly: "price_pro_yearly",
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
    stripePriceIdMonthly: "price_master_monthly",
    stripePriceIdYearly: "price_master_yearly",
    icon: Crown,
    color: "from-purple-500 to-indigo-600",
    popular: false,
    limits: {
      projectSlots: 30,
      commission: 10,
      aiTrainingSessions: 40,
      dataCredits: 50,
      templateDownloads: 40,
      appTrials: -1, // unlimited
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

// Feature comparison for upgrade prompts
const featureRequirements: Record<string, string> = {
  "team_collaboration": "pro",
  "revenue_splitting": "pro",
  "custom_project": "pro",
  "custom_branding": "master",
  "advanced_analytics": "master",
  "priority_support": "master",
};

export default function Pricing() {
  const { isAuthenticated, user } = useAuth();
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [requiredPlan, setRequiredPlan] = useState<string | null>(null);

  // Get current user's plan
  const currentPlan = user?.subscriptionTier || "free";

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to subscribe");
      return;
    }
    
    if (planId === "free") {
      toast.success("You're already on the Free plan!");
      return;
    }

    if (planId === currentPlan) {
      toast.info("You're already on this plan!");
      return;
    }

    setIsLoading(planId);

    try {
      // In production, this would call the Stripe checkout API
      // For now, show a toast with test card info
      toast.success(
        `Redirecting to checkout for ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan...`,
        {
          description: "Use test card: 4242 4242 4242 4242"
        }
      );
      
      // Simulate redirect delay
      setTimeout(() => {
        setIsLoading(null);
        // In production: window.open(checkoutUrl, '_blank');
      }, 1500);
    } catch (error) {
      toast.error("Failed to start checkout. Please try again.");
      setIsLoading(null);
    }
  };

  const checkFeatureAccess = (feature: string): boolean => {
    const requiredPlanForFeature = featureRequirements[feature];
    if (!requiredPlanForFeature) return true;
    
    const planOrder = ["free", "pro", "master"];
    const currentPlanIndex = planOrder.indexOf(currentPlan);
    const requiredPlanIndex = planOrder.indexOf(requiredPlanForFeature);
    
    return currentPlanIndex >= requiredPlanIndex;
  };

  const promptUpgrade = (feature: string) => {
    const required = featureRequirements[feature];
    if (required) {
      setRequiredPlan(required);
      setShowUpgradeDialog(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">Swarm</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
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
              <Link href="/">
                <Button size="sm">Sign In</Button>
              </Link>
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

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const isCurrentPlan = plan.id === currentPlan;
            const isUpgrade = plans.findIndex(p => p.id === plan.id) > plans.findIndex(p => p.id === currentPlan);
            
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
                      "Get Started"
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

        {/* Plan Comparison Table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Feature</th>
                  {plans.map(plan => (
                    <th key={plan.id} className="text-center p-4">
                      <span className={`font-bold ${plan.id === currentPlan ? "text-green-600" : ""}`}>
                        {plan.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">Project Slots</td>
                  <td className="text-center p-4">3</td>
                  <td className="text-center p-4">15</td>
                  <td className="text-center p-4">30</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Commission Rate</td>
                  <td className="text-center p-4">25%</td>
                  <td className="text-center p-4">15%</td>
                  <td className="text-center p-4">10%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">AI Training Sessions</td>
                  <td className="text-center p-4">2/month</td>
                  <td className="text-center p-4">10/month</td>
                  <td className="text-center p-4">40/month</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Team Members</td>
                  <td className="text-center p-4"><X className="w-4 h-4 mx-auto text-gray-300" /></td>
                  <td className="text-center p-4">Up to 3</td>
                  <td className="text-center p-4">Up to 10</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Custom Project Requests</td>
                  <td className="text-center p-4"><X className="w-4 h-4 mx-auto text-gray-300" /></td>
                  <td className="text-center p-4">$500+ budget</td>
                  <td className="text-center p-4">Any budget</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Revenue Splitting</td>
                  <td className="text-center p-4"><X className="w-4 h-4 mx-auto text-gray-300" /></td>
                  <td className="text-center p-4">Basic</td>
                  <td className="text-center p-4">Advanced</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Storage</td>
                  <td className="text-center p-4">2GB</td>
                  <td className="text-center p-4">25GB</td>
                  <td className="text-center p-4">100GB</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="bg-muted/50 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Additional Benefits</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {additionalBenefits.map((benefit, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                  <benefit.icon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold mb-1">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Can I switch plans at any time?</h3>
              <p className="text-muted-foreground">Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, you'll receive credit towards future billing.</p>
            </div>
            <div className="p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">What happens to my projects if I downgrade?</h3>
              <p className="text-muted-foreground">Your existing projects remain accessible, but you won't be able to create new ones beyond your plan's limit. We recommend archiving unused projects before downgrading.</p>
            </div>
            <div className="p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground">Yes, we offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, contact support for a full refund.</p>
            </div>
            <div className="p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">How does team billing work?</h3>
              <p className="text-muted-foreground">Team seats are included in Pro and Master plans. Additional seats can be purchased at a discounted rate. All team members share the plan's resources.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-500" />
              Upgrade Required
            </DialogTitle>
            <DialogDescription>
              This feature requires the {requiredPlan?.charAt(0).toUpperCase()}{requiredPlan?.slice(1)} plan or higher.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground mb-4">
              Upgrade your plan to unlock this feature and many more benefits.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                Maybe Later
              </Button>
              <Button 
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                onClick={() => {
                  setShowUpgradeDialog(false);
                  handleSubscribe(requiredPlan || "pro");
                }}
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
