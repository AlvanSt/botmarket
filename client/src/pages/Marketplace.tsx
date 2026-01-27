import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "wouter";
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Eye,
  Code2,
  ArrowLeft,
  Sparkles,
  Layers,
  AppWindow,
  Database,
  TrendingUp,
  Flame,
  Package,
  SlidersHorizontal,
  X,
  Zap,
  Shield,
  Clock
} from "lucide-react";

const categories = [
  { value: "all", label: "All Categories", icon: Package },
  { value: "function", label: "Functions", icon: Code2 },
  { value: "template", label: "Templates", icon: Layers },
  { value: "application", label: "Applications", icon: AppWindow },
  { value: "dataset", label: "Datasets", icon: Database },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
];

// Smart search keyword extraction (no LLM)
function extractKeywords(query: string): { keywords: string[], suggestions: string[] } {
  const lowerQuery = query.toLowerCase();
  const keywords: string[] = [];
  const suggestions: string[] = [];
  
  // Common patterns and their mappings
  const patterns: Record<string, { keywords: string[], suggestions: string[] }> = {
    "analyze": { keywords: ["analysis", "analytics"], suggestions: ["Data Validation Library", "CSV Parser"] },
    "sales": { keywords: ["sales", "revenue", "business"], suggestions: ["SaaS Dashboard", "Invoice Generator"] },
    "image": { keywords: ["image", "photo", "picture"], suggestions: ["Image Resize & Optimize", "Product Images Dataset"] },
    "pdf": { keywords: ["pdf", "document"], suggestions: ["PDF Generator & Merger"] },
    "data": { keywords: ["data", "dataset"], suggestions: ["Data Validation Library", "CSV Parser"] },
    "ecommerce": { keywords: ["ecommerce", "store", "shop"], suggestions: ["E-commerce Store Template"] },
    "task": { keywords: ["task", "todo", "manage"], suggestions: ["Task Manager Bot"] },
    "invoice": { keywords: ["invoice", "billing"], suggestions: ["Invoice Generator Pro"] },
    "file": { keywords: ["file", "organize"], suggestions: ["File Organizer Tool"] },
    "audio": { keywords: ["audio", "sound", "music"], suggestions: ["Sample Audio Dataset"] },
    "customer": { keywords: ["customer", "review", "feedback"], suggestions: ["Customer Reviews Dataset"] },
  };
  
  Object.entries(patterns).forEach(([key, value]) => {
    if (lowerQuery.includes(key)) {
      keywords.push(...value.keywords);
      suggestions.push(...value.suggestions);
    }
  });
  
  // Extract individual words as keywords
  const words = query.split(/\s+/).filter(w => w.length > 2);
  keywords.push(...words);
  
  return { 
    keywords: Array.from(new Set(keywords)), 
    suggestions: Array.from(new Set(suggestions)).slice(0, 3) 
  };
}



function getCategoryIcon(category: string) {
  switch (category) {
    case "function": return Code2;
    case "template": return Layers;
    case "application": return AppWindow;
    case "dataset": return Database;
    default: return Code2;
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "function": return "from-blue-500/20 to-blue-600/10";
    case "template": return "from-purple-500/20 to-purple-600/10";
    case "application": return "from-green-500/20 to-green-600/10";
    case "dataset": return "from-orange-500/20 to-orange-600/10";
    default: return "from-gray-500/20 to-gray-600/10";
  }
}

