"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/context/user-context";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [countdown, setCountdown] = useState(5);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!user) {
      return;
    }

    if (countdown <= 0) {
      let checkoutContext: { returnTo?: string } | null = null;

      try {
        const checkoutContextRaw = localStorage.getItem("scholarstika_checkout_context");
        checkoutContext = checkoutContextRaw ? JSON.parse(checkoutContextRaw) : null;
      } catch (error) {
        console.error("Failed to parse checkout context", error);
        localStorage.removeItem("scholarstika_checkout_context");
      }

      if (checkoutContext?.returnTo) {
        localStorage.removeItem("scholarstika_checkout_context");
        router.push(checkoutContext.returnTo);
        return;
      }

      const dashboardRoute =
        user.role === "institution_manager"
          ? "/institution/dashboard"
          : user.role === "branch_manager" || user.role === "branch_admin"
            ? "/branch/dashboard"
            : "/";

      router.push(dashboardRoute);
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown, router, user]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-xl border-none shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-emerald-700 px-8 py-6 text-white text-center">
          <div className="flex justify-center mb-3">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-black">Payment Successful</h1>
          <p className="mt-2 text-sm text-emerald-50">
            Stripe accepted the payment. Your subscription is being finalized.
          </p>
        </div>
        <CardContent className="p-8 text-center space-y-5">
          <div className="flex items-center justify-center gap-3 text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">
              Redirecting to your dashboard in {countdown}s
            </span>
          </div>
          {sessionId && (
            <p className="text-xs text-slate-500 break-all">
              Session: {sessionId}
            </p>
          )}
          <div className="flex justify-center">
            <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
              <Link href="/pricing">Back to Pricing</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
