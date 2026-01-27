import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link, useParams, useLocation } from "wouter";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Star, 
  Download, 
  Eye,
  Code2,
  User,
  Calendar,
  ShoppingCart,
  CheckCircle,
  Brain
} from "lucide-react";

export default function ListingDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  const { data: listing, isLoading } = trpc.listings.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );
  
  const { data: reviews } = trpc.reviews.getByListing.useQuery(
    { listingId: listing?.id || 0 },
    { enabled: !!listing?.id }
  );
  
  const { data: purchaseCheck } = trpc.listings.checkPurchase.useQuery(
    { listingId: listing?.id || 0 },
    { enabled: !!listing?.id && isAuthenticated }
  );
  
  const { data: canReview } = trpc.reviews.canReview.useQuery(
    { listingId: listing?.id || 0 },
    { enabled: !!listing?.id && isAuthenticated }
  );
  
  const purchaseMutation = trpc.purchases.create.useMutation({
    onSuccess: () => {
      toast.success("Purchase successful! You can now download the file.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const downloadMutation = trpc.listings.getDownloadUrl.useMutation({
    onSuccess: (data) => {
      window.open(data.url, "_blank");
      toast.success("Download started!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const [reviewForm, setReviewForm] = useState({
    ratingAccuracy: 5,
    ratingUsability: 5,
    ratingDocumentation: 5,
    ratingSupport: 5,
    title: "",
    content: "",
  });
  
  const reviewMutation = trpc.reviews.create.useMutation({
    onSuccess: () => {
      toast.success("Review submitted!");
      setReviewForm({
        ratingAccuracy: 5,
        ratingUsability: 5,
        ratingDocumentation: 5,
        ratingSupport: 5,
        title: "",
        content: "",
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handlePurchase = () => {
    if (!listing) return;
    if (listing.isFree) {
      purchaseMutation.mutate({ listingId: listing.id });
    } else {
      toast.info("Stripe payment integration coming soon!");
    }
  };

  const handleDownload = () => {
    if (!listing) return;
    downloadMutation.mutate({ listingId: listing.id });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    reviewMutation.mutate({
      listingId: listing.id,
      ...reviewForm,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Code2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Listing Not Found</h1>
          <p className="text-muted-foreground mb-4">This listing doesn't exist or has been removed.</p>
          <Link href="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === listing.sellerId;
  const hasPurchased = purchaseCheck?.hasPurchased || listing.isFree;
  const canDownload = isOwner || hasPurchased;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <Link href="/marketplace">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview */}
            <div className="h-64 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
              <Code2 className="w-24 h-24 text-primary/40" />
            </div>

            {/* Title & Meta */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge variant="secondary">{listing.category}</Badge>
                    {listing.language && <Badge variant="outline">{listing.language}</Badge>}
                    {listing.framework && <Badge variant="outline">{listing.framework}</Badge>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {parseFloat(listing.avgRating as string || "0").toFixed(1)} ({listing.reviewCount || 0} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {listing.viewCount || 0} views
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {listing.downloadCount || 0} downloads
                </span>
                <span className="flex items-center gap-1">
                  <ShoppingCart className="w-4 h-4" />
                  {listing.purchaseCount || 0} sales
                </span>
              </div>
            </div>

            <Separator />

            {/* Tabs */}
            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({listing.reviewCount || 0})</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{listing.description}</p>
                </div>

                {listing.dependencies && listing.dependencies.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Dependencies</h3>
                    <div className="flex flex-wrap gap-2">
                      {listing.dependencies.map((dep, i) => (
                        <Badge key={i} variant="outline">{dep}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 space-y-6">
                {/* Rating Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Rating Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: "Accuracy", value: listing.avgAccuracy },
                      { label: "Usability", value: listing.avgUsability },
                      { label: "Documentation", value: listing.avgDocumentation },
                      { label: "Support", value: listing.avgSupport },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-4">
                        <span className="w-28 text-sm">{item.label}</span>
                        <Progress value={parseFloat(item.value as string || "0") * 20} className="flex-1" />
                        <span className="w-8 text-sm text-right">
                          {parseFloat(item.value as string || "0").toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Write Review */}
                {canReview?.canReview && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Write a Review</CardTitle>
                      <CardDescription>Share your experience with this listing</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { key: "ratingAccuracy", label: "Accuracy" },
                            { key: "ratingUsability", label: "Usability" },
                            { key: "ratingDocumentation", label: "Documentation" },
                            { key: "ratingSupport", label: "Support" },
                          ].map((item) => (
                            <div key={item.key}>
                              <Label>{item.label}</Label>
                              <div className="flex items-center gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setReviewForm({ ...reviewForm, [item.key]: star })}
                                    className="p-1"
                                  >
                                    <Star
                                      className={`w-5 h-5 ${
                                        star <= (reviewForm as any)[item.key]
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-muted-foreground"
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div>
                          <Label>Title (optional)</Label>
                          <Input
                            value={reviewForm.title}
                            onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                            placeholder="Summarize your experience"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Review (optional)</Label>
                          <Textarea
                            value={reviewForm.content}
                            onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                            placeholder="Tell others about your experience..."
                            className="mt-1"
                            rows={4}
                          />
                        </div>
                        <Button type="submit" disabled={reviewMutation.isPending}>
                          {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {/* Reviews List */}
                {reviews && reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{review.title || "Review"}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= parseFloat(review.overallRating as string)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-muted-foreground"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified Purchase
                                </Badge>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </CardHeader>
                        {review.content && (
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{review.content}</p>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No reviews yet</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="text-3xl font-bold">
                  {listing.isFree ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `$${parseFloat(listing.price as string).toFixed(2)}`
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {canDownload ? (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleDownload}
                    disabled={downloadMutation.isPending}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {downloadMutation.isPending ? "Preparing..." : "Download"}
                  </Button>
                ) : isAuthenticated ? (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handlePurchase}
                    disabled={purchaseMutation.isPending}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {purchaseMutation.isPending ? "Processing..." : listing.isFree ? "Get for Free" : "Purchase"}
                  </Button>
                ) : (
                  <Link href="/">
                    <Button className="w-full" size="lg">
                      Sign In to Purchase
                    </Button>
                  </Link>
                )}

                {hasPurchased && !isOwner && (
                  <p className="text-sm text-center text-green-600 flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    You own this item
                  </p>
                )}

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Version</span>
                    <span>{listing.version || "1.0.0"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Published</span>
                    <span>{listing.publishedAt ? new Date(listing.publishedAt).toLocaleDateString() : "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sales</span>
                    <span>{listing.purchaseCount || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seller</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Seller #{listing.sellerId}</p>
                    <p className="text-sm text-muted-foreground">Member since 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guarantee */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">30-Day Money Back Guarantee</p>
                    <p className="text-sm text-green-700 mt-1">
                      Not satisfied? Request a full refund within 30 days.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      {...props}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.className || ""}`}
    />
  );
}
