import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, Upload, Save, Send } from "lucide-react";
import { Link } from "wouter";

const categories = [
  { value: "function", label: "Function" },
  { value: "template", label: "Template" },
  { value: "application", label: "Application" },
  { value: "dataset", label: "Dataset" },
];

const languages = [
  "JavaScript", "TypeScript", "Python", "Go", "Rust", "Java", "C#", "PHP", "Ruby", "Other"
];

const frameworks = [
  "React", "Vue", "Angular", "Next.js", "Express", "FastAPI", "Django", "Flask", "None", "Other"
];

export default function CreateListing() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({
    title: "",
    description: "",
    shortDescription: "",
    category: "function",
    price: 0,
    isFree: false,
    language: "",
    framework: "",
    version: "1.0.0",
    tags: "",
    dependencies: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [createdListingId, setCreatedListingId] = useState<number | null>(null);

  const createMutation = trpc.listings.create.useMutation({
    onSuccess: (data) => {
      setCreatedListingId(data.id);
      toast.success("Listing created! Now upload your file.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const uploadMutation = trpc.listings.uploadFile.useMutation({
    onSuccess: () => {
      toast.success("File uploaded successfully!");
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    const dependencies = form.dependencies.split(",").map(d => d.trim()).filter(Boolean);
    
    createMutation.mutate({
      title: form.title,
      description: form.description,
      shortDescription: form.shortDescription,
      category: form.category as any,
      price: form.isFree ? 0 : form.price,
      isFree: form.isFree,
      language: form.language || undefined,
      framework: form.framework || undefined,
      version: form.version || undefined,
      tags: tags.length > 0 ? tags : undefined,
      dependencies: dependencies.length > 0 ? dependencies : undefined,
    });
  };

  const handleFileUpload = async () => {
    if (!file || !createdListingId) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(",")[1];
      uploadMutation.mutate({
        listingId: createdListingId,
        fileName: file.name,
        fileContent: base64,
        contentType: file.type || "application/octet-stream",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitForReview = () => {
    if (!createdListingId) return;
    submitMutation.mutate({ id: createdListingId });
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Listing</h1>
            <p className="text-muted-foreground">
              List your code on the marketplace
            </p>
          </div>
        </div>

        {/* Step 1: Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Basic Information</CardTitle>
            <CardDescription>
              Provide details about your listing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g., React Authentication Hook"
                    required
                    disabled={!!createdListingId}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v })}
                    disabled={!!createdListingId}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={form.version}
                    onChange={(e) => setForm({ ...form, version: e.target.value })}
                    placeholder="1.0.0"
                    disabled={!!createdListingId}
                  />
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={form.language}
                    onValueChange={(v) => setForm({ ...form, language: v })}
                    disabled={!!createdListingId}
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
                    disabled={!!createdListingId}
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
                  placeholder="Brief summary (shown in cards)"
                  maxLength={512}
                  disabled={!!createdListingId}
                />
              </div>

              <div>
                <Label htmlFor="description">Full Description *</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed description of your listing..."
                  rows={6}
                  required
                  disabled={!!createdListingId}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="react, hooks, authentication"
                  disabled={!!createdListingId}
                />
              </div>

              <div>
                <Label htmlFor="dependencies">Dependencies (comma-separated)</Label>
                <Input
                  id="dependencies"
                  value={form.dependencies}
                  onChange={(e) => setForm({ ...form, dependencies: e.target.value })}
                  placeholder="react, axios, lodash"
                  disabled={!!createdListingId}
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
                  disabled={!!createdListingId}
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
                    placeholder="9.99"
                    disabled={!!createdListingId}
                  />
                </div>
              )}

              {!createdListingId && (
                <Button type="submit" disabled={createMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  {createMutation.isPending ? "Creating..." : "Create Listing"}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Step 2: Upload File */}
        {createdListingId && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Upload File</CardTitle>
              <CardDescription>
                Upload the file for your listing (ZIP, code files, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop
                  </p>
                  {file && (
                    <p className="text-sm font-medium text-primary">{file.name}</p>
                  )}
                </label>
              </div>

              <Button 
                onClick={handleFileUpload} 
                disabled={!file || uploadMutation.isPending}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploadMutation.isPending ? "Uploading..." : "Upload File"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Submit for Review */}
        {createdListingId && uploadMutation.isSuccess && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Submit for Review</CardTitle>
              <CardDescription>
                Your listing will be reviewed by our team before publishing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleSubmitForReview}
                disabled={submitMutation.isPending}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitMutation.isPending ? "Submitting..." : "Submit for Review"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
