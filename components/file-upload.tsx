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
        // inputRef.current?.click()
        fetch('/api/extract-pois', {
            method: 'POST',
            body: JSON.stringify({ imageUrl: "https://barikoi-harmony.s3.amazonaws.com/uploads/8e50b599-2da4-4163-bc92-bb76bf04b81a.png?AWSAccessKeyId=AKIARGU7SYH6TODET7GG&Signature=aSp7%2Fw8Xf2WHMBVYuMids3HoySY%3D&Expires=1748697483" })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
            .catch(error => {
                console.error('Error:', error)
            })
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