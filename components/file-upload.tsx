"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onFileSelect?: (file: File | null) => void
}

export function FileUpload({
    className,
    onFileSelect,
    ...props
}: FileUploadProps) {
    const [fileName, setFileName] = React.useState<string | null>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null
        setFileName(file?.name || null)
        if (onFileSelect) {
            onFileSelect(file)
        }
    }

    const handleButtonClick = () => {
        inputRef.current?.click()
    }

    return (
        <div className={cn("flex flex-col space-y-2", className)}>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    onClick={handleButtonClick}
                    className="bg-[#00A79D] hover:bg-[#00968D] text-white"
                >
                    Select File
                </Button>
                {fileName && (
                    <span className="text-sm text-[#333333]">
                        {fileName}
                    </span>
                )}
            </div>
            <input
                type="file"
                ref={inputRef}
                className="hidden"
                onChange={handleFileChange}
                {...props}
            />
        </div>
    )
} 