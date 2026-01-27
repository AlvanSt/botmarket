import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Users, 
  Plus, 
  Settings, 
  Crown, 
  Shield, 
  Edit3, 
  Eye,
  UserPlus,
  MoreVertical,
  Activity,
  DollarSign,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Role configuration
const roles = [
  { 
    value: "owner", 
    label: "Owner", 
    icon: Crown, 
    color: "text-amber-500",
    description: "Full control over team and all resources"
  },
  { 
    value: "admin", 
    label: "Admin", 
    icon: Shield, 
    color: "text-blue-500",
    description: "Manage members, approve listings, view analytics"
  },
  { 
    value: "editor", 
    label: "Editor", 
    icon: Edit3, 
    color: "text-green-500",
    description: "Create and edit listings, manage projects"
  },
  { 
    value: "viewer", 
    label: "Viewer", 
    icon: Eye, 
    color: "text-gray-500",
    description: "View-only access to team resources"
  },
];

// Mock team data
const mockTeams = [
  {
    id: 1,
    name: "AI Solutions Team",
    slug: "ai-solutions",
    description: "Building cutting-edge AI tools and datasets",
    memberCount: 5,
    projectCount: 12,
    totalRevenue: 15420.50,
    members: [
      { id: 1, name: "John Doe", email: "john@example.com", role: "owner", revenueSplit: 40 },
      { id: 2, name: "Jane Smith", email: "jane@example.com", role: "admin", revenueSplit: 25 },
      { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "editor", revenueSplit: 20 },
      { id: 4, name: "Alice Brown", email: "alice@example.com", role: "editor", revenueSplit: 10 },
      { id: 5, name: "Charlie Davis", email: "charlie@example.com", role: "viewer", revenueSplit: 5 },
    ],
    activity: [
      { id: 1, user: "Jane Smith", action: "published listing", target: "Data Validation Library", time: "2 hours ago" },
      { id: 2, user: "Bob Wilson", action: "updated project", target: "Image Classifier v2", time: "5 hours ago" },
      { id: 3, user: "Alice Brown", action: "created listing", target: "CSV Parser Pro", time: "1 day ago" },
    ],
    pendingApprovals: [
      { id: 1, title: "New ML Pipeline Template", requestedBy: "Bob Wilson", status: "pending" },
    ]
  }
];

function getRoleIcon(role: string) {
  const roleConfig = roles.find(r => r.value === role);
  return roleConfig?.icon || Eye;
}

function getRoleColor(role: string) {
  const roleConfig = roles.find(r => r.value === role);
  return roleConfig?.color || "text-gray-500";
}

export default function Teams() {
  const { user } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState(mockTeams[0]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }
    toast.success(`Team "${newTeamName}" created successfully!`);
    setShowCreateDialog(false);
    setNewTeamName("");
    setNewTeamDescription("");
  };

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    toast.success(`Invitation sent to ${inviteEmail}`);
    setShowInviteDialog(false);
    setInviteEmail("");
    setInviteRole("editor");
  };

  const handleApproval = (approvalId: number, action: "approve" | "reject") => {
    toast.success(`Listing ${action === "approve" ? "approved" : "rejected"}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Team Management</h1>
            <p className="text-muted-foreground">Collaborate with your team and manage permissions</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
                <DialogDescription>
                  Create a team to collaborate with others on projects and listings.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input
                    id="team-name"
                    placeholder="e.g., AI Solutions Team"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-description">Description</Label>
                  <Textarea
                    id="team-description"
                    placeholder="What does your team work on?"
                    value={newTeamDescription}
                    onChange={(e) => setNewTeamDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                <Button onClick={handleCreateTeam}>Create Team</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Team Overview */}
        {selectedTeam && (
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-2xl font-bold">{selectedTeam.memberCount}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-500" />
                  <span className="text-2xl font-bold">{selectedTeam.projectCount}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span className="text-2xl font-bold">${selectedTeam.totalRevenue.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pending Approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <span className="text-2xl font-bold">{selectedTeam.pendingApprovals.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="members" className="space-y-4">
          <TabsList>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Split</TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage your team members and their roles</CardDescription>
                </div>
                <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Invite Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite Team Member</DialogTitle>
                      <DialogDescription>
                        Send an invitation to join your team.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="invite-email">Email Address</Label>
                        <Input
                          id="invite-email"
                          type="email"
                          placeholder="colleague@example.com"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="invite-role">Role</Label>
                        <Select value={inviteRole} onValueChange={setInviteRole}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.filter(r => r.value !== "owner").map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                <div className="flex items-center gap-2">
                                  <role.icon className={`w-4 h-4 ${role.color}`} />
                                  {role.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          {roles.find(r => r.value === inviteRole)?.description}
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowInviteDialog(false)}>Cancel</Button>
                      <Button onClick={handleInviteMember}>Send Invitation</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedTeam?.members.map((member) => {
                    const RoleIcon = getRoleIcon(member.role);
                    return (
                      <div key={member.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <RoleIcon className={`w-3 h-3 ${getRoleColor(member.role)}`} />
                            {roles.find(r => r.value === member.role)?.label}
                          </Badge>
                          <Badge variant="secondary">
                            {member.revenueSplit}% split
                          </Badge>
                          {member.role !== "owner" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Change Role</DropdownMenuItem>
                                <DropdownMenuItem>Edit Revenue Split</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Remove from Team</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Role Permissions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
                <CardDescription>Understanding what each role can do</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {roles.map((role) => (
                    <div key={role.value} className="p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <role.icon className={`w-5 h-5 ${role.color}`} />
                        <span className="font-medium">{role.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Team Activity Feed</CardTitle>
                <CardDescription>Recent actions by team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedTeam?.activity.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg border">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p>
                          <span className="font-medium">{item.user}</span>
                          {" "}{item.action}{" "}
                          <span className="font-medium">{item.target}</span>
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Listings waiting for approval before publishing</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedTeam?.pendingApprovals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No pending approvals</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedTeam?.pendingApprovals.map((approval) => (
                      <div key={approval.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <p className="font-medium">{approval.title}</p>
                          <p className="text-sm text-muted-foreground">Requested by {approval.requestedBy}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleApproval(approval.id, "reject")}
                          >
                            <XCircle className="w-4 h-4 mr-1 text-red-500" />
                            Reject
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleApproval(approval.id, "approve")}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Split Tab */}
          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
                <CardDescription>How revenue is split among team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Visual distribution */}
                  <div className="h-8 rounded-full overflow-hidden flex">
                    {selectedTeam?.members.map((member, i) => {
                      const colors = ["bg-amber-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500"];
                      return (
                        <div 
                          key={member.id}
                          className={`${colors[i % colors.length]} h-full`}
                          style={{ width: `${member.revenueSplit}%` }}
                          title={`${member.name}: ${member.revenueSplit}%`}
                        />
                      );
                    })}
                  </div>
                  
                  {/* Legend */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedTeam?.members.map((member, i) => {
                      const colors = ["bg-amber-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500"];
                      const earnings = (selectedTeam.totalRevenue * member.revenueSplit / 100);
                      return (
                        <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg border">
                          <div className={`w-4 h-4 rounded ${colors[i % colors.length]}`} />
                          <div className="flex-1">
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.revenueSplit}%</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">${earnings.toFixed(2)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
