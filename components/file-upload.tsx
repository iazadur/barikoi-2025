"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, MapPin, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onFileSelect?: (file: File | null) => void
}

export function FileUpload({
    className,
    onFileSelect,
    ...props
}: FileUploadProps) {
    const [formData, setFormData] = React.useState({
        latitude: "",
        longitude: "",
        imageFile: null as File | null
    })
    const [isLoading, setIsLoading] = React.useState(false)
    const [dragActive, setDragActive] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null
        setFormData(prev => ({
            ...prev,
            imageFile: file
        }))
        if (onFileSelect) {
            onFileSelect(file)
        }
    }

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            if (file.type.startsWith('image/')) {
                setFormData(prev => ({
                    ...prev,
                    imageFile: file
                }))
                if (onFileSelect) {
                    onFileSelect(file)
                }
            } else {
                toast.error("Please upload an image file")
            }
        }
    }

    const handleFileButtonClick = () => {
        inputRef.current?.click()
    }

    const validateForm = () => {
        if (!formData.latitude || !formData.longitude || !formData.imageFile) {
            toast.error("Please fill in all fields", {
                description: "Latitude, longitude, and image file are required"
            })
            return false
        }

        const lat = parseFloat(formData.latitude)
        const lng = parseFloat(formData.longitude)

        if (isNaN(lat) || lat < -90 || lat > 90) {
            toast.error("Invalid latitude", {
                description: "Latitude must be between -90 and 90"
            })
            return false
        }

        if (isNaN(lng) || lng < -180 || lng > 180) {
            toast.error("Invalid longitude", {
                description: "Longitude must be between -180 and 180"
            })
            return false
        }

        return true
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        setIsLoading(true)

        try {
            // Simulate file upload to get image URL
            const imageUrl = "https://barikoi-harmony.s3.amazonaws.com/uploads/8e50b599-2da4-4163-bc92-bb76bf04b81a.png?AWSAccessKeyId=AKIARGU7SYH6TODET7GG&Signature=aSp7%2Fw8Xf2WHMBVYuMids3HoySY%3D&Expires=1748697483"

            const response = await fetch('/api/extract-pois', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageUrl,
                    latitude: parseFloat(formData.latitude),
                    longitude: parseFloat(formData.longitude)
                })
            })

            if (!response.ok) {
                throw new Error('Failed to process image')
            }

            const data = await response.json()
            console.log('API Response:', data)

            toast.success("POI extraction completed!", {
                description: `Found ${data.pois?.length || 0} points of interest`,
                duration: 5000,
            })

            // Reset form
            setFormData({
                latitude: "",
                longitude: "",
                imageFile: null
            })

        } catch (error) {
            console.error('Error:', error)
            toast.error("Failed to process image", {
                description: "Please try again or contact support",
                duration: 4000,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className={cn("w-full max-w-2xl mx-auto shadow-lg border-0 bg-gradient-to-br from-slate-50 to-white", className)}>
            <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#00A79D] to-[#00968D] rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">
                    Extract POIs from Image
                </CardTitle>
                <CardDescription className="text-slate-600 text-base">
                    Upload an image and provide coordinates to extract Points of Interest
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Coordinate Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="latitude" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#00A79D]" />
                            Latitude
                        </Label>
                        <Input
                            id="latitude"
                            type="number"
                            step="any"
                            placeholder="e.g., 23.8103"
                            value={formData.latitude}
                            onChange={(e) => handleInputChange("latitude", e.target.value)}
                            className="border-slate-200 focus:border-[#00A79D] focus:ring-[#00A79D] transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="longitude" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#00A79D]" />
                            Longitude
                        </Label>
                        <Input
                            id="longitude"
                            type="number"
                            step="any"
                            placeholder="e.g., 90.4125"
                            value={formData.longitude}
                            onChange={(e) => handleInputChange("longitude", e.target.value)}
                            className="border-slate-200 focus:border-[#00A79D] focus:ring-[#00A79D] transition-colors"
                        />
                    </div>
                </div>

                {/* File Upload Area */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-[#00A79D]" />
                        Image File
                    </Label>
                    <div
                        className={cn(
                            "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer hover:border-[#00A79D] hover:bg-slate-50",
                            dragActive ? "border-[#00A79D] bg-[#00A79D]/5" : "border-slate-300",
                            formData.imageFile ? "border-green-400 bg-green-50" : ""
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={handleFileButtonClick}
                    >
                        {formData.imageFile ? (
                            <div className="space-y-2">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                                <p className="text-sm font-medium text-green-700">
                                    {formData.imageFile.name}
                                </p>
                                <p className="text-xs text-green-600">
                                    {(formData.imageFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <ImageIcon className="h-12 w-12 text-slate-400 mx-auto" />
                                <div>
                                    <p className="text-sm font-medium text-slate-700">
                                        Drop your image here, or{" "}
                                        <span className="text-[#00A79D] underline">browse</span>
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Supports: JPG, PNG, GIF (Max 10MB)
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !formData.latitude || !formData.longitude || !formData.imageFile}
                    className="w-full h-12 bg-gradient-to-r from-[#00A79D] to-[#00968D] hover:from-[#00968D] hover:to-[#007A73] text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing Image...
                        </>
                    ) : (
                        <>
                            <Upload className="mr-2 h-5 w-5" />
                            Extract POIs
                        </>
                    )}
                </Button>

                {/* Info Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">How it works:</p>
                            <ul className="space-y-1 text-blue-700">
                                <li>• Provide the exact coordinates where the image was taken</li>
                                <li>• Upload a clear street view or location image</li>
                                <li>• Our AI will identify and extract Points of Interest</li>
                                <li>• Results will be displayed in the table below</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </CardContent>

            {/* Hidden file input */}
            <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                {...props}
            />
        </Card>
    )
} 