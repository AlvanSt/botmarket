import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";
import { 
  Sparkles, 
  ArrowLeft,
  Users,
  MessageSquare,
  Trophy,
  BookOpen,
  Star,
  Search,
  TrendingUp,
  Award,
  Code2,
  Brain,
  CheckCircle,
  ExternalLink,
  Heart,
  Eye
} from "lucide-react";

// Mock data for developers
const featuredDevelopers = [
  {
    id: 1,
    name: "Alex Chen",
    username: "alexchen",
    avatar: "AC",
    title: "ML Engineer",
    bio: "Building AI solutions for e-commerce",
    skills: ["Python", "TensorFlow", "Computer Vision"],
    listings: 12,
    sales: 234,
    rating: 4.9,
    verified: true,
  },
  {
    id: 2,
    name: "Sarah Miller",
    username: "sarahm",
    avatar: "SM",
    title: "Full Stack Developer",
    bio: "Creating beautiful web applications",
    skills: ["React", "Node.js", "TypeScript"],
    listings: 8,
    sales: 156,
    rating: 4.8,
    verified: true,
  },
  {
    id: 3,
    name: "David Park",
    username: "dpark",
    avatar: "DP",
    title: "Data Scientist",
    bio: "Turning data into insights",
    skills: ["Python", "SQL", "Machine Learning"],
    listings: 15,
    sales: 312,
    rating: 4.9,
    verified: true,
  },
];

// Mock forum topics
const forumTopics = [
  {
    id: 1,
    title: "Best practices for training image classification models",
    category: "AI Builder",
    author: "alexchen",
    replies: 24,
    views: 456,
    lastActivity: "2 hours ago",
    pinned: true,
  },
  {
    id: 2,
    title: "How to optimize your marketplace listings for better visibility",
    category: "Marketplace Tips",
    author: "sarahm",
    replies: 18,
    views: 234,
    lastActivity: "5 hours ago",
    pinned: false,
  },
  {
    id: 3,
    title: "Integrating Swarm APIs with your existing workflow",
    category: "Technical",
    author: "dpark",
    replies: 31,
    views: 567,
    lastActivity: "1 day ago",
    pinned: false,
  },
  {
    id: 4,
    title: "Share your success story: How I made my first $1000",
    category: "Success Stories",
    author: "newcreator",
    replies: 42,
    views: 890,
    lastActivity: "2 days ago",
    pinned: false,
  },
];

// Mock challenges
const challenges = [
  {
    id: 1,
    title: "Image Classification Challenge",
    description: "Build the most accurate product categorization model",
    prize: "$5,000",
    participants: 156,
    deadline: "Feb 15, 2026",
    status: "active",
  },
  {
    id: 2,
    title: "Best Template Design",
    description: "Create the most useful SaaS starter template",
    prize: "$2,500",
    participants: 89,
    deadline: "Mar 1, 2026",
    status: "active",
  },
];

// Mock tutorials
const tutorials = [
  {
    id: 1,
    title: "Getting Started with No-Code AI Builder",
    author: "Swarm Team",
    duration: "15 min",
    level: "Beginner",
    likes: 234,
  },
  {
    id: 2,
    title: "Creating Your First Marketplace Listing",
    author: "alexchen",
    duration: "10 min",
    level: "Beginner",
    likes: 189,
  },
  {
    id: 3,
    title: "Advanced Model Training Techniques",
    author: "dpark",
    duration: "30 min",
    level: "Advanced",
    likes: 156,
  },
];

export default function Community() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

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
              <span className="font-bold text-xl">Swarm Community</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/marketplace">
              <Button variant="outline" size="sm">Marketplace</Button>
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard">
                <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Users className="w-3 h-3 mr-1" />
            Community
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            Connect, Learn & Grow Together
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of creators, developers, and AI enthusiasts building the future.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search developers, topics, tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="developers" className="space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
            <TabsTrigger value="developers">
              <Users className="w-4 h-4 mr-2" />
              Developers
            </TabsTrigger>
            <TabsTrigger value="forums">
              <MessageSquare className="w-4 h-4 mr-2" />
              Forums
            </TabsTrigger>
            <TabsTrigger value="challenges">
              <Trophy className="w-4 h-4 mr-2" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="learn">
              <BookOpen className="w-4 h-4 mr-2" />
              Learn
            </TabsTrigger>
          </TabsList>

          {/* Developers Tab */}
          <TabsContent value="developers">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-600" />
                  Featured Developers
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {featuredDevelopers.map((dev) => (
                    <Card key={dev.id} className="card-hover">
                      <CardHeader className="text-center">
                        <Avatar className="w-20 h-20 mx-auto mb-4">
                          <AvatarFallback className="text-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                            {dev.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center justify-center gap-2">
                          <CardTitle>{dev.name}</CardTitle>
                          {dev.verified && (
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <CardDescription>@{dev.username}</CardDescription>
                        <p className="text-sm">{dev.title}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground text-center mb-4">
                          {dev.bio}
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                          {dev.skills.map((skill, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <div>
                            <p className="font-bold">{dev.listings}</p>
                            <p className="text-muted-foreground text-xs">Listings</p>
                          </div>
                          <div>
                            <p className="font-bold">{dev.sales}</p>
                            <p className="text-muted-foreground text-xs">Sales</p>
                          </div>
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{dev.rating}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          View Profile
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Forums Tab */}
          <TabsContent value="forums">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Discussion Forums</h2>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                  New Topic
                </Button>
              </div>
              <div className="space-y-4">
                {forumTopics.map((topic) => (
                  <Card key={topic.id} className="card-hover cursor-pointer">
                    <CardContent className="py-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {topic.pinned && (
                              <Badge variant="secondary" className="text-xs">
                                Pinned
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {topic.category}
                            </Badge>
                          </div>
                          <h3 className="font-semibold hover:text-amber-600 transition-colors">
                            {topic.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>by @{topic.author}</span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {topic.replies}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {topic.views}
                            </span>
                            <span>{topic.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-600" />
                  Active Challenges
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {challenges.map((challenge) => (
                  <Card key={challenge.id} className="overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-600" />
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{challenge.title}</CardTitle>
                          <CardDescription>{challenge.description}</CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-amber-600">{challenge.prize}</p>
                          <p className="text-xs text-muted-foreground">Prize Pool</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{challenge.participants}</p>
                          <p className="text-xs text-muted-foreground">Participants</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{challenge.deadline}</p>
                          <p className="text-xs text-muted-foreground">Deadline</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                        Join Challenge
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Learn Tab */}
          <TabsContent value="learn">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-amber-600" />
                Tutorials & Guides
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {tutorials.map((tutorial) => (
                  <Card key={tutorial.id} className="card-hover cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{tutorial.level}</Badge>
                        <span className="text-sm text-muted-foreground">{tutorial.duration}</span>
                      </div>
                      <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                      <CardDescription>by {tutorial.author}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Heart className="w-4 h-4" />
                        {tutorial.likes}
                      </div>
                      <Button variant="ghost" size="sm">
                        Read
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
