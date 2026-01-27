import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Package, 
  ShoppingCart,
  DollarSign,
  Star,
  LogOut
} from "lucide-react";

export default function Profile() {
  const { user, logout, isAuthenticated } = useAuth();
  const { data: stats } = trpc.user.getStats.useQuery(undefined, { enabled: isAuthenticated });

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  if (!isAuthenticated || !user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Not Signed In</CardTitle>
              <CardDescription>
                Please sign in to view your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button className="w-full">Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profile</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{user.name || "User"}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role === 'admin' ? (
                      <>
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                      </>
                    ) : (
                      'Member'
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
            <CardDescription>Your marketplace activity at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <Package className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats?.totalListings || 0}</p>
                <p className="text-sm text-muted-foreground">Listings</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <ShoppingCart className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats?.totalSales || 0}</p>
                <p className="text-sm text-muted-foreground">Sales</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <DollarSign className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">${(stats?.totalEarnings || 0).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Earnings</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <Star className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{(stats as any)?.avgRating?.toFixed(1) || "N/A"}</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/my-listings">
              <Button variant="ghost" className="w-full justify-start">
                <Package className="w-4 h-4 mr-2" />
                My Listings
              </Button>
            </Link>
            <Link href="/my-purchases">
              <Button variant="ghost" className="w-full justify-start">
                <ShoppingCart className="w-4 h-4 mr-2" />
                My Purchases
              </Button>
            </Link>
            <Link href="/ai-builder">
              <Button variant="ghost" className="w-full justify-start">
                <Star className="w-4 h-4 mr-2" />
                AI Builder
              </Button>
            </Link>
            {user.role === 'admin' && (
              <Link href="/admin">
                <Button variant="ghost" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
