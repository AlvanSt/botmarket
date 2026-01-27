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
  X,
  Eye,
  Tag,
  Zap
} from "lucide-react";

const statusColors: Record<string, string> = {
  created: "bg-gray-100 text-gray-800",
  uploading: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
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
};

// Mock data for demonstration
const mockDataSamples = [
  { id: 1, name: "cat_001.jpg", class: "cats", size: "245 KB", status: "labeled" },
  { id: 2, name: "cat_002.jpg", class: "cats", size: "312 KB", status: "labeled" },
  { id: 3, name: "dog_001.jpg", class: "dogs", size: "198 KB", status: "labeled" },
  { id: 4, name: "dog_002.jpg", class: "dogs", size: "267 KB", status: "labeled" },
  { id: 5, name: "bird_001.jpg", class: "birds", size: "156 KB", status: "pending" },
];

const mockClasses = [
  { name: "cats", count: 245, color: "bg-blue-500" },
  { name: "dogs", count: 198, color: "bg-green-500" },
  { name: "birds", count: 87, color: "bg-purple-500" },
];

export default function AIProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState<"upload" | "process" | "label" | "train">("upload");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [labelingData, setLabelingData] = useState(mockDataSamples);
  const [trainingProgress, setTrainingProgress] = useState(0);

  // Mock project data
  const project = {
    id: id,
    name: "Product Classifier",
    description: "Classify product images into categories",
    modelType: "image_classification",
    status: "uploading",
    createdAt: new Date(),
    classes: mockClasses,
    totalSamples: 530,
    labeledSamples: 530,
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress(100);
        toast.success("Data uploaded successfully!");
        setTimeout(() => setCurrentStep("process"), 1000);
      }
      setUploadProgress(progress);
    }, 500);
  };

  const handleProcessData = () => {
    toast.info("Processing data...");
    setTimeout(() => {
      toast.success("Data processed! Ready for labeling.");
      setCurrentStep("label");
    }, 2000);
  };

  const handleToggleLabel = (id: number) => {
    setLabelingData(labelingData.map(item =>
      item.id === id
        ? { ...item, status: item.status === "labeled" ? "pending" : "labeled" }
        : item
    ));
  };

  const handleStartTraining = () => {
    setCurrentStep("train");
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTrainingProgress(100);
        toast.success("Model training completed!");
      }
      setTrainingProgress(progress);
    }, 1000);
  };

  const labeledCount = labelingData.filter(d => d.status === "labeled").length;
  const pendingCount = labelingData.filter(d => d.status === "pending").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/ai-builder")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: "upload", label: "Upload", icon: Upload },
            { id: "process", label: "Process", icon: Zap },
            { id: "label", label: "Label", icon: Tag },
            { id: "train", label: "Train", icon: Play },
          ].map((step: any) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = ["upload", "process", "label"].includes(step.id) && currentStep === "train";

            return (
              <Button
                key={step.id}
                variant={isActive ? "default" : "outline"}
                className={`h-auto flex flex-col items-center gap-2 py-4 ${
                  isCompleted ? "bg-green-100 text-green-800" : ""
                }`}
                onClick={() => setCurrentStep(step.id as any)}
                disabled={step.id === "train" && labeledCount === 0}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{step.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Step Content */}
        <Tabs value={currentStep} onValueChange={(v) => setCurrentStep(v as any)} className="space-y-4">
          {/* Upload Step */}
          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Step 1: Upload Training Data
                </CardTitle>
                <CardDescription>
                  Upload your training data in the correct format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Format Guide */}
                <div className="bg-muted p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Data Format Guide
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-sm mb-2">ZIP Archive Format</p>
                      <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
{`my_data.zip
├── cats/
│   ├── cat1.jpg
│   ├── cat2.jpg
│   └── ...
├── dogs/
│   └── ...
└── birds/
    └── ...`}
                      </pre>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>✓ Each folder name becomes a class label</p>
                      <p>✓ Minimum 10 images per class recommended</p>
                      <p>✓ Supported formats: JPG, PNG, WEBP</p>
                      <p>✓ Max file size: 100MB</p>
                    </div>
                  </div>
                </div>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <FileArchive className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">Drop your ZIP file here</h3>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                  <Input
                    type="file"
                    accept=".zip"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Select ZIP File
                    </label>
                  </Button>
                </div>

                {/* Upload Progress */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {uploadProgress === 100 && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle>Upload Complete</AlertTitle>
                    <AlertDescription>
                      Your data has been uploaded successfully. Proceed to the next step.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Process Step */}
          <TabsContent value="process" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Step 2: Process Data
                </CardTitle>
                <CardDescription>
                  Extract and organize your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Data Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">{project.totalSamples}</p>
                        <p className="text-sm text-muted-foreground">Total Samples</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-600">{mockClasses.length}</p>
                        <p className="text-sm text-muted-foreground">Classes Found</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">100%</p>
                        <p className="text-sm text-muted-foreground">Valid Files</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Class Distribution */}
                <div>
                  <h3 className="font-semibold mb-3">Class Distribution</h3>
                  <div className="space-y-3">
                    {mockClasses.map((cls) => (
                      <div key={cls.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize font-medium">{cls.name}</span>
                          <span className="text-muted-foreground">{cls.count} samples</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`${cls.color} h-2 rounded-full`}
                            style={{ width: `${(cls.count / project.totalSamples) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleProcessData}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Process Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Label Step */}
          <TabsContent value="label" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Step 3: Label & Review Data
                </CardTitle>
                <CardDescription>
                  Review and confirm labels for your training data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Label Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{labeledCount}</p>
                        <p className="text-sm text-muted-foreground">Labeled</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
                        <p className="text-sm text-muted-foreground">Pending Review</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Data Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left">File Name</th>
                          <th className="px-4 py-2 text-left">Class</th>
                          <th className="px-4 py-2 text-left">Size</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labelingData.map((item) => (
                          <tr key={item.id} className="border-t hover:bg-muted/50">
                            <td className="px-4 py-2 font-medium">{item.name}</td>
                            <td className="px-4 py-2">
                              <Badge variant="outline">{item.class}</Badge>
                            </td>
                            <td className="px-4 py-2 text-muted-foreground">{item.size}</td>
                            <td className="px-4 py-2">
                              <Badge
                                className={
                                  item.status === "labeled"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-amber-100 text-amber-800"
                                }
                              >
                                {item.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleLabel(item.id)}
                              >
                                {item.status === "labeled" ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-amber-600" />
                                )}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <Button
                  onClick={() => setCurrentStep("train")}
                  disabled={labeledCount === 0}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  All Data Labeled - Ready to Train
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Train Step */}
          <TabsContent value="train" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Step 4: Train Model
                </CardTitle>
                <CardDescription>
                  Train your AI model with the labeled data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Training Config */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Epochs</Label>
                    <Input type="number" defaultValue="50" />
                  </div>
                  <div>
                    <Label>Batch Size</Label>
                    <Input type="number" defaultValue="32" />
                  </div>
                </div>

                {/* Training Progress */}
                {trainingProgress > 0 && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Training Progress</span>
                        <span className="font-semibold">{Math.round(trainingProgress)}%</span>
                      </div>
                      <Progress value={trainingProgress} className="h-3" />
                    </div>

                    {trainingProgress === 100 && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle>Training Complete!</AlertTitle>
                        <AlertDescription>
                          Your model has been trained successfully. You can now test it or publish to the marketplace.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {trainingProgress === 0 && (
                  <Button
                    onClick={handleStartTraining}
                    size="lg"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Training
                  </Button>
                )}

                {trainingProgress === 100 && (
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Test Model
                    </Button>
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Publish to Marketplace
                    </Button>
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
