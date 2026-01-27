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
  ExternalLink,
  ShoppingCart,
  Users
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

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

// Analytics chart data
const revenueData = [
  { month: "Jan", revenue: 1200, sales: 24 },
  { month: "Feb", revenue: 1800, sales: 32 },
  { month: "Mar", revenue: 2400, sales: 45 },
  { month: "Apr", revenue: 2100, sales: 38 },
  { month: "May", revenue: 3200, sales: 56 },
  { month: "Jun", revenue: 3800, sales: 67 },
];

const viewsData = [
  { day: "Mon", views: 120, clicks: 45 },
  { day: "Tue", views: 180, clicks: 62 },
  { day: "Wed", views: 240, clicks: 89 },
  { day: "Thu", views: 210, clicks: 74 },
  { day: "Fri", views: 320, clicks: 112 },
  { day: "Sat", views: 280, clicks: 98 },
  { day: "Sun", views: 190, clicks: 67 },
];

const categoryData = [
  { name: "Functions", value: 45, color: "#3b82f6" },
  { name: "Templates", value: 25, color: "#8b5cf6" },
  { name: "Applications", value: 20, color: "#22c55e" },
  { name: "Datasets", value: 10, color: "#f59e0b" },
];

const topListings = [
  { name: "Data Validation Library", sales: 89, revenue: 1245, trend: 12 },
  { name: "Image Resize & Optimize", sales: 67, revenue: 987, trend: 8 },
  { name: "CSV Parser & Exporter", sales: 54, revenue: 756, trend: -3 },
  { name: "SaaS Dashboard Starter", sales: 43, revenue: 645, trend: 15 },
  { name: "Task Manager Bot", sales: 38, revenue: 532, trend: 5 },
];

const trafficSources = [
  { source: "Direct", visitors: 1234, percentage: 35 },
  { source: "Search", visitors: 987, percentage: 28 },
  { source: "Referral", visitors: 654, percentage: 19 },
  { source: "Social", visitors: 432, percentage: 12 },
  { source: "Affiliate", visitors: 210, percentage: 6 },
];

// Analytics data
const analyticsData = {
  totalRevenue: 12450,
  revenueChange: 23.5,
  totalSales: 234,
  salesChange: 18.2,
  totalViews: 15678,
  viewsChange: -5.3,
  avgConversion: 3.2,
  conversionChange: 0.8,
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
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

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
            <p className="text-muted-foreground">Manage all your projects, listings, purchases, and analytics</p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
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

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total Revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">${analyticsData.totalRevenue.toLocaleString()}</p>
                  <div className={`flex items-center text-sm ${analyticsData.revenueChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {analyticsData.revenueChange >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {Math.abs(analyticsData.revenueChange)}%
                  </div>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Total Sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">{analyticsData.totalSales}</p>
                  <div className={`flex items-center text-sm ${analyticsData.salesChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {analyticsData.salesChange >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {Math.abs(analyticsData.salesChange)}%
                  </div>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Total Views
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">{analyticsData.totalViews.toLocaleString()}</p>
                  <div className={`flex items-center text-sm ${analyticsData.viewsChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {analyticsData.viewsChange >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {Math.abs(analyticsData.viewsChange)}%
                  </div>
                </div>
                <Eye className="w-8 h-8 text-purple-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Conversion Rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">{analyticsData.avgConversion}%</p>
                  <div className={`flex items-center text-sm ${analyticsData.conversionChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {analyticsData.conversionChange >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {Math.abs(analyticsData.conversionChange)}%
                  </div>
                </div>
                <BarChart3 className="w-8 h-8 text-amber-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
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
            <TabsTrigger value="top" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Top Performers
            </TabsTrigger>
          </TabsList>

          {/* Analytics Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue & Sales Over Time</CardTitle>
                  <CardDescription>Monthly revenue and sales performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#f59e0b" 
                          fillOpacity={1} 
                          fill="url(#colorRevenue)" 
                          name="Revenue ($)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="sales" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          name="Sales"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Traffic Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Views & Clicks</CardTitle>
                  <CardDescription>Weekly traffic performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={viewsData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="day" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Legend />
                        <Bar dataKey="views" fill="#8b5cf6" name="Views" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="clicks" fill="#22c55e" name="Clicks" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category & Traffic Sources Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Distribution of sales across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Traffic Sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>Where your visitors come from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trafficSources.map((source, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-20 text-sm font-medium">{source.source}</div>
                        <div className="flex-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                              style={{ width: `${source.percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="w-16 text-sm text-right">
                          {source.visitors.toLocaleString()}
                        </div>
                        <div className="w-10 text-sm text-muted-foreground text-right">
                          {source.percentage}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Listings Tab */}
          <TabsContent value="uploaded">
            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search listings..."
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
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                        {project.category === "dataset" && (
                          <Link href="/ai-builder">
                            <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                              <Brain className="w-4 h-4 mr-2" />
                              Use in AI Builder
                            </Button>
                          </Link>
                        )}
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
                            <p className="text-xs text-muted-foreground mt-1 text-center">
                              {project.progress}% complete
                            </p>
                          </div>
                        )}
                        <Link href={`/ai-builder/${project.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                        {project.status === "completed" && !project.isPublished && (
                          <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                            Publish to Marketplace
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Top Performers Tab */}
          <TabsContent value="top">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Listings</CardTitle>
                <CardDescription>Your best selling items this period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topListings.map((listing, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{listing.name}</p>
                        <p className="text-sm text-muted-foreground">{listing.sales} sales</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${listing.revenue}</p>
                        <div className={`flex items-center justify-end text-sm ${listing.trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {listing.trend >= 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {Math.abs(listing.trend)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Version History Dialog */}
        <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Version History</DialogTitle>
              <DialogDescription>
                {selectedProject?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {selectedProject?.versions?.map((version: any, i: number) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-lg border">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">v{version.version}</span>
                      {i === 0 && <Badge>Latest</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{version.changes}</p>
                    <p className="text-xs text-muted-foreground mt-1">{version.date}</p>
                  </div>
                  {i !== 0 && (
                    <Button variant="ghost" size="sm">
                      Restore
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowVersionHistory(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
