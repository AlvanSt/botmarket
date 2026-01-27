import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  Palette,
  Headphones,
  HardDrive,
  Gift
} from "lucide-react";

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
      { name: "Storage Space", value: "2GB", included: true },
      { name: "Support Level", value: "Community Forum", included: true },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For serious creators and small teams",
    monthlyPrice: 14.99,
    yearlyPrice: 143.90, // 20% off
    icon: Star,
    color: "from-amber-500 to-orange-600",
    popular: true,
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
      { name: "Storage Space", value: "25GB", included: true },
      { name: "Support Level", value: "Email (48hr)", included: true },
    ],
  },
  {
    id: "master",
    name: "Master",
    description: "For power users and enterprises",
    monthlyPrice: 49.99,
    yearlyPrice: 479.90, // 20% off
    icon: Crown,
    color: "from-purple-500 to-indigo-600",
    popular: false,
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
  const { isAuthenticated } = useAuth();
  const [isYearly, setIsYearly] = useState(false);

  const handleSubscribe = (planId: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to subscribe");
      return;
    }
    
    if (planId === "free") {
      toast.success("You're already on the Free plan!");
      return;
    }
    
    // TODO: Integrate with Stripe subscription checkout
    toast.info("Subscription checkout coming soon!");
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
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden ${plan.popular ? "border-amber-500 border-2 shadow-lg" : ""}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-none rounded-bl-lg bg-gradient-to-r from-amber-500 to-orange-600">
                    Most Popular
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
                >
                  {plan.id === "free" ? "Get Started" : "Start Free Trial"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="bg-muted/50 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Additional Benefits</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {additionalBenefits.map((benefit, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-3">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Master Plan Exclusive */}
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-purple-600" />
              <div>
                <CardTitle>Master Plan Exclusive: Custom Project Request</CardTitle>
                <CardDescription>Get tailored solutions built just for you</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Complete Workflow</h4>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                    <span><strong>Request Submission</strong> - Detailed form with project specs, timeline, budget</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                    <span><strong>Admin Review</strong> - Technical feasibility assessment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                    <span><strong>Quotation & Planning</strong> - Detailed proposal with milestones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">4</span>
                    <span><strong>Development & Testing</strong> - Managed development with updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">5</span>
                    <span><strong>Delivery & Support</strong> - Complete handover with documentation</span>
                  </li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Example Projects</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600" />
                    Custom industrial inspection systems
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600" />
                    Specialized data processing pipelines
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600" />
                    Integration with existing business systems
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600" />
                    Performance-optimized models for edge devices
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/custom-project">
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
                Request Custom Project
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
          <p className="text-muted-foreground mb-6">
            Contact our team for enterprise pricing or custom solutions.
          </p>
          <Button variant="outline" size="lg">
            <Headphones className="w-4 h-4 mr-2" />
            Contact Sales
          </Button>
        </div>
      </main>
    </div>
  );
}
