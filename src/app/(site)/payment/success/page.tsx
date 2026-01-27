import PaymentSuccess from "@/components/views/Payment/PaymentSuccess";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      }
    >
      <PaymentSuccess />;
    </Suspense>
  );
}
