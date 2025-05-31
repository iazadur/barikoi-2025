"use client"
import React, { useState } from 'react'
import TableHeader from './table-header'
import { DataTable } from './data-table'
import { MapView } from './map-view'
import { columns, Poi } from './pois-columns'
import { Button } from './ui/button'
import { X, MapPin } from 'lucide-react'
import { FileUploadModal } from './file-upload-modal'

interface DashboardProps {
    data: Poi[]
}

const Dashboard = ({ data }: DashboardProps) => {
    const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null)

    const handleRowClick = (poi: Poi) => {
        // Toggle selection - if same POI is clicked, deselect it
        setSelectedPoi(selectedPoi?.id === poi.id ? null : poi)
    }

    const clearSelection = () => {
        setSelectedPoi(null)
    }

    return (
        <>
            <FileUploadModal />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                <div className="h-[600px] rounded-md border relative">
                    <MapView className="h-full" pois={data} selectedPoi={selectedPoi} />

                    {/* Selected POI Info Overlay */}
                    {selectedPoi && (
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 p-4 max-w-sm z-10">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="h-4 w-4 text-red-500" />
                                        <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">Selected POI</span>
                                    </div>
                                    <h3 className="font-semibold text-slate-900 text-sm leading-tight mb-1">
                                        {selectedPoi.name}
                                    </h3>
                                    <p className="text-xs text-slate-600 leading-relaxed mb-2">
                                        {selectedPoi.address}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedPoi.status === 'valid'
                                            ? 'bg-green-100 text-green-700'
                                            : selectedPoi.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {selectedPoi.status.charAt(0).toUpperCase() + selectedPoi.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearSelection}
                                    className="h-6 w-6 p-0 hover:bg-slate-100"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-[600px] space-y-4">
                    <div className="flex items-center justify-between">
                        <TableHeader data={data} />

                    </div>
                    {selectedPoi && <div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearSelection}
                            className="text-xs h-8"
                        >
                            Reset Map POIs
                        </Button>
                    </div>}

                    <div className="overflow-auto h-[calc(100%-6rem)]">
                        <DataTable
                            columns={columns}
                            data={data}
                            onRowClick={handleRowClick}
                            selectedRowId={selectedPoi?.id}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard