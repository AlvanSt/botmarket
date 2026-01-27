import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { 
  ShoppingCart, 
  Download, 
  ExternalLink, 
  Calendar,
  Code,
  Database,
  Layers,
  AppWindow,
  Brain,
  Search,
  Filter,
  ArrowRight
} from "lucide-react";

const categoryIcons: Record<string, any> = {
  function: Code,
  template: Layers,
  application: AppWindow,
  dataset: Database,
};

const categoryColors: Record<string, string> = {
  function: "bg-blue-100 text-blue-600",
  template: "bg-purple-100 text-purple-600",
  application: "bg-green-100 text-green-600",
  dataset: "bg-amber-100 text-amber-600",
};

export default function MyPurchases() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: purchases, isLoading } = trpc.purchases.getMine.useQuery();

  const downloadMutation = trpc.listings.getDownloadUrl.useMutation({
    onSuccess: (data) => {
      window.open(data.url, "_blank");
      toast.success("Download started!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDownload = (listingId: number) => {
    downloadMutation.mutate({ listingId });
  };

  const handleUseInAIBuilder = (purchase: any) => {
    // Store the selected dataset in session storage for the AI Builder to pick up
    sessionStorage.setItem('selectedDataset', JSON.stringify({
      id: purchase.id,
      listingId: purchase.listingId,
      title: purchase.listing?.title || `Dataset #${purchase.listingId}`,
    }));
    toast.success("Dataset selected! Redirecting to AI Builder...");
    navigate("/ai-builder");
  };

  // Filter purchases
  const filteredPurchases = purchases?.filter((purchase: any) => {
    const matchesSearch = !searchQuery || 
      purchase.listing?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || purchase.listing?.category === activeTab;
    return matchesSearch && matchesTab;
  }) || [];

  // Group by category for stats
  const stats = {
    all: purchases?.length || 0,
    function: purchases?.filter((p: any) => p.listing?.category === 'function').length || 0,
    template: purchases?.filter((p: any) => p.listing?.category === 'template').length || 0,
    application: purchases?.filter((p: any) => p.listing?.category === 'application').length || 0,
    dataset: purchases?.filter((p: any) => p.listing?.category === 'dataset').length || 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Purchases</h1>
            <p className="text-muted-foreground">
              Access, download, and use your purchased items
            </p>
          </div>
          <Link href="/marketplace">
            <Button variant="outline">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Browse More
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setActiveTab("all")}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{stats.all}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setActiveTab("function")}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.function}</p>
              <p className="text-sm text-muted-foreground">Functions</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setActiveTab("template")}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.template}</p>
              <p className="text-sm text-muted-foreground">Templates</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setActiveTab("application")}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.application}</p>
              <p className="text-sm text-muted-foreground">Apps</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setActiveTab("dataset")}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{stats.dataset}</p>
              <p className="text-sm text-muted-foreground">Datasets</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search purchases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({stats.all})</TabsTrigger>
            <TabsTrigger value="function">Functions ({stats.function})</TabsTrigger>
            <TabsTrigger value="template">Templates ({stats.template})</TabsTrigger>
            <TabsTrigger value="application">Apps ({stats.application})</TabsTrigger>
            <TabsTrigger value="dataset">Datasets ({stats.dataset})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Purchases List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded" />
                      <div>
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32 mt-2" />
                      </div>
                    </div>
                    <Skeleton className="h-9 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPurchases.length > 0 ? (
          <div className="space-y-4">
            {filteredPurchases.map((purchase: any) => {
              const category = purchase.listing?.category || 'function';
              const Icon = categoryIcons[category] || Code;
              const colorClass = categoryColors[category] || categoryColors.function;
              const isDataset = category === 'dataset';
              
              return (
                <Card key={purchase.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {purchase.listing?.title || `Item #${purchase.listingId}`}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(purchase.createdAt).toLocaleDateString()}
                            </span>
                            <Badge variant="outline" className="capitalize">
                              {category}
                            </Badge>
                            <Badge variant="outline">
                              ${parseFloat(purchase.amount as string).toFixed(2)}
                            </Badge>
                            <Badge variant={purchase.status === 'completed' ? 'default' : 'secondary'}>
                              {purchase.status}
                            </Badge>
                          </div>
                          {purchase.listing?.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                              {purchase.listing.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Use in AI Builder button for datasets */}
                        {isDataset && (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                            onClick={() => handleUseInAIBuilder(purchase)}
                          >
                            <Brain className="w-4 h-4 mr-2" />
                            Use in AI Builder
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(purchase.listingId)}
                          disabled={downloadMutation.isPending}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Link href={`/listing/${purchase.listingId}`}>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="py-16">
            <CardContent className="text-center">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery || activeTab !== "all" ? "No matching purchases" : "No purchases yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || activeTab !== "all" 
                  ? "Try adjusting your search or filter"
                  : "Browse the marketplace to find code, templates, and datasets"
                }
              </p>
              <div className="flex gap-3 justify-center">
                {(searchQuery || activeTab !== "all") && (
                  <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveTab("all"); }}>
                    Clear Filters
                  </Button>
                )}
                <Link href="/marketplace">
                  <Button>
                    Browse Marketplace
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions for Datasets */}
        {stats.dataset > 0 && activeTab !== "dataset" && (
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Train AI Models with Your Data</h3>
                    <p className="text-sm text-muted-foreground">
                      You have {stats.dataset} dataset{stats.dataset > 1 ? 's' : ''} ready to use in the AI Builder
                    </p>
                  </div>
                </div>
                <Button 
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  onClick={() => navigate("/ai-builder")}
                >
                  Open AI Builder
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
