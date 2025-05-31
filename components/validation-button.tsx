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
                "px-1.5 py-1 rounded-md text-white text-xs font-medium transition-colors",
                type === "valid"
                    ? "bg-[#00A79D] hover:bg-[#00968D]"
                    : "bg-red-500 hover:bg-red-600",
                className
            )}
        >
            {type === "valid" ? <Check size={18} /> : <X size={18} />}
        </button>
    )
} 