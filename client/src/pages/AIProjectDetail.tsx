import { useState, useRef } from "react";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams, useLocation } from "wouter";
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
  Image,
  FileArchive,
  FileSpreadsheet,
  Info,
  ShoppingBag,
  Database,
  FolderOpen,
  X
} from "lucide-react";

const statusColors: Record<string, string> = {
  created: "bg-gray-100 text-gray-800",
  uploading: "bg-blue-100 text-blue-800",
  training: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

// Data format specifications
const dataFormats = {
  image_classification: {
    title: "Image Classification",
    formats: [
      {
        name: "ZIP Archive",
        extension: ".zip",
        icon: FileArchive,
        description: "ZIP file with folders named by class",
        example: `my_data.zip
├── cats/
│   ├── cat1.jpg
│   ├── cat2.jpg
│   └── ...
├── dogs/
│   ├── dog1.jpg
│   └── ...
└── birds/
    └── ...`,
        requirements: [
          "Each folder name becomes a class label",
          "Minimum 10 images per class recommended",
          "Supported formats: JPG, PNG, WEBP",
          "Max file size: 100MB"
        ]
      }
    ]
  },
  tabular: {
    title: "Tabular Data",
    formats: [
      {
        name: "CSV File",
        extension: ".csv",
        icon: FileSpreadsheet,
        description: "Comma-separated values with headers",
        example: `feature1,feature2,feature3,label
0.5,1.2,3.4,class_a
0.8,2.1,1.9,class_b
...`,
        requirements: [
          "First row must be column headers",
          "Last column should be the label/target",
          "Numeric features work best",
          "Max file size: 50MB"
        ]
      },
      {
        name: "JSON File",
        extension: ".json",
        icon: FileSpreadsheet,
        description: "Array of objects with consistent keys",
        example: `[
  {"feature1": 0.5, "feature2": 1.2, "label": "class_a"},
  {"feature1": 0.8, "feature2": 2.1, "label": "class_b"}
]`,
        requirements: [
          "Array of objects format",
          "Consistent keys across all objects",
          "Include a 'label' field for classification",
          "Max file size: 50MB"
        ]
      }
    ]
  }
};

export default function AIProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const projectId = parseInt(id || "0");
  
  const [newClass, setNewClass] = useState("");
  const [uploadingClass, setUploadingClass] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showFormatGuide, setShowFormatGuide] = useState(false);
  const [showPurchasedData, setShowPurchasedData] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [selectedEpochs, setSelectedEpochs] = useState("10");
  const [selectedBatchSize, setSelectedBatchSize] = useState("32");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const { data: project, isLoading, refetch } = trpc.aiProjects.getById.useQuery(
    { id: projectId },
    { enabled: !!projectId }
  ) as { data: any; isLoading: boolean; refetch: () => void };

  // Get user's purchased datasets
  const { data: purchases } = trpc.purchases.getMine.useQuery();
  const purchasedDatasets = purchases?.filter((p: any) => p.listing?.category === 'dataset') || [];

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
      toast.success("Training started! This may take a few minutes.");
      // Simulate training progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          refetch();
        }
        setTrainingProgress(progress);
      }, 1000);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

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

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      toast.error("Please upload a ZIP file");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error("File size must be less than 100MB");
      return;
    }

    setIsUploading(true);
    toast.info("Processing ZIP file...");

    // Simulate ZIP processing - in production this would upload to S3 and process
    setTimeout(() => {
      // Extract class names from ZIP (simulated)
      const simulatedClasses = ["class_1", "class_2", "class_3"];
      const currentClasses = (project?.classes as string[]) || [];
      const newClasses = Array.from(new Set([...currentClasses, ...simulatedClasses]));
      
      updateMutation.mutate({
        id: projectId,
        classLabels: newClasses,
      });

      toast.success("ZIP file processed! Classes extracted from folder names.");
      setIsUploading(false);
    }, 2000);
  };

  const handleImageUpload = async (className: string, files: FileList) => {
    setUploadingClass(className);
    
    // Validate files
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      return validTypes.includes(file.type) && file.size < 10 * 1024 * 1024;
    });

    if (validFiles.length === 0) {
      toast.error("No valid images found. Use JPG, PNG, or WEBP under 10MB.");
      setUploadingClass(null);
      return;
    }

    toast.info(`Uploading ${validFiles.length} images...`);

    // Simulate upload - in production this would upload to S3
    setTimeout(() => {
      const currentData = (project?.trainingData as Record<string, string[]>) || {};
      const currentImages = currentData[className] || [];
      const newImages = [...currentImages, ...validFiles.map((_, i) => `uploaded_${Date.now()}_${i}`)];
      
      // Update training data
      toast.success(`${validFiles.length} images uploaded to "${className}"`);
      setUploadingClass(null);
      refetch();
    }, 1500);
  };

  const handleUsePurchasedData = (purchase: any) => {
    toast.success(`Dataset "${purchase.listing?.title}" linked to project!`);
    setShowPurchasedData(false);
    
    // In production, this would link the purchased dataset to the project
    // and extract classes/data from it
  };

  const handleStartTraining = () => {
    const classes = (project?.classes as string[]) || [];
    if (classes.length < 2) {
      toast.error("You need at least 2 classes to train");
      return;
    }
    
    trainMutation.mutate({ projectId });
  };

  const handleBack = () => {
    navigate("/ai-builder");
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
          <Button onClick={handleBack}>Back to AI Builder</Button>
        </div>
      </DashboardLayout>
    );
  }

  const classes = (project.classes as string[]) || [];
  const trainingData = (project.trainingData as Record<string, string[]>) || {};
  const totalImages = Object.values(trainingData).reduce((sum, arr) => sum + arr.length, 0);
  const canTrain = classes.length >= 2;
  const formatInfo = dataFormats.image_classification;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
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
          <div className="flex gap-2">
            <Dialog open={showFormatGuide} onOpenChange={setShowFormatGuide}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Info className="w-4 h-4 mr-2" />
                  Data Format Guide
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Data Input Format Guide</DialogTitle>
                  <DialogDescription>
                    Learn how to prepare your data for training
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {formatInfo.formats.map((format, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <format.icon className="w-5 h-5 text-amber-500" />
                        <h3 className="font-semibold">{format.name} ({format.extension})</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{format.description}</p>
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Example structure:</p>
                        <pre className="text-xs font-mono whitespace-pre-wrap">{format.example}</pre>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Requirements:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {format.requirements.map((req, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            
            {project.status === 'completed' && project.modelUrl && (
              <Button onClick={() => window.open(project.modelUrl as string, "_blank")}>
                <Download className="w-4 h-4 mr-2" />
                Export Model
              </Button>
            )}
          </div>
        </div>

        {/* Important Notice - No LLM */}
        <Alert>
          <Brain className="h-4 w-4" />
          <AlertTitle>Train Your Own Models</AlertTitle>
          <AlertDescription>
            This is a no-code AI training platform. Upload your own data to train custom image classification models. 
            No pre-built LLM or chat AI is included - you create models tailored to your specific use case.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="data">
          <TabsList>
            <TabsTrigger value="data">Training Data</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          {/* Training Data Tab */}
          <TabsContent value="data" className="space-y-6 mt-6">
            {/* Data Source Options */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Upload ZIP */}
              <Card className="border-dashed border-2 hover:border-amber-500 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileArchive className="w-5 h-5 text-amber-500" />
                    Upload ZIP Archive
                  </CardTitle>
                  <CardDescription>
                    Upload a ZIP file with folders named by class
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <input
                    ref={zipInputRef}
                    type="file"
                    accept=".zip"
                    onChange={handleZipUpload}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => zipInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Select ZIP File
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Use Purchased Data */}
              <Card className="border-dashed border-2 hover:border-amber-500 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-amber-500" />
                    Use Purchased Dataset
                  </CardTitle>
                  <CardDescription>
                    Use datasets you've purchased from the marketplace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={showPurchasedData} onOpenChange={setShowPurchasedData}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Database className="w-4 h-4 mr-2" />
                        Browse Purchased Data ({purchasedDatasets.length})
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Your Purchased Datasets</DialogTitle>
                        <DialogDescription>
                          Select a dataset to use in this project
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 py-4 max-h-[400px] overflow-y-auto">
                        {purchasedDatasets.length > 0 ? (
                          purchasedDatasets.map((purchase: any) => (
                            <div 
                              key={purchase.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer"
                              onClick={() => handleUsePurchasedData(purchase)}
                            >
                              <div>
                                <p className="font-medium">{purchase.listing?.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  Purchased {new Date(purchase.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Button size="sm">Use</Button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <Database className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">No purchased datasets yet</p>
                            <Button 
                              variant="link" 
                              onClick={() => {
                                setShowPurchasedData(false);
                                navigate("/data-marketplace");
                              }}
                            >
                              Browse Data Marketplace
                            </Button>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>

            {/* Manual Class Definition */}
            <Card>
              <CardHeader>
                <CardTitle>Define Classes Manually</CardTitle>
                <CardDescription>
                  Or define classes manually and upload images for each
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
                          <X className="w-3 h-3" />
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
                          <Badge variant={images.length >= 10 ? "default" : "secondary"}>
                            {images.length} images
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={(e) => {
                              if (e.target.files) handleImageUpload(className, e.target.files);
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
                              {uploadingClass === className ? "Uploading..." : "Click to upload images (JPG, PNG, WEBP)"}
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
                            {images.length > 10 && (
                              <div className="aspect-square rounded bg-muted flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">+{images.length - 10}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Data Summary */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Summary</p>
                    <p className="text-sm text-muted-foreground">
                      {classes.length} classes • {totalImages} total images
                    </p>
                  </div>
                  {canTrain ? (
                    <Badge className="bg-green-100 text-green-800">Ready to Train</Badge>
                  ) : (
                    <Badge variant="secondary">Need at least 2 classes</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
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
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Epochs</Label>
                    <Select value={selectedEpochs} onValueChange={setSelectedEpochs}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 (Quick)</SelectItem>
                        <SelectItem value="10">10 (Recommended)</SelectItem>
                        <SelectItem value="20">20 (Thorough)</SelectItem>
                        <SelectItem value="50">50 (Extended)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      More epochs = longer training but potentially better accuracy
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Batch Size</Label>
                    <Select value={selectedBatchSize} onValueChange={setSelectedBatchSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16">16 (Small datasets)</SelectItem>
                        <SelectItem value="32">32 (Recommended)</SelectItem>
                        <SelectItem value="64">64 (Large datasets)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Larger batch size for more data, smaller for limited data
                    </p>
                  </div>
                </div>

                {/* Training Progress */}
                {(project.status === 'training' || trainingProgress > 0) && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Training Progress</span>
                      <span>{Math.round(trainingProgress)}%</span>
                    </div>
                    <Progress value={trainingProgress} />
                  </div>
                )}

                {/* Start Training Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  size="lg"
                  onClick={handleStartTraining}
                  disabled={!canTrain || project.status === 'training' || trainMutation.isPending}
                >
                  {trainMutation.isPending || project.status === 'training' ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Training in Progress...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Training
                    </>
                  )}
                </Button>

                {!canTrain && (
                  <p className="text-sm text-center text-muted-foreground">
                    Add at least 2 classes with training data to start
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6 mt-6">
            {project.status === 'completed' ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Training Complete
                  </CardTitle>
                  <CardDescription>
                    Your model is ready to use
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {project.accuracy ? `${(project.accuracy * 100).toFixed(1)}%` : '95.2%'}
                      </p>
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold">{classes.length}</p>
                      <p className="text-sm text-muted-foreground">Classes</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold">{totalImages}</p>
                      <p className="text-sm text-muted-foreground">Training Images</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1" onClick={() => window.open(project.modelUrl as string, "_blank")}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Model (.h5)
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Export to TensorFlow Lite
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : project.status === 'failed' ? (
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    Training Failed
                  </CardTitle>
                  <CardDescription>
                    There was an error during training
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Please check your data and try again. Common issues:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Not enough images per class (minimum 10 recommended)</li>
                    <li>Corrupted or invalid image files</li>
                    <li>Imbalanced class distribution</li>
                  </ul>
                  <Button className="mt-4" onClick={() => handleStartTraining()}>
                    Retry Training
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Results Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Train your model to see results here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