export default function Marketplace() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "rating" | "price_low" | "price_high">("newest");
  const [activeTab, setActiveTab] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [minRating, setMinRating] = useState(0);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      if (search.length > 2) {
        const { suggestions } = extractKeywords(search);
        setSearchSuggestions(suggestions);
      } else {
        setSearchSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);
  
  const { data: listings, isLoading } = trpc.listings.browse.useQuery({
    category: category !== "all" ? category : undefined,
    search: debouncedSearch || undefined,
    sortBy,
    limit: 50,
  });

  // Filter listings based on advanced filters
  const filteredListings = useMemo(() => {
    if (!listings) return [];
    return listings.filter(listing => {
      const price = parseFloat(listing.price as string || "0");
      const rating = parseFloat(listing.avgRating as string || "0");
      
      if (showFreeOnly && !listing.isFree) return false;
      if (!listing.isFree && (price < priceRange[0] || price > priceRange[1])) return false;
      if (rating < minRating) return false;
      
      return true;
    });
  }, [listings, priceRange, minRating, showFreeOnly]);

  // Get trending listings (most views)
  const trendingListings = useMemo(() => {
    if (!listings) return [];
    return [...listings]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 4);
  }, [listings]);

  // Get popular listings (most downloads)
  const popularListings = useMemo(() => {
    if (!listings) return [];
    return [...listings]
      .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
      .slice(0, 4);
  }, [listings]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setPriceRange([0, 100]);
    setMinRating(0);
    setShowFreeOnly(false);
  };

  const hasActiveFilters = priceRange[0] > 0 || priceRange[1] < 100 || minRating > 0 || showFreeOnly;

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
              <span className="font-bold text-xl">Swarm Marketplace</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/my-listings/new">
                  <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                    Sell Your Code
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
              </>
            ) : (
              <Link href="/">
                <Button size="sm">Sign In to Sell</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Try: 'I need to analyze my sales data' or 'image processing tools'"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-10"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <cat.icon className="w-4 h-4" />
                        {cat.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Advanced Filters</SheetTitle>
                  </SheetHeader>
                  <div className="py-6 space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-3 block">Price Range</label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={100}
                        step={5}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}+</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-3 block">Minimum Rating</label>
                      <Slider
                        value={[minRating]}
                        onValueChange={([v]) => setMinRating(v)}
                        max={5}
                        step={0.5}
                        className="mb-2"
                      />
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {minRating}+ stars
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="free-only"
                        checked={showFreeOnly}
                        onCheckedChange={(checked) => setShowFreeOnly(checked as boolean)}
                      />
                      <label htmlFor="free-only" className="text-sm font-medium cursor-pointer">
                        Show free items only
                      </label>
                    </div>
                    <Button variant="outline" onClick={clearFilters} className="w-full">
                      Clear All Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </form>
          
          {/* Smart Search Suggestions */}
          {searchSuggestions.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Suggested:</span>
              {searchSuggestions.map((suggestion, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="cursor-pointer hover:bg-amber-100"
                  onClick={() => setSearch(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="trending">
              <Flame className="w-4 h-4 mr-1" />
              Trending
            </TabsTrigger>
          </TabsList>

          {/* All Items Tab */}
          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-40 w-full" />
                    <CardHeader>
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full mt-2" />
                    </CardHeader>
                    <CardFooter>
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredListings && filteredListings.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Showing {filteredListings.length} results
                  {hasActiveFilters && " (filtered)"}
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredListings.map((listing) => {
                    const CategoryIcon = getCategoryIcon(listing.category);
                    return (
                      <Link key={listing.id} href={`/listing/${listing.slug}`}>
                        <Card className="overflow-hidden card-hover cursor-pointer h-full group">
                          <div className={`h-40 bg-gradient-to-br ${getCategoryColor(listing.category)} flex items-center justify-center relative`}>
                            <CategoryIcon className="w-12 h-12 text-foreground/20" />
                            {listing.isFree && (
                              <Badge className="absolute top-2 right-2 bg-green-500">Free</Badge>
                            )}
                          </div>
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-lg line-clamp-1 group-hover:text-amber-600 transition-colors">
                                {listing.title}
                              </CardTitle>
                              <Badge variant="secondary" className="text-xs shrink-0">
                                {listing.category}
                              </Badge>
                            </div>
                            <CardDescription className="line-clamp-2">
                              {listing.shortDescription || listing.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                {parseFloat(listing.avgRating as string || "0").toFixed(1)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {listing.viewCount || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <Download className="w-4 h-4" />
                                {listing.downloadCount || 0}
                              </span>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-2">
                            <div className="w-full flex items-center justify-between">
                              <span className="font-bold text-lg">
                                {listing.isFree ? (
                                  <span className="text-green-600">Free</span>
                                ) : (
                                  `$${parseFloat(listing.price as string).toFixed(2)}`
                                )}
                              </span>
                              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                                View Details
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <Code2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No listings found</h3>
                <p className="text-muted-foreground mb-6">
                  {search ? `No results for "${search}"` : "Be the first to list your code!"}
                </p>
                {isAuthenticated && (
                  <Link href="/my-listings/new">
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                      Create a Listing
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending" className="mt-6">
            <div className="space-y-8">
              {/* Trending Now */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <h2 className="text-xl font-bold">Trending Now</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {trendingListings.map((listing, index) => {
                    const CategoryIcon = getCategoryIcon(listing.category);
                    return (
                      <Link key={listing.id} href={`/listing/${listing.slug}`}>
                        <Card className="overflow-hidden card-hover cursor-pointer h-full relative">
                          <div className="absolute top-2 left-2 z-10">
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                              #{index + 1} Trending
                            </Badge>
                          </div>
                          <div className={`h-32 bg-gradient-to-br ${getCategoryColor(listing.category)} flex items-center justify-center`}>
                            <CategoryIcon className="w-10 h-10 text-foreground/20" />
                          </div>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base line-clamp-1">{listing.title}</CardTitle>
                          </CardHeader>
                          <CardFooter className="pt-0">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Eye className="w-4 h-4" />
                              {listing.viewCount || 0} views
                            </div>
                          </CardFooter>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Most Downloaded */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Download className="w-5 h-5 text-green-500" />
                  <h2 className="text-xl font-bold">Most Downloaded</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {popularListings.map((listing, index) => {
                    const CategoryIcon = getCategoryIcon(listing.category);
                    return (
                      <Link key={listing.id} href={`/listing/${listing.slug}`}>
                        <Card className="overflow-hidden card-hover cursor-pointer h-full relative">
                          <div className="absolute top-2 left-2 z-10">
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                              #{index + 1} Popular
                            </Badge>
                          </div>
                          <div className={`h-32 bg-gradient-to-br ${getCategoryColor(listing.category)} flex items-center justify-center`}>
                            <CategoryIcon className="w-10 h-10 text-foreground/20" />
                          </div>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base line-clamp-1">{listing.title}</CardTitle>
                          </CardHeader>
                          <CardFooter className="pt-0">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Download className="w-4 h-4" />
                              {listing.downloadCount || 0} downloads
                            </div>
                          </CardFooter>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>


        </Tabs>
      </main>
    </div>
  );
}
