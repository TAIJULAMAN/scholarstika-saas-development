"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-xl border-none shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-amber-600 px-8 py-6 text-white text-center">
          <div className="flex justify-center mb-3">
            <AlertCircle className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-black">Payment Cancelled</h1>
          <p className="mt-2 text-sm text-amber-50">
            No charge was completed. You can return and try checkout again.
          </p>
        </div>
        <CardContent className="p-8 text-center">
          <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
            <Link href="/pricing">Return to Pricing</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
