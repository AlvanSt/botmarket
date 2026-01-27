import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "wouter";
import { toast } from "sonner";
import { 
  Search, 
  Database, 
  Image, 
  FileText, 
  Music, 
  BarChart3, 
  Table2,
  ArrowLeft,
  Sparkles,
  Star,
  Download,
  Eye,
  Shield,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Scale,
  Clock,
  Users,
  TrendingUp,
  Filter
} from "lucide-react";

// Data types with icons
const dataTypes = [
  { value: "all", label: "All Types", icon: Database },
  { value: "images", label: "Images", icon: Image },
  { value: "audio", label: "Audio", icon: Music },
  { value: "text", label: "Text", icon: FileText },
  { value: "time_series", label: "Time Series", icon: TrendingUp },
  { value: "tabular", label: "Tabular", icon: Table2 },
];

// License types
const licenseTypes = [
  { value: "all", label: "All Licenses" },
  { value: "commercial", label: "Commercial Use", icon: Scale, color: "text-green-500" },
  { value: "academic", label: "Academic Only", icon: FileCheck, color: "text-blue-500" },
  { value: "personal", label: "Personal Use", icon: Users, color: "text-purple-500" },
  { value: "open_source", label: "Open Source", icon: Shield, color: "text-amber-500" },
];

// Mock datasets
const mockDatasets = [
  {
    id: 1,
    title: "E-commerce Product Images",
    description: "50,000+ high-quality product images across 100 categories, perfect for training image classification models.",
    dataType: "images",
    price: 149.99,
    qualityScore: 95,
    completenessScore: 98,
    accuracyScore: 94,
    diversityScore: 88,
    rowCount: 50000,
    fileSize: 2500000000, // 2.5GB
    fileFormat: "ZIP (JPEG)",
    licenseType: "commercial",
    isLabeled: true,
    labelCategories: ["Electronics", "Clothing", "Home & Garden", "Sports", "Toys"],
    labelCount: 100,
    isVerifiedProvider: true,
    providerName: "DataCorp AI",
    downloadCount: 1240,
    version: "2.3.0",
    lastUpdated: "2025-01-15",
    previewImages: ["/placeholder1.jpg", "/placeholder2.jpg", "/placeholder3.jpg"],
    sampleData: null
  },
  {
    id: 2,
    title: "Customer Support Conversations",
    description: "200,000+ labeled customer support conversations for training chatbots and sentiment analysis models.",
    dataType: "text",
    price: 299.99,
    qualityScore: 92,
    completenessScore: 95,
    accuracyScore: 90,
    diversityScore: 85,
    rowCount: 200000,
    fileSize: 500000000, // 500MB
    fileFormat: "JSON",
    licenseType: "commercial",
    isLabeled: true,
    labelCategories: ["Positive", "Negative", "Neutral", "Escalation", "Resolution"],
    labelCount: 5,
    isVerifiedProvider: true,
    providerName: "NLP Solutions Inc",
    downloadCount: 890,
    version: "1.5.0",
    lastUpdated: "2025-01-10",
    previewImages: null,
    sampleData: [
      { conversation: "Hi, I need help with my order...", sentiment: "Neutral", category: "Order Inquiry" },
      { conversation: "Thank you so much! This was resolved quickly.", sentiment: "Positive", category: "Resolution" },
    ]
  },
  {
    id: 3,
    title: "Stock Market Time Series",
    description: "10 years of minute-by-minute stock data for 500+ companies, including OHLCV and technical indicators.",
    dataType: "time_series",
    price: 499.99,
    qualityScore: 98,
    completenessScore: 99,
    accuracyScore: 99,
    diversityScore: 92,
    rowCount: 1500000000,
    fileSize: 15000000000, // 15GB
    fileFormat: "Parquet",
    licenseType: "commercial",
    isLabeled: false,
    labelCategories: null,
    labelCount: 0,
    isVerifiedProvider: true,
    providerName: "FinData Pro",
    downloadCount: 2100,
    version: "3.0.0",
    lastUpdated: "2025-01-20",
    previewImages: null,
    sampleData: [
      { date: "2025-01-20 09:30", symbol: "AAPL", open: 185.50, high: 186.20, low: 185.10, close: 185.90, volume: 1250000 },
      { date: "2025-01-20 09:31", symbol: "AAPL", open: 185.90, high: 186.00, low: 185.70, close: 185.85, volume: 980000 },
    ]
  },
  {
    id: 4,
    title: "Speech Recognition Audio",
    description: "1,000+ hours of transcribed audio in multiple languages for speech-to-text model training.",
    dataType: "audio",
    price: 399.99,
    qualityScore: 88,
    completenessScore: 90,
    accuracyScore: 92,
    diversityScore: 85,
    rowCount: 100000,
    fileSize: 50000000000, // 50GB
    fileFormat: "WAV + JSON",
    licenseType: "academic",
    isLabeled: true,
    labelCategories: ["English", "Spanish", "French", "German", "Mandarin"],
    labelCount: 5,
    isVerifiedProvider: false,
    providerName: "AudioML Research",
    downloadCount: 450,
    version: "1.2.0",
    lastUpdated: "2025-01-05",
    previewImages: null,
    sampleData: null
  },
  {
    id: 5,
    title: "Medical Records (Synthetic)",
    description: "500,000 synthetic patient records for healthcare ML research, fully HIPAA-compliant synthetic data.",
    dataType: "tabular",
    price: 199.99,
    qualityScore: 90,
    completenessScore: 95,
    accuracyScore: 88,
    diversityScore: 82,
    rowCount: 500000,
    fileSize: 2000000000, // 2GB
    fileFormat: "CSV",
    licenseType: "academic",
    isLabeled: true,
    labelCategories: ["Diagnosis", "Treatment", "Outcome"],
    labelCount: 3,
    isVerifiedProvider: true,
    providerName: "HealthData Synthetic",
    downloadCount: 670,
    version: "2.0.0",
    lastUpdated: "2025-01-12",
    previewImages: null,
    sampleData: [
      { patient_id: "P001", age: 45, diagnosis: "Type 2 Diabetes", treatment: "Metformin", outcome: "Improved" },
      { patient_id: "P002", age: 62, diagnosis: "Hypertension", treatment: "Lisinopril", outcome: "Stable" },
    ]
  },
];

