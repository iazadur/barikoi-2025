import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Poi } from './pois-columns'
import { toast } from 'sonner'

interface PoiDetailModalProps {
    poi: Poi | null
    isOpen: boolean
    onClose: () => void
    onApprove?: (poi: Poi) => Promise<void>
    onReject?: (poi: Poi) => Promise<void>
}

export const PoiDetailModal = ({
    poi,
    isOpen,
    onClose,
    onApprove,
    onReject
}: PoiDetailModalProps) => {
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [actionType, setActionType] = React.useState<'approve' | 'reject' | null>(null)

    if (!poi) return null

    const handleApprove = async () => {
        setIsProcessing(true)
        setActionType('approve')

        try {
            await onApprove?.(poi)
            toast.success('POI Approved Successfully!', {
                description: `${poi.name} has been marked as approved.`,
                duration: 4000,
            })
            onClose()
        } catch (error) {
            console.error('Error approving POI:', error)
            toast.error('Failed to approve POI', {
                description: 'Please try again or contact support.',
                duration: 4000,
            })
        } finally {
            setIsProcessing(false)
            setActionType(null)
        }
    }

    const handleReject = async () => {
        setIsProcessing(true)
        setActionType('reject')

        try {
            await onReject?.(poi)
            toast.error('POI Rejected', {
                description: `${poi.name} has been marked as rejected.`,
                duration: 4000,
            })
            onClose()
        } catch (error) {
            console.error('Error rejecting POI:', error)
            toast.error('Failed to reject POI', {
                description: 'Please try again or contact support.',
                duration: 4000,
            })
        } finally {
            setIsProcessing(false)
            setActionType(null)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'valid':
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'invalid':
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl w-full max-h-[90vh] p-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b border-slate-200">
                    <DialogTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        POI Details
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col lg:flex-row h-[600px]">
                    {/* Left Side - POI Details */}
                    <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                                <h3 className="text-lg font-semibold text-slate-900 mb-3">Basic Information</h3>
                                <div className="space-y-3">
                                    {poi.name && <div>
                                        <label className="text-sm font-medium text-slate-600">Name</label>
                                        <p className="text-slate-900 font-medium">{poi.name}</p>
                                    </div>}
                                    {poi.address && <div>
                                        <label className="text-sm font-medium text-slate-600">Address</label>
                                        <p className="text-slate-700 text-sm leading-relaxed">{poi.address}</p>
                                    </div>}
                                    {poi.type && <div>
                                        <label className="text-sm font-medium text-slate-600">POI Type</label>
                                        <p className="text-slate-700 font-mono text-sm">{poi.type}</p>
                                    </div>}
                                    {poi.floor && <div>
                                        <label className="text-sm font-medium text-slate-600">Floor</label>
                                        <p className="text-slate-700 font-mono text-sm">{poi.floor}</p>
                                    </div>}
                                    {poi.phone && <div>
                                        <label className="text-sm font-medium text-slate-600">Phone</label>
                                        <p className="text-slate-700 font-mono text-sm">{poi.phone}</p>
                                    </div>}
                                </div>
                            </div>

                            {/* Location Information */}
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                                <h3 className="text-lg font-semibold text-slate-900 mb-3">Location</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-600">Latitude</label>
                                        <p className="text-slate-900 font-mono text-sm">{poi.latitude}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-600">Longitude</label>
                                        <p className="text-slate-900 font-mono text-sm">{poi.longitude}</p>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <label className="text-sm font-medium text-slate-600">Coordinates</label>
                                    <p className="text-slate-700 text-sm">{poi.latitude}, {poi.longitude}</p>
                                </div>
                            </div>

                            {/* Status Information */}
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                                <h3 className="text-lg font-semibold text-slate-900 mb-3">Status</h3>
                                <div className="flex items-center gap-3">
                                    <Badge className={`${getStatusColor(poi.status)} border`}>
                                        {poi.status.charAt(0).toUpperCase() + poi.status.slice(1)}
                                    </Badge>
                                    <div className="text-sm text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>Last updated: {new Date().toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                                <h3 className="text-lg font-semibold text-slate-900 mb-3">Additional Information</h3>
                                <div className="space-y-2 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3 w-3" />
                                        <span>Created: {new Date().toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-3 w-3" />
                                        <span>Source: Manual Entry</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Image */}
                    <div className="flex-1 bg-white border-l border-slate-200">
                        <div className="h-full flex flex-col">
                            <div className="p-4 border-b border-slate-200">
                                <h3 className="text-lg font-semibold text-slate-900">POI Image</h3>
                            </div>
                            <div className="flex-1 relative bg-slate-50 flex items-center justify-center">
                                {poi.image ? (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={poi.image}
                                            alt={`${poi.name} image`}
                                            fill
                                            className="object-contain p-4"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center p-8">
                                        <div className="w-24 h-24 bg-slate-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                            <MapPin className="h-8 w-8 text-slate-400" />
                                        </div>
                                        <p className="text-slate-500 text-sm">No image available</p>
                                        <p className="text-slate-400 text-xs mt-1">Image will be displayed here when available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer with Action Buttons */}
                <DialogFooter className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between w-full">
                        <div className="text-sm text-slate-600">
                            Review this POI and take appropriate action
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                disabled={isProcessing}
                                className="min-w-[100px]"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleReject}
                                disabled={isProcessing}
                                className="min-w-[100px] bg-red-600 hover:bg-red-700"
                            >
                                {isProcessing && actionType === 'reject' ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Rejecting...
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={handleApprove}
                                disabled={isProcessing}
                                className="min-w-[100px] bg-green-600 hover:bg-green-700"
                            >
                                {isProcessing && actionType === 'approve' ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Approving...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Approve
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 