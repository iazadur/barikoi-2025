"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { ValidationButton } from "@/components/validation-button"

export type Poi = {
    id: string
    name: string
    address: string
    image: string
    status: "pending" | "approved" | "rejected" | "valid" | "invalid"
    latitude: number
    longitude: number
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
                <div className="relative h-12 w-12 overflow-hidden rounded-md">
                    <Image
                        src={imageUrl || "/placeholder-image.jpg"}
                        alt={`${row.getValue("name")} image`}
                        className="object-cover"
                        fill
                    />
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <div className="capitalize">
                    {status === "pending" ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                            Pending
                        </span>
                    ) : status === "valid" ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Valid
                        </span>
                    ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                            Invalid
                        </span>
                    )}
                </div>
            )
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const poi = row.original

            return (
                <div className="flex items-center gap-2">
                    <ValidationButton
                        type="valid"
                        onClick={() => console.log("Marked as valid:", poi.id)}
                    />
                    <ValidationButton
                        type="invalid"
                        onClick={() => console.log("Marked as invalid:", poi.id)}
                    />
                </div>
            )
        },
    },
] 