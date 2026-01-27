import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "wouter";
import { toast } from "sonner";
import { 
  Sparkles, 
  ArrowLeft,
  Crown,
  FileText,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Send,
  Briefcase,
  Cpu,
  Database,
  Cog
} from "lucide-react";

const projectTypes = [
  { value: "ai-model", label: "Custom AI Model", icon: Cpu, description: "Specialized ML models for your use case" },
  { value: "data-pipeline", label: "Data Pipeline", icon: Database, description: "ETL and data processing solutions" },
  { value: "integration", label: "System Integration", icon: Cog, description: "Connect with existing systems" },
  { value: "application", label: "Full Application", icon: Briefcase, description: "Complete end-to-end solution" },
];

const budgetRanges = [
  { value: "1000-5000", label: "$1,000 - $5,000" },
  { value: "5000-10000", label: "$5,000 - $10,000" },
  { value: "10000-25000", label: "$10,000 - $25,000" },
  { value: "25000-50000", label: "$25,000 - $50,000" },
  { value: "50000+", label: "$50,000+" },
];

const timelines = [
  { value: "2-weeks", label: "2 weeks" },
  { value: "1-month", label: "1 month" },
  { value: "2-months", label: "2 months" },
  { value: "3-months", label: "3 months" },
  { value: "6-months", label: "6+ months" },
];

export default function CustomProject() {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    projectType: "",
    title: "",
    description: "",
    requirements: "",
    budget: "",
    timeline: "",
    companyName: "",
    contactEmail: user?.email || "",
    additionalNotes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user has Master plan (mock for now)
  const hasMasterPlan = true; // In production, check user.subscription === 'master'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Project request submitted! We'll review and get back to you within 48 hours.");
    setIsSubmitting(false);
    setStep(4); // Success step
  };

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <Crown className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to submit a custom project request
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasMasterPlan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <Crown className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <CardTitle>Master Plan Required</CardTitle>
            <CardDescription>
              Custom project requests are exclusive to Master plan subscribers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Master Plan Benefits:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Custom project development</li>
                <li>• Priority support (24hr response)</li>
                <li>• 40 AI training sessions/month</li>
                <li>• 10% marketplace commission</li>
              </ul>
            </div>
            <Link href="/pricing">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
                Upgrade to Master
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">Custom Project Request</span>
            </div>
          </div>
          
          <Badge className="bg-purple-100 text-purple-800">
            Master Plan Exclusive
          </Badge>
        </div>
      </header>

      <main className="container py-8 max-w-3xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s 
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-24 md:w-32 h-1 mx-2 ${
                    step > s ? "bg-purple-500" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={step >= 1 ? "text-purple-600 font-medium" : "text-muted-foreground"}>
              Project Type
            </span>
            <span className={step >= 2 ? "text-purple-600 font-medium" : "text-muted-foreground"}>
              Details
            </span>
            <span className={step >= 3 ? "text-purple-600 font-medium" : "text-muted-foreground"}>
              Review
            </span>
          </div>
        </div>

        {step === 4 ? (
          /* Success State */
          <Card className="text-center">
            <CardContent className="py-12">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Request Submitted!</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Thank you for your project request. Our team will review your requirements and get back to you within 48 hours with a detailed proposal.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/dashboard">
                  <Button variant="outline">Go to Dashboard</Button>
                </Link>
                <Link href="/marketplace">
                  <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
                    Browse Marketplace
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              /* Step 1: Project Type */
              <Card>
                <CardHeader>
                  <CardTitle>What type of project do you need?</CardTitle>
                  <CardDescription>
                    Select the category that best describes your project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={form.projectType}
                    onValueChange={(v) => updateForm("projectType", v)}
                    className="grid md:grid-cols-2 gap-4"
                  >
                    {projectTypes.map((type) => (
                      <div key={type.value}>
                        <RadioGroupItem
                          value={type.value}
                          id={type.value}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={type.value}
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-500 cursor-pointer transition-all"
                        >
                          <type.icon className="w-8 h-8 mb-2 text-purple-600" />
                          <span className="font-semibold">{type.label}</span>
                          <span className="text-xs text-muted-foreground text-center mt-1">
                            {type.description}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!form.projectType}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                  >
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 2 && (
              /* Step 2: Project Details */
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>
                    Tell us more about your project requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => updateForm("title", e.target.value)}
                      placeholder="e.g., Custom Product Defect Detection System"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Project Description *</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(e) => updateForm("description", e.target.value)}
                      placeholder="Describe what you want to build and the problem it solves..."
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="requirements">Technical Requirements</Label>
                    <Textarea
                      id="requirements"
                      value={form.requirements}
                      onChange={(e) => updateForm("requirements", e.target.value)}
                      placeholder="Any specific technical requirements, integrations, or constraints..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Budget Range *</Label>
                      <Select value={form.budget} onValueChange={(v) => updateForm("budget", v)}>
                        <SelectTrigger>
                          <DollarSign className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgetRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Timeline *</Label>
                      <Select value={form.timeline} onValueChange={(v) => updateForm("timeline", v)}>
                        <SelectTrigger>
                          <Clock className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          {timelines.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        value={form.companyName}
                        onChange={(e) => updateForm("companyName", e.target.value)}
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Contact Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.contactEmail}
                        onChange={(e) => updateForm("contactEmail", e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!form.title || !form.description || !form.budget || !form.timeline}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                  >
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 3 && (
              /* Step 3: Review */
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Request</CardTitle>
                  <CardDescription>
                    Please review your project details before submitting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Project Type</span>
                      <span className="font-medium">
                        {projectTypes.find(t => t.value === form.projectType)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Title</span>
                      <span className="font-medium">{form.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-medium">
                        {budgetRanges.find(b => b.value === form.budget)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Timeline</span>
                      <span className="font-medium">
                        {timelines.find(t => t.value === form.timeline)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contact</span>
                      <span className="font-medium">{form.contactEmail}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="mt-1">{form.description}</p>
                  </div>
                  
                  {form.requirements && (
                    <div>
                      <Label className="text-muted-foreground">Technical Requirements</Label>
                      <p className="mt-1">{form.requirements}</p>
                    </div>
                  )}
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-800">What happens next?</p>
                      <p className="text-amber-700 mt-1">
                        Our team will review your request and send you a detailed proposal within 48 hours, including technical feasibility assessment, timeline, and pricing.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </form>
        )}
      </main>
    </div>
  );
}
