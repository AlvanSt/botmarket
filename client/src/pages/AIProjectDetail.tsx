import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, Link } from "wouter";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Brain, 
  Upload, 
  Play, 
  Download,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  Image
} from "lucide-react";

const statusColors: Record<string, string> = {
  created: "bg-gray-100 text-gray-800",
  uploading: "bg-blue-100 text-blue-800",
  training: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

export default function AIProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id || "0");
  
  const [newClass, setNewClass] = useState("");
  const [uploadingClass, setUploadingClass] = useState<string | null>(null);

  const { data: project, isLoading, refetch } = trpc.aiProjects.getById.useQuery(
    { id: projectId },
    { enabled: !!projectId }
  ) as { data: any; isLoading: boolean; refetch: () => void };

  const updateMutation = trpc.aiProjects.update.useMutation({
    onSuccess: () => {
      toast.success("Project updated!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const trainMutation = trpc.aiProjects.startTraining.useMutation({
    onSuccess: () => {
      toast.success("Training started!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Upload functionality placeholder - will be implemented with S3
  const uploadMutation = {
    mutate: (data: any) => {
      toast.info("Image upload feature coming soon!");
    },
    isPending: false,
  };

  const handleAddClass = () => {
    if (!newClass.trim() || !project) return;
    const currentClasses = (project.classes as string[]) || [];
    if (currentClasses.includes(newClass.trim())) {
      toast.error("Class already exists");
      return;
    }
    updateMutation.mutate({
      id: projectId,
      classLabels: [...currentClasses, newClass.trim()],
    });
    setNewClass("");
  };

  const handleRemoveClass = (className: string) => {
    if (!project) return;
    const currentClasses = (project.classes as string[]) || [];
    updateMutation.mutate({
      id: projectId,
      classLabels: currentClasses.filter(c => c !== className),
    });
  };

  const handleFileUpload = async (className: string, file: File) => {
    setUploadingClass(className);
    // Placeholder - actual upload will use S3
    toast.info("Image upload feature coming soon!");
    setUploadingClass(null);
  };

  const handleStartTraining = () => {
    trainMutation.mutate({ projectId });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
          <Link href="/ai-builder">
            <Button>Back to AI Builder</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const classes = (project.classes as string[]) || [];
  const trainingData = (project.trainingData as Record<string, string[]>) || {};
  const canTrain = classes.length >= 2 && Object.values(trainingData).every(images => images.length >= 5);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/ai-builder">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <Badge className={statusColors[project.status] || ""}>
                {project.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {project.description || "Image Classification Project"}
            </p>
          </div>
          {project.status === 'completed' && project.modelUrl && (
            <Button onClick={() => window.open(project.modelUrl as string, "_blank")}>
              <Download className="w-4 h-4 mr-2" />
              Export Model
            </Button>
          )}
        </div>

        <Tabs defaultValue="data">
          <TabsList>
            <TabsTrigger value="data">Training Data</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          {/* Training Data Tab */}
          <TabsContent value="data" className="space-y-6 mt-6">
            {/* Add Class */}
            <Card>
              <CardHeader>
                <CardTitle>Classes</CardTitle>
                <CardDescription>
                  Define the categories your model will learn to classify
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="e.g., Cat, Dog, Bird"
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddClass()}
                  />
                  <Button onClick={handleAddClass} disabled={updateMutation.isPending}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Class
                  </Button>
                </div>

                {classes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {classes.map((className) => (
                      <Badge key={className} variant="secondary" className="px-3 py-1">
                        {className}
                        <button
                          onClick={() => handleRemoveClass(className)}
                          className="ml-2 hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Add at least 2 classes to start training
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Upload Images per Class */}
            {classes.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {classes.map((className) => {
                  const images = trainingData[className] || [];
                  return (
                    <Card key={className}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{className}</CardTitle>
                          <Badge variant={images.length >= 5 ? "default" : "secondary"}>
                            {images.length} / 5+ images
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(className, file);
                            }}
                            className="hidden"
                            id={`upload-${className}`}
                            disabled={uploadingClass === className}
                          />
                          <label htmlFor={`upload-${className}`} className="cursor-pointer">
                            {uploadingClass === className ? (
                              <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2 animate-spin" />
                            ) : (
                              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                            )}
                            <p className="text-sm text-muted-foreground">
                              {uploadingClass === className ? "Uploading..." : "Click to upload images"}
                            </p>
                          </label>
                        </div>
                        
                        {images.length > 0 && (
                          <div className="grid grid-cols-5 gap-2 mt-4">
                            {images.slice(0, 10).map((url, i) => (
                              <div key={i} className="aspect-square rounded bg-muted flex items-center justify-center overflow-hidden">
                                <Image className="w-4 h-4 text-muted-foreground" />
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Configuration</CardTitle>
                <CardDescription>
                  Configure and start the training process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Classes</Label>
                    <p className="text-2xl font-bold">{classes.length}</p>
                  </div>
                  <div>
                    <Label>Total Images</Label>
                    <p className="text-2xl font-bold">
                      {Object.values(trainingData).reduce((sum, arr) => sum + arr.length, 0)}
                    </p>
                  </div>
                </div>

                {!canTrain && (
                  <div className="p-4 bg-yellow-50 rounded-lg text-yellow-800">
                    <p className="font-medium">Requirements not met:</p>
                    <ul className="text-sm mt-2 list-disc list-inside">
                      {classes.length < 2 && <li>Add at least 2 classes</li>}
                      {classes.some(c => (trainingData[c]?.length || 0) < 5) && (
                        <li>Upload at least 5 images per class</li>
                      )}
                    </ul>
                  </div>
                )}

                {project.status === 'training' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Training in progress...</span>
                      <span>{project.trainingProgress || 0}%</span>
                    </div>
                    <Progress value={project.trainingProgress || 0} />
                  </div>
                )}

                <Button 
                  onClick={handleStartTraining}
                  disabled={!canTrain || trainMutation.isPending || project.status === 'training'}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {project.status === 'training' ? "Training..." : "Start Training"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Results</CardTitle>
                <CardDescription>
                  View model performance and export options
                </CardDescription>
              </CardHeader>
              <CardContent>
                {project.status === 'completed' ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="font-medium text-green-800">Training Complete</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                        <p className="text-2xl font-bold">{project.accuracy || 0}%</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Model Size</p>
                        <p className="text-2xl font-bold">{project.modelSize || "N/A"}</p>
                      </div>
                    </div>

                    {project.modelUrl && (
                      <Button 
                        onClick={() => window.open(project.modelUrl as string, "_blank")}
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Model
                      </Button>
                    )}
                  </div>
                ) : project.status === 'failed' ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="font-medium text-red-700">Training Failed</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {project.errorMessage || "An error occurred during training"}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Complete training to see results
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
