import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { 
  Code2, 
  Brain, 
  LayoutDashboard, 
  ShoppingCart, 
  Star, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle2,
  Users,
  TrendingUp,
  Database,
  Layers,
  AppWindow,
  Sparkles
} from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Swarm</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/marketplace" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Marketplace
            </Link>
            <Link href="/marketplace?category=function" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Functions
            </Link>
            <Link href="/marketplace?category=template" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Templates
            </Link>
            <Link href="/marketplace?category=application" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Apps
            </Link>
            <Link href="/marketplace?category=dataset" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Data
            </Link>
            <Link href="/ai-builder" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              AI Builder
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <Link href="/profile">
                  <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                    {user?.name || 'Profile'}
                  </Button>
                </Link>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                  Sign In
                </Button>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-100/50 via-transparent to-transparent" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4 bg-amber-100 text-amber-800 border-amber-200">
              AI Marketplace & No-Code Builder
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Build, Buy & Sell
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent block mt-2">
                AI Solutions
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The complete platform for AI creators and businesses. Browse our marketplace of code functions, 
              templates, apps, and datasets. Build custom AI models without code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Browse Marketplace
                </Button>
              </Link>
              <Link href="/ai-builder">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-amber-300 hover:bg-amber-50">
                  <Brain className="w-4 h-4 mr-2" />
                  Start Building
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Store Types Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Four Powerful Stores</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build, deploy, and scale AI solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/marketplace?category=function">
              <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:border-amber-300 group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <Code2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Code Store</CardTitle>
                  <CardDescription>
                    Reusable functions, utilities, and logic blocks ready to integrate.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/marketplace?category=template">
              <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:border-amber-300 group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                    <Layers className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Template Store</CardTitle>
                  <CardDescription>
                    Starter packs and pre-configured pipelines to jumpstart your projects.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/marketplace?category=application">
              <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:border-amber-300 group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <AppWindow className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">App Store</CardTitle>
                  <CardDescription>
                    Fully functional applications and AI bots ready to deploy.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/marketplace?category=dataset">
              <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:border-amber-300 group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                    <Database className="w-6 h-6 text-amber-600" />
                  </div>
                  <CardTitle className="text-lg">Data Marketplace</CardTitle>
                  <CardDescription>
                    Curated datasets for training AI models with quality ratings.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-amber-50/50 to-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Complete AI Ecosystem</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From marketplace to builder to management — everything in one platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-amber-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Marketplace</CardTitle>
                <CardDescription>
                  Browse and purchase ready-to-use code, templates, apps, and datasets from our curated marketplace.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Smart search with natural language
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Verified & reviewed listings
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    30-day refund guarantee
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-amber-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle>No-Code AI Builder</CardTitle>
                <CardDescription>
                  Create custom AI models without writing code. Upload data, train, and deploy in minutes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    10 AI model types supported
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Visual training dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Export & publish models
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-amber-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Project Dashboard</CardTitle>
                <CardDescription>
                  Manage all your projects, track sales, monitor earnings, and analyze performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Real-time analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Team collaboration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Revenue splitting
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4 border-amber-300 text-amber-700">Trust & Safety</Badge>
              <h2 className="text-3xl font-bold mb-4">Built on Trust</h2>
              <p className="text-muted-foreground mb-6">
                Every listing goes through our manual review process. Only verified purchasers can leave reviews, 
                and we offer a 30-day money-back guarantee on all purchases.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Manual Review</h3>
                    <p className="text-sm text-muted-foreground">Every listing is reviewed by our team before publishing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Verified Reviews</h3>
                    <p className="text-sm text-muted-foreground">Only verified purchasers can leave reviews</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">30-Day Guarantee</h3>
                    <p className="text-sm text-muted-foreground">Full refund within 30 days if not satisfied</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center border-2 hover:border-amber-300 transition-colors">
                <Users className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <div className="text-3xl font-bold">1,000+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </Card>
              <Card className="p-6 text-center border-2 hover:border-amber-300 transition-colors">
                <Code2 className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-muted-foreground">Listings</div>
              </Card>
              <Card className="p-6 text-center border-2 hover:border-amber-300 transition-colors">
                <Star className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <div className="text-3xl font-bold">4.8</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </Card>
              <Card className="p-6 text-center border-2 hover:border-amber-300 transition-colors">
                <TrendingUp className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <div className="text-3xl font-bold">$50K+</div>
                <div className="text-sm text-muted-foreground">Creator Earnings</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the Swarm?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of creators and businesses building the future with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="bg-white text-amber-600 hover:bg-amber-50">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="lg" variant="secondary" className="bg-white text-amber-600 hover:bg-amber-50">
                  Create Free Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">Swarm</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link>
              <Link href="/ai-builder" className="hover:text-foreground transition-colors">AI Builder</Link>
              <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Swarm. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
