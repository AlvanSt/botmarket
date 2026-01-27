import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useSearch } from "wouter";
import { CheckCircle, Download, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function PurchaseSuccess() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const sessionId = params.get("session_id");
  const purchaseId = params.get("purchase_id");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const verifyMutation = trpc.purchases.verifyCheckout.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setStatus("success");
        toast.success("Purchase completed successfully!");
      } else {
        setStatus("error");
        toast.error("Payment verification failed");
      }
    },
    onError: (error: any) => {
      setStatus("error");
      toast.error(error.message || "Verification failed");
    },
  });

  const downloadMutation = trpc.listings.getDownloadUrl.useMutation({
    onSuccess: (data) => {
      window.open(data.url, "_blank");
      toast.success("Download started!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (sessionId && purchaseId) {
      verifyMutation.mutate({
        sessionId,
        purchaseId: parseInt(purchaseId),
      });
    } else {
      setStatus("error");
    }
  }, [sessionId, purchaseId]);

  const handleDownload = () => {
    if (purchaseId) {
      // We need to get the listing ID from the purchase
      // For now, redirect to purchases page
      toast.info("Redirecting to your purchases...");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        {status === "loading" && (
          <>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <CardTitle>Verifying Payment</CardTitle>
              <CardDescription>
                Please wait while we confirm your purchase...
              </CardDescription>
            </CardHeader>
          </>
        )}

        {status === "success" && (
          <>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-green-700">Purchase Complete!</CardTitle>
              <CardDescription>
                Thank you for your purchase. You can now download your item.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/my-purchases">
                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Go to My Purchases
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </>
        )}

        {status === "error" && (
          <>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-red-700">Verification Failed</CardTitle>
              <CardDescription>
                We couldn't verify your payment. If you were charged, please contact support.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/my-purchases">
                <Button className="w-full">
                  Check My Purchases
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="outline" className="w-full">
                  Back to Marketplace
                </Button>
              </Link>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
