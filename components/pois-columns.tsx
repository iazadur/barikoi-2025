"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { ValidationButton } from "@/components/validation-button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

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
            } else if (status === "valid") {
                statusClass = "bg-green-100 text-green-800";
                statusText = "Valid";
            } else {
                statusClass = "bg-red-100 text-red-800";
                statusText = "Invalid";
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
        header: "Actions",
        cell: ({ row }) => {
            const poi = row.original

            const handleValidation = async (type: "valid" | "invalid") => {
                // Call your API here
                console.log(`Marked as ${type}:`, poi.id)
            }

            return (
                <div className="flex items-center gap-2 justify-center">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <ValidationButton type="valid" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Validation</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to mark this POI as valid?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleValidation("valid")}>
                                    Yes
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <ValidationButton type="invalid" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Validation</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to mark this POI as invalid?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleValidation("invalid")}>
                                    Yes
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )
        },
    },
] 