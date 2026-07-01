"use client"

import { useState } from "react"
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { InstitutionBranch } from "@/types/institution-branch"
import { logPricingOverride } from "@/lib/audit-logger"
import { useUser } from "@/context/user-context"
import { AlertCircle, History } from "lucide-react"

interface PriceOverrideDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    branch: InstitutionBranch
    onSubmit: (data: {
        id: string
        annualPriceUsd: number
        overrideReason: string
    }) => Promise<void>
}

export function PriceOverrideDialog({
    open,
    onOpenChange,
    branch,
    onSubmit
}: PriceOverrideDialogProps) {
    const { user } = useUser()
    const [newPrice, setNewPrice] = useState(branch.annualPriceUsd?.toString() || "0")
    const [reason, setReason] = useState("")
    const [loading, setLoading] = useState(false)

    const handleOverride = async () => {
        if (!reason) return
        
        setLoading(true)
        await onSubmit({
            id: branch.id,
            annualPriceUsd: Number(newPrice),
            overrideReason: reason,
        })
        
        logPricingOverride(
            { id: user?.email || "unknown", name: user?.name || "Admin" },
            { id: branch.id, name: branch.name },
            branch.annualPriceUsd || 0,
            Number(newPrice),
            reason
        )
        
        setLoading(false)
        onOpenChange(false)
        setReason("")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        Admin Price Override
                    </DialogTitle>
                    <DialogDescription>
                        Manually adjust the annual fee for <strong>{branch.name}</strong>. This action will be logged.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="currentPrice">Original Calculated Price (USD)</Label>
                        <Input
                            id="currentPrice"
                            value={`$${branch.annualPriceUsd || 0}`}
                            disabled
                            className="bg-slate-50"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="newPrice">New Overridden Price (USD)</Label>
                        <Input
                            id="newPrice"
                            type="number"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="reason">Reason for Override</Label>
                        <Textarea
                            id="reason"
                            placeholder="Provide a justification for this manual override..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleOverride}
                        disabled={!reason || loading}
                        className="bg-amber-600 hover:bg-amber-700"
                    >
                        {loading ? "Saving..." : "Apply Override"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
