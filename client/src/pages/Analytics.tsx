import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Eye,
  Download,
  ShoppingCart,
  Users,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from "lucide-react";
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

// Mock data for charts
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

export default function Analytics() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("30d");

  // Mock stats
  const stats = {
    totalRevenue: 12450,
    revenueChange: 23.5,
    totalSales: 234,
    salesChange: 18.2,
    totalViews: 15678,
    viewsChange: -5.3,
    conversionRate: 3.2,
    conversionChange: 0.8,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track your performance and growth</p>
          </div>
          <div className="flex items-center gap-3">
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
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
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
                  <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                  <div className={`flex items-center text-sm ${stats.revenueChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stats.revenueChange >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {Math.abs(stats.revenueChange)}%
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
                  <p className="text-2xl font-bold">{stats.totalSales}</p>
                  <div className={`flex items-center text-sm ${stats.salesChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stats.salesChange >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {Math.abs(stats.salesChange)}%
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
                  <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                  <div className={`flex items-center text-sm ${stats.viewsChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stats.viewsChange >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {Math.abs(stats.viewsChange)}%
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
                  <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                  <div className={`flex items-center text-sm ${stats.conversionChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stats.conversionChange >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {Math.abs(stats.conversionChange)}%
                  </div>
                </div>
                <BarChart3 className="w-8 h-8 text-amber-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Sales Over Time</CardTitle>
                <CardDescription>Monthly revenue and sales performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
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
          </TabsContent>

          <TabsContent value="traffic">
            <Card>
              <CardHeader>
                <CardTitle>Views & Clicks</CardTitle>
                <CardDescription>Weekly traffic performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
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
          </TabsContent>

          <TabsContent value="categories">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Distribution of sales across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
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

              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>Where your visitors come from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trafficSources.map((source, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium">{source.source}</div>
                        <div className="flex-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                              style={{ width: `${source.percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="w-20 text-sm text-right">
                          {source.visitors.toLocaleString()}
                        </div>
                        <div className="w-12 text-sm text-muted-foreground text-right">
                          {source.percentage}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Top Performing Listings */}
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
      </div>
    </DashboardLayout>
  );
}
