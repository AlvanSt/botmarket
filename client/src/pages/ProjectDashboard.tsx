import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { toast } from "sonner";
import { 
  Search, 
  Filter, 
  Package, 
  ShoppingBag, 
  Upload, 
  Brain,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Download,
  Star,
  Clock,
  MoreVertical,
  History,
  GitBranch,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Trash2,
  Copy,
  ExternalLink
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock project data
const mockProjects = {
  uploaded: [
    {
      id: 1,
      title: "Data Validation Library",
      type: "listing",
      category: "function",
      status: "approved",
      price: 29.99,
      sales: 145,
      revenue: 4348.55,
      views: 3420,
      downloads: 145,
      rating: 4.8,
      reviewCount: 42,
      conversionRate: 4.2,
      lastUpdated: "2025-01-20",
      version: "2.1.0",
      versions: [
        { version: "2.1.0", date: "2025-01-20", changes: "Added TypeScript support" },
        { version: "2.0.0", date: "2025-01-05", changes: "Major refactor, new API" },
        { version: "1.5.0", date: "2024-12-15", changes: "Performance improvements" },
      ]
    },
    {
      id: 2,
      title: "CSV Parser & Exporter",
      type: "listing",
      category: "function",
      status: "approved",
      price: 19.99,
      sales: 89,
      revenue: 1779.11,
      views: 2100,
      downloads: 89,
      rating: 4.5,
      reviewCount: 28,
      conversionRate: 4.2,
      lastUpdated: "2025-01-18",
      version: "1.3.0",
      versions: [
        { version: "1.3.0", date: "2025-01-18", changes: "Added Excel export" },
        { version: "1.2.0", date: "2025-01-02", changes: "Bug fixes" },
      ]
    },
  ],
  purchased: [
    {
      id: 3,
      title: "E-commerce Store Template",
      type: "purchase",
      category: "template",
      purchaseDate: "2025-01-15",
      price: 79.99,
      seller: "TemplateHub",
      downloadCount: 3,
      lastDownload: "2025-01-16",
    },
    {
      id: 4,
      title: "Product Images Dataset",
      type: "purchase",
      category: "dataset",
      purchaseDate: "2025-01-10",
      price: 149.99,
      seller: "DataCorp AI",
      downloadCount: 1,
      lastDownload: "2025-01-10",
    },
  ],
  aiProjects: [
    {
      id: 5,
      title: "Product Classifier v2",
      type: "ai_project",
      modelType: "image_classification",
      status: "completed",
      accuracy: 94.5,
      trainingDate: "2025-01-12",
      datasetSize: 5000,
      isPublished: true,
      publishedListingId: 10,
    },
    {
      id: 6,
      title: "Sentiment Analyzer",
      type: "ai_project",
      modelType: "text_classification",
      status: "training",
      progress: 65,
      trainingDate: "2025-01-22",
      datasetSize: 10000,
      isPublished: false,
    },
  ]
};

// Analytics data
const analyticsData = {
  totalRevenue: 6127.66,
  revenueChange: 12.5,
  totalSales: 234,
  salesChange: 8.3,
  totalViews: 5520,
  viewsChange: -2.1,
  avgConversion: 4.2,
  conversionChange: 0.5,
  topPerformer: "Data Validation Library",
  recentTrend: "up",
};

function getStatusColor(status: string) {
  switch (status) {
    case "approved": return "bg-green-100 text-green-800";
    case "pending": return "bg-amber-100 text-amber-800";
    case "rejected": return "bg-red-100 text-red-800";
    case "draft": return "bg-gray-100 text-gray-800";
    case "completed": return "bg-green-100 text-green-800";
    case "training": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "function": return "💻";
    case "template": return "📄";
    case "application": return "📱";
    case "dataset": return "📊";
    case "image_classification": return "🖼️";
    case "text_classification": return "📝";
    default: return "📦";
  }
}

export default function ProjectDashboard() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const handleBulkAction = (action: string) => {
    toast.info(`Bulk ${action} coming soon!`);
  };

  const handleSchedulePublish = () => {
    toast.success("Publish scheduled successfully!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Project Dashboard</h1>
            <p className="text-muted-foreground">Manage all your projects, listings, and purchases</p>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Bulk Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleBulkAction("update prices")}>
                  Update Prices
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("schedule publish")}>
                  Schedule Publish
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("export data")}>
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={() => handleBulkAction("archive")}>
                  Archive Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/my-listings/new">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                <Upload className="w-4 h-4 mr-2" />
                New Listing
              </Button>
            </Link>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">${analyticsData.totalRevenue.toLocaleString()}</span>
                <div className={`flex items-center text-sm ${analyticsData.revenueChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {analyticsData.revenueChange >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(analyticsData.revenueChange)}%
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{analyticsData.totalSales}</span>
                <div className={`flex items-center text-sm ${analyticsData.salesChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {analyticsData.salesChange >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(analyticsData.salesChange)}%
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Views</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{analyticsData.totalViews.toLocaleString()}</span>
                <div className={`flex items-center text-sm ${analyticsData.viewsChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {analyticsData.viewsChange >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(analyticsData.viewsChange)}%
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg. Conversion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{analyticsData.avgConversion}%</span>
                <div className={`flex items-center text-sm ${analyticsData.conversionChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {analyticsData.conversionChange >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(analyticsData.conversionChange)}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="uploaded">My Listings</SelectItem>
              <SelectItem value="purchased">Purchased</SelectItem>
              <SelectItem value="ai_projects">AI Projects</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Project Tabs */}
        <Tabs defaultValue="uploaded" className="space-y-4">
          <TabsList>
            <TabsTrigger value="uploaded" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              My Listings ({mockProjects.uploaded.length})
            </TabsTrigger>
            <TabsTrigger value="purchased" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Purchased ({mockProjects.purchased.length})
            </TabsTrigger>
            <TabsTrigger value="ai_projects" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Projects ({mockProjects.aiProjects.length})
            </TabsTrigger>
          </TabsList>

          {/* My Listings Tab */}
          <TabsContent value="uploaded">
            <div className="space-y-4">
              {mockProjects.uploaded.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{getCategoryIcon(project.category)}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{project.title}</h3>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              ${project.price}
                            </span>
                            <span className="flex items-center gap-1">
                              <GitBranch className="w-4 h-4" />
                              v{project.version}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Updated {project.lastUpdated}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div>
                            <p className="text-lg font-bold">{project.sales}</p>
                            <p className="text-xs text-muted-foreground">Sales</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-green-600">${project.revenue.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Revenue</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold">{project.views.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Views</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold flex items-center justify-center gap-1">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              {project.rating}
                            </p>
                            <p className="text-xs text-muted-foreground">{project.reviewCount} reviews</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit Listing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedProject(project);
                              setShowVersionHistory(true);
                            }}>
                              <History className="w-4 h-4 mr-2" />
                              Version History
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="w-4 h-4 mr-2" />
                              View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Public Page
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Purchased Tab */}
          <TabsContent value="purchased">
            <div className="space-y-4">
              {mockProjects.purchased.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{getCategoryIcon(project.category)}</div>
                        <div>
                          <h3 className="font-semibold text-lg">{project.title}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>by {project.seller}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Purchased {project.purchaseDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="w-4 h-4" />
                              {project.downloadCount} downloads
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-bold">${project.price}</span>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Projects Tab */}
          <TabsContent value="ai_projects">
            <div className="space-y-4">
              {mockProjects.aiProjects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{getCategoryIcon(project.modelType)}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{project.title}</h3>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                            {project.isPublished && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Published
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>{project.modelType.replace("_", " ")}</span>
                            <span>{project.datasetSize.toLocaleString()} samples</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {project.trainingDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {project.status === "completed" ? (
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{project.accuracy}%</p>
                            <p className="text-xs text-muted-foreground">Accuracy</p>
                          </div>
                        ) : (
                          <div className="w-32">
                            <Progress value={project.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1 text-center">{project.progress}% complete</p>
                          </div>
                        )}
                        <Link href={`/ai-builder/${project.id}`}>
                          <Button variant="outline" size="sm">
                            View Project
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Version History Dialog */}
        <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Version History</DialogTitle>
              <DialogDescription>
                {selectedProject?.title} - All versions and changes
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {selectedProject?.versions?.map((version: any, i: number) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-lg border">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <GitBranch className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">v{version.version}</span>
                      <span className="text-sm text-muted-foreground">{version.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{version.changes}</p>
                  </div>
                  {i === 0 && (
                    <Badge className="bg-green-100 text-green-800">Current</Badge>
                  )}
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowVersionHistory(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
