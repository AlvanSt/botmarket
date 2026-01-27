import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { toast } from "sonner";
import { 
  Sparkles, 
  ArrowLeft,
  DollarSign,
  Users,
  TrendingUp,
  Copy,
  Gift,
  Target,
  Award,
  BarChart3,
  Megaphone,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const tiers = [
  {
    name: "Starter",
    commission: "5%",
    requirement: "0-10 referrals",
    color: "from-gray-500 to-gray-600",
    benefits: ["Basic tracking dashboard", "Standard payout (monthly)", "Email support"]
  },
  {
    name: "Partner",
    commission: "7%",
    requirement: "11-50 referrals",
    color: "from-amber-500 to-orange-600",
    benefits: ["Advanced analytics", "Bi-weekly payouts", "Marketing materials", "Priority support"]
  },
  {
    name: "Elite",
    commission: "10%",
    requirement: "50+ referrals",
    color: "from-purple-500 to-indigo-600",
    benefits: ["Custom landing pages", "Weekly payouts", "Dedicated account manager", "Co-marketing opportunities"]
  }
];

const marketingTools = [
  { icon: Megaphone, title: "Banner Ads", description: "High-converting banners in multiple sizes" },
  { icon: Gift, title: "Promo Codes", description: "Exclusive discount codes for your audience" },
  { icon: BarChart3, title: "Analytics Dashboard", description: "Real-time tracking and reporting" },
  { icon: Target, title: "Deep Links", description: "Track specific products and campaigns" },
];

export default function Affiliate() {
  const { user, isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  
  // Generate affiliate link
  const affiliateCode = user?.id ? `SWARM${user.id}` : "SWARMXXX";
  const affiliateLink = `https://swarm.market/?ref=${affiliateCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    toast.success("Affiliate link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock stats for demo
  const stats = {
    totalReferrals: 23,
    activeReferrals: 18,
    totalEarnings: 456.78,
    pendingPayout: 89.50,
    currentTier: "Partner",
    conversionRate: 12.5,
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
              <span className="font-bold text-xl">Swarm Affiliates</span>
            </div>
          </div>
          
          {isAuthenticated && (
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
          )}
        </div>
      </header>

      <main className="container py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
            Affiliate Program
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Earn Up to <span className="text-amber-600">10% Commission</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share Swarm with your audience and earn recurring commissions on every sale and subscription.
          </p>
        </div>

        {isAuthenticated ? (
          <>
            {/* Affiliate Dashboard */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Referrals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-600" />
                    <span className="text-3xl font-bold">{stats.totalReferrals}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Active Referrals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-3xl font-bold">{stats.activeReferrals}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Earnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-3xl font-bold">${stats.totalEarnings.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Pending Payout</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                    <span className="text-3xl font-bold">${stats.pendingPayout.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Your Affiliate Link */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Your Affiliate Link</CardTitle>
                <CardDescription>Share this link to earn commissions on referrals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input 
                    value={affiliateLink} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button onClick={copyLink} className="shrink-0">
                    {copied ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <Badge variant="secondary">Your Code: {affiliateCode}</Badge>
                  <Badge className="bg-amber-100 text-amber-800">
                    Current Tier: {stats.currentTier}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Conversion Rate: {stats.conversionRate}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Progress to Next Tier */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Progress to Elite Tier</CardTitle>
                <CardDescription>Get 27 more referrals to unlock 10% commission</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={46} className="h-3 mb-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>23 referrals</span>
                  <span>50 referrals (Elite)</span>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Join CTA for non-authenticated users */
          <Card className="mb-12 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="py-8 text-center">
              <Gift className="w-16 h-16 text-amber-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Join the Affiliate Program</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Sign in to get your unique affiliate link and start earning commissions today.
              </p>
              <Link href="/">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                  Sign In to Join
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Commission Tiers */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Commission Tiers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <Card key={tier.name} className="relative overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${tier.color}`} />
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mx-auto mb-4`}>
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>{tier.requirement}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-amber-600 mb-4">{tier.commission}</div>
                  <ul className="space-y-2 text-sm text-left">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Marketing Tools */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Marketing Toolkit</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {marketingTools.map((tool, i) => (
              <Card key={i} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-center">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold mb-2">Sign Up</h3>
                <p className="text-sm text-muted-foreground">Create your free Swarm account</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold mb-2">Get Your Link</h3>
                <p className="text-sm text-muted-foreground">Copy your unique affiliate link</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold mb-2">Share & Promote</h3>
                <p className="text-sm text-muted-foreground">Share with your audience</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="font-semibold mb-2">Earn Commissions</h3>
                <p className="text-sm text-muted-foreground">Get paid for every referral</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