function formatFileSize(bytes: number): string {
  if (bytes >= 1000000000) return `${(bytes / 1000000000).toFixed(1)} GB`;
  if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
  return `${(bytes / 1000).toFixed(1)} KB`;
}

function formatRowCount(count: number): string {
  if (count >= 1000000000) return `${(count / 1000000000).toFixed(1)}B`;
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

function getQualityColor(score: number): string {
  if (score >= 90) return "text-green-500";
  if (score >= 70) return "text-amber-500";
  return "text-red-500";
}

function getQualityBg(score: number): string {
  if (score >= 90) return "bg-green-500";
  if (score >= 70) return "bg-amber-500";
  return "bg-red-500";
}

function DataTypeIcon({ type }: { type: string }) {
  const dataType = dataTypes.find(d => d.value === type);
  const Icon = dataType?.icon || Database;
  return <Icon className="w-5 h-5" />;
}

export default function DataMarketplace() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [dataType, setDataType] = useState("all");
  const [licenseType, setLicenseType] = useState("all");
  const [sortBy, setSortBy] = useState("quality");
  const [selectedDataset, setSelectedDataset] = useState<typeof mockDatasets[0] | null>(null);

  const filteredDatasets = mockDatasets.filter(dataset => {
    if (dataType !== "all" && dataset.dataType !== dataType) return false;
    if (licenseType !== "all" && dataset.licenseType !== licenseType) return false;
    if (search && !dataset.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handlePurchase = (dataset: typeof mockDatasets[0]) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to purchase datasets");
      return;
    }
    toast.success(`Added "${dataset.title}" to cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/marketplace">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">Data Marketplace</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-100">
            High-Quality Training Data
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            Premium Datasets for AI/ML
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Pre-labeled, quality-scored datasets ready for training your models. 
            Every dataset includes quality metrics, previews, and licensing information.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search datasets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={dataType} onValueChange={setDataType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Data Type" />
            </SelectTrigger>
            <SelectContent>
              {dataTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <type.icon className="w-4 h-4" />
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={licenseType} onValueChange={setLicenseType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="License" />
            </SelectTrigger>
            <SelectContent>
              {licenseTypes.map((license) => (
                <SelectItem key={license.value} value={license.value}>
                  {license.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quality">Highest Quality</SelectItem>
              <SelectItem value="downloads">Most Downloads</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dataset Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map((dataset) => (
            <Card key={dataset.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-600/10 flex items-center justify-center">
                      <DataTypeIcon type={dataset.dataType} />
                    </div>
                    <div>
                      <CardTitle className="text-lg line-clamp-1">{dataset.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {dataset.isVerifiedProvider && (
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            Verified
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {dataTypes.find(d => d.value === dataset.dataType)?.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="line-clamp-2 mt-2">
                  {dataset.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Quality Scores */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Overall Quality</span>
                    <span className={`font-bold ${getQualityColor(dataset.qualityScore)}`}>
                      {dataset.qualityScore}/100
                    </span>
                  </div>
                  <Progress value={dataset.qualityScore} className="h-2" />
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 rounded bg-muted/50">
                      <p className="text-muted-foreground">Completeness</p>
                      <p className={`font-bold ${getQualityColor(dataset.completenessScore)}`}>
                        {dataset.completenessScore}%
                      </p>
                    </div>
                    <div className="text-center p-2 rounded bg-muted/50">
                      <p className="text-muted-foreground">Accuracy</p>
                      <p className={`font-bold ${getQualityColor(dataset.accuracyScore)}`}>
                        {dataset.accuracyScore}%
                      </p>
                    </div>
                    <div className="text-center p-2 rounded bg-muted/50">
                      <p className="text-muted-foreground">Diversity</p>
                      <p className={`font-bold ${getQualityColor(dataset.diversityScore)}`}>
                        {dataset.diversityScore}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dataset Info */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Table2 className="w-4 h-4 text-muted-foreground" />
                    <span>{formatRowCount(dataset.rowCount)} rows</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    <span>{formatFileSize(dataset.fileSize)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-muted-foreground" />
                    <span>{dataset.downloadCount} downloads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>v{dataset.version}</span>
                  </div>
                </div>

                {/* Labels & License */}
                <div className="flex flex-wrap gap-2">
                  {dataset.isLabeled && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Pre-labeled ({dataset.labelCount} categories)
                    </Badge>
                  )}
                  <Badge variant="outline">
                    {licenseTypes.find(l => l.value === dataset.licenseType)?.label}
                  </Badge>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t pt-4">
                <div>
                  <span className="text-2xl font-bold">${dataset.price}</span>
                  <p className="text-xs text-muted-foreground">One-time purchase</p>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedDataset(dataset)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{dataset.title}</DialogTitle>
                        <DialogDescription>{dataset.description}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Quality breakdown */}
                        <div>
                          <h4 className="font-medium mb-2">Quality Metrics</h4>
                          <div className="grid grid-cols-4 gap-4">
                            <div className="text-center p-3 rounded-lg border">
                              <p className={`text-2xl font-bold ${getQualityColor(dataset.qualityScore)}`}>
                                {dataset.qualityScore}
                              </p>
                              <p className="text-xs text-muted-foreground">Overall</p>
                            </div>
                            <div className="text-center p-3 rounded-lg border">
                              <p className={`text-2xl font-bold ${getQualityColor(dataset.completenessScore)}`}>
                                {dataset.completenessScore}
                              </p>
                              <p className="text-xs text-muted-foreground">Complete</p>
                            </div>
                            <div className="text-center p-3 rounded-lg border">
                              <p className={`text-2xl font-bold ${getQualityColor(dataset.accuracyScore)}`}>
                                {dataset.accuracyScore}
                              </p>
                              <p className="text-xs text-muted-foreground">Accurate</p>
                            </div>
                            <div className="text-center p-3 rounded-lg border">
                              <p className={`text-2xl font-bold ${getQualityColor(dataset.diversityScore)}`}>
                                {dataset.diversityScore}
                              </p>
                              <p className="text-xs text-muted-foreground">Diverse</p>
                            </div>
                          </div>
                        </div>

                        {/* Sample data preview */}
                        {dataset.sampleData && (
                          <div>
                            <h4 className="font-medium mb-2">Sample Data</h4>
                            <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
                              <pre className="text-xs">
                                {JSON.stringify(dataset.sampleData, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}

                        {/* Label categories */}
                        {dataset.isLabeled && dataset.labelCategories && (
                          <div>
                            <h4 className="font-medium mb-2">Label Categories</h4>
                            <div className="flex flex-wrap gap-2">
                              {dataset.labelCategories.map((label, i) => (
                                <Badge key={i} variant="secondary">{label}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* License info */}
                        <div>
                          <h4 className="font-medium mb-2">License Information</h4>
                          <div className="p-3 rounded-lg border">
                            <div className="flex items-center gap-2">
                              <Scale className="w-5 h-5 text-amber-500" />
                              <span className="font-medium">
                                {licenseTypes.find(l => l.value === dataset.licenseType)?.label}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {dataset.licenseType === "commercial" && "You can use this dataset for commercial products and services."}
                              {dataset.licenseType === "academic" && "This dataset is restricted to academic and research purposes only."}
                              {dataset.licenseType === "personal" && "This dataset is for personal, non-commercial use only."}
                              {dataset.licenseType === "open_source" && "This dataset is open source and can be freely used and modified."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                    onClick={() => handlePurchase(dataset)}
                  >
                    Purchase
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredDatasets.length === 0 && (
          <div className="text-center py-16">
            <Database className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">No datasets found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </div>
        )}
      </main>
    </div>
  );
}
