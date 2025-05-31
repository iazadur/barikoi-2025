"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { PoiDetailModal } from "./poi-detail-modal"
import { approvePoi, rejectPoi } from "@/lib/api"

export type Poi = {
    id: string
    name: string
    address: string
    type: string
    floor: string
    phone: string
    image: string
    status: "pending" | "approved" | "rejected" | "valid" | "invalid"
    latitude: number
    longitude: number
    createdAt: string
    updatedAt: string
}

export const columns: ColumnDef<Poi>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("address")}</div>,
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            const imageUrl = row.getValue("image") as string
            return (
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="relative h-12 w-12 overflow-hidden rounded-md cursor-pointer">
                            <Image
                                src={imageUrl || "/placeholder-image.jpg"}
                                alt={`${row.getValue("name")} image`}
                                className="object-cover"
                                fill
                            />
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Image Preview</DialogTitle>
                        </DialogHeader>
                        <div className="relative w-full h-96">
                            <Image
                                src={imageUrl || "/placeholder-image.jpg"}
                                alt={`${row.getValue("name")} image`}
                                className="object-contain"
                                fill
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status")
            let statusClass, statusText;

            if (status === "pending") {
                statusClass = "bg-yellow-100 text-yellow-800";
                statusText = "Pending";
            } else if (status === "approved") {
                statusClass = "bg-green-100 text-green-800";
                statusText = "approved";
            } else if (status === "rejected") {
                statusClass = "bg-red-100 text-red-800";
                statusText = "rejected";
            }

            return (
                <div className="capitalize text-center">
                    <span className={`px-2 py-1 ${statusClass} rounded-full text-xs`}>
                        {statusText}
                    </span>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => <ViewPoiButton poi={row.original} />,
    },
]


const ViewPoiButton = ({ poi }: { poi: Poi }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false)

    const handleApprove = async (poi: Poi) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log(`Approved POI:`, poi.id)
        // Here you would typically update the POI status in your state/database
        await approvePoi(poi.id)
    }

    const handleReject = async (poi: Poi) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log(`Rejected POI:`, poi.id)
        // Here you would typically update the POI status in your state/database
        await rejectPoi(poi.id)
    }

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-medium"
            >
                <Eye className="h-4 w-4 mr-1" />
                View
            </Button>

            <PoiDetailModal
                poi={poi}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </>
    )
}