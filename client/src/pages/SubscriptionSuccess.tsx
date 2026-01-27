import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useSearch } from "wouter";
import { CheckCircle2, ArrowRight, Crown, Star } from "lucide-react";

export default function SubscriptionSuccess() {
  const { user } = useAuth();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const plan = params.get("plan") || "pro";



  const planDetails = {
    pro: {
      name: "Pro",
      icon: Star,
      color: "from-amber-500 to-orange-600",
      features: [
        "15 Project Slots",
        "15% Marketplace Commission",
        "10 AI Training Sessions/month",
        "Team Collaboration (3 members)",
        "Custom Project Requests ($500+ budget)",
      ],
    },
    master: {
      name: "Master",
      icon: Crown,
      color: "from-purple-500 to-indigo-600",
      features: [
        "30 Project Slots",
        "10% Marketplace Commission",
        "40 AI Training Sessions/month",
        "Team Collaboration (10 members)",
        "Custom Project Requests (Any budget)",
        "Priority Support",
      ],
    },
  };

  const currentPlan = planDetails[plan as keyof typeof planDetails] || planDetails.pro;
  const PlanIcon = currentPlan.icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 relative">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${currentPlan.color} flex items-center justify-center`}>
              <PlanIcon className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to {currentPlan.name}!</CardTitle>
          <CardDescription>
            Your subscription is now active. Thank you for upgrading!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Your new benefits:</h3>
            <ul className="space-y-2">
              {currentPlan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <Link href="/dashboard">
              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/ai-builder">
              <Button variant="outline" className="w-full">
                Start Building AI Models
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="ghost" className="w-full">
                Explore Marketplace
              </Button>
            </Link>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Need help? Check out our <Link href="/docs" className="underline">documentation</Link> or contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
