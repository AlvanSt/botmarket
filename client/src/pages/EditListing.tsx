import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useLocation, Link } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, Save, Send, Upload } from "lucide-react";

const languages = [
  "JavaScript", "TypeScript", "Python", "Go", "Rust", "Java", "C#", "PHP", "Ruby", "Other"
];

const frameworks = [
  "React", "Vue", "Angular", "Next.js", "Express", "FastAPI", "Django", "Flask", "None", "Other"
];

export default function EditListing() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const listingId = parseInt(id || "0");

  const { data: listing, isLoading } = trpc.listings.getById.useQuery(
    { id: listingId },
    { enabled: !!listingId }
  );

  const [form, setForm] = useState({
    title: "",
    description: "",
    shortDescription: "",
    price: 0,
    isFree: false,
    language: "",
    framework: "",
    version: "",
    tags: "",
    dependencies: "",
  });

  useEffect(() => {
    if (listing) {
      setForm({
        title: listing.title,
        description: listing.description || "",
        shortDescription: listing.shortDescription || "",
        price: parseFloat(listing.price as string) || 0,
        isFree: listing.isFree || false,
        language: listing.language || "",
        framework: listing.framework || "",
        version: listing.version || "",
        tags: (listing.tags || []).join(", "),
        dependencies: (listing.dependencies || []).join(", "),
      });
    }
  }, [listing]);

  const updateMutation = trpc.listings.update.useMutation({
    onSuccess: () => {
      toast.success("Listing updated!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const submitMutation = trpc.listings.submitForReview.useMutation({
    onSuccess: () => {
      toast.success("Listing submitted for review!");
      navigate("/my-listings");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    const dependencies = form.dependencies.split(",").map(d => d.trim()).filter(Boolean);
    
    updateMutation.mutate({
      id: listingId,
      title: form.title,
      description: form.description,
      shortDescription: form.shortDescription,
      price: form.isFree ? 0 : form.price,
      isFree: form.isFree,
      language: form.language || undefined,
      framework: form.framework || undefined,
      version: form.version || undefined,
      tags: tags.length > 0 ? tags : undefined,
      dependencies: dependencies.length > 0 ? dependencies : undefined,
    });
  };

  const handleSubmitForReview = () => {
    submitMutation.mutate({ id: listingId });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!listing) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-2">Listing Not Found</h1>
          <Link href="/my-listings">
            <Button>Back to My Listings</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/my-listings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Listing</h1>
            <p className="text-muted-foreground">
              Update your listing details
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Listing Details</CardTitle>
            <CardDescription>
              Status: <span className="capitalize font-medium">{listing.status}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={form.version}
                    onChange={(e) => setForm({ ...form, version: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={form.language}
                    onValueChange={(v) => setForm({ ...form, language: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="framework">Framework</Label>
                  <Select
                    value={form.framework}
                    onValueChange={(v) => setForm({ ...form, framework: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select framework" />
                    </SelectTrigger>
                    <SelectContent>
                      {frameworks.map((fw) => (
                        <SelectItem key={fw} value={fw}>
                          {fw}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                  id="shortDescription"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  maxLength={512}
                />
              </div>

              <div>
                <Label htmlFor="description">Full Description *</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={6}
                  required
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="dependencies">Dependencies (comma-separated)</Label>
                <Input
                  id="dependencies"
                  value={form.dependencies}
                  onChange={(e) => setForm({ ...form, dependencies: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="isFree">Free Listing</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this listing free for everyone
                  </p>
                </div>
                <Switch
                  id="isFree"
                  checked={form.isFree}
                  onCheckedChange={(checked) => setForm({ ...form, isFree: checked })}
                />
              </div>

              {!form.isFree && (
                <div>
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              )}

              <div className="flex gap-3">
                <Button type="submit" disabled={updateMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>

                {(listing.status === 'draft' || listing.status === 'rejected') && listing.fileUrl && (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleSubmitForReview}
                    disabled={submitMutation.isPending}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {submitMutation.isPending ? "Submitting..." : "Submit for Review"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
