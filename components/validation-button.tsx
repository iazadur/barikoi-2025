"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// import close and check icon
import { X, Check } from "lucide-react"

interface ValidationButtonProps {
    type: "valid" | "invalid"
    onClick?: () => void
    className?: string
}

export function ValidationButton({
    type,
    onClick,
    className,
}: ValidationButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-3 py-1 rounded-md text-white text-sm font-medium transition-colors",
                type === "valid"
                    ? "bg-[#00A79D] hover:bg-[#00968D]"
                    : "bg-red-500 hover:bg-red-600",
                className
            )}
        >
            {type === "valid" ? <Check /> : <X />}
        </button>
    )
} 