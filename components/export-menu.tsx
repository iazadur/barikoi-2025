"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { FileSpreadsheet, FileText, Download, Loader2, ChevronDown } from 'lucide-react'
import * as XLSX from 'xlsx'
import { Poi } from './pois-columns'
import { toast } from 'sonner'

interface ExportMenuProps {
    data: Poi[]
}

export const ExportMenu = ({ data }: ExportMenuProps) => {
    const [isExporting, setIsExporting] = useState(false)
    const [exportType, setExportType] = useState<string>('')

    const exportToExcel = async () => {
        setIsExporting(true)
        setExportType('excel')

        try {
            await new Promise(resolve => setTimeout(resolve, 1200))

            const exportData = data.map((poi, index) => ({
                'S.No': index + 1,
                'POI Name': poi.name,
                'Address': poi.address,
                'Status': poi.status.charAt(0).toUpperCase() + poi.status.slice(1),
                'Latitude': poi.latitude,
                'Longitude': poi.longitude,
                'Coordinates': `${poi.latitude}, ${poi.longitude}`,
                'POI ID': poi.id,
                'Export Date': new Date().toLocaleDateString(),
                'Export Time': new Date().toLocaleTimeString()
            }))

            const wb = XLSX.utils.book_new()
            const ws = XLSX.utils.json_to_sheet(exportData)

            // Enhanced column formatting
            const colWidths = [
                { wch: 8 },  // S.No
                { wch: 30 }, // POI Name
                { wch: 45 }, // Address
                { wch: 12 }, // Status
                { wch: 12 }, // Latitude
                { wch: 12 }, // Longitude
                { wch: 25 }, // Coordinates
                { wch: 15 }, // POI ID
                { wch: 12 }, // Export Date
                { wch: 12 }  // Export Time
            ]
            ws['!cols'] = colWidths

            // Add header styling
            const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
            for (let col = range.s.c; col <= range.e.c; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
                if (!ws[cellAddress]) continue
                ws[cellAddress].s = {
                    font: { bold: true, color: { rgb: "FFFFFF" } },
                    fill: { fgColor: { rgb: "2563EB" } },
                    alignment: { horizontal: "center" }
                }
            }

            XLSX.utils.book_append_sheet(wb, ws, 'Barikoi POI Data')

            const date = new Date().toISOString().split('T')[0]
            const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-')
            const filename = `barikoi-poi-export-${date}_${time}.xlsx`

            XLSX.writeFile(wb, filename)

            toast.success(`Excel export completed successfully!`, {
                description: `${data.length} POIs exported to ${filename}`,
                duration: 5000,
            })

        } catch (error) {
            console.error('Excel export error:', error)
            toast.error('Excel export failed', {
                description: 'Unable to generate Excel file. Please try again.',
                duration: 4000,
            })
        } finally {
            setIsExporting(false)
            setExportType('')
        }
    }

    const exportToCSV = async () => {
        setIsExporting(true)
        setExportType('csv')

        try {
            await new Promise(resolve => setTimeout(resolve, 800))

            const headers = ['S.No', 'POI Name', 'Address', 'Status', 'Latitude', 'Longitude', 'POI ID']
            const csvData = [
                headers.join(','),
                ...data.map((poi, index) => [
                    index + 1,
                    `"${poi.name}"`,
                    `"${poi.address}"`,
                    poi.status,
                    poi.latitude,
                    poi.longitude,
                    poi.id
                ].join(','))
            ].join('\n')

            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement('a')
            const url = URL.createObjectURL(blob)

            const date = new Date().toISOString().split('T')[0]
            link.setAttribute('href', url)
            link.setAttribute('download', `barikoi-poi-data-${date}.csv`)
            link.style.visibility = 'hidden'

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            toast.success(`CSV export completed!`, {
                description: `${data.length} POIs exported successfully`,
                duration: 4000,
            })

        } catch (error) {
            console.error('CSV export error:', error)
            toast.error('CSV export failed', {
                description: 'Unable to generate CSV file. Please try again.',
                duration: 4000,
            })
        } finally {
            setIsExporting(false)
            setExportType('')
        }
    }

    const exportToJSON = async () => {
        setIsExporting(true)
        setExportType('json')

        try {
            await new Promise(resolve => setTimeout(resolve, 600))

            const exportData = {
                exportInfo: {
                    totalRecords: data.length,
                    exportDate: new Date().toISOString(),
                    source: 'Barikoi POI Management System'
                },
                pois: data.map((poi, index) => ({
                    serialNumber: index + 1,
                    ...poi,
                    coordinates: {
                        latitude: poi.latitude,
                        longitude: poi.longitude
                    }
                }))
            }

            const jsonString = JSON.stringify(exportData, null, 2)
            const blob = new Blob([jsonString], { type: 'application/json' })
            const link = document.createElement('a')
            const url = URL.createObjectURL(blob)

            const date = new Date().toISOString().split('T')[0]
            link.setAttribute('href', url)
            link.setAttribute('download', `barikoi-poi-data-${date}.json`)
            link.style.visibility = 'hidden'

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            toast.success(`JSON export completed!`, {
                description: `${data.length} POIs exported in JSON format`,
                duration: 4000,
            })

        } catch (error) {
            console.error('JSON export error:', error)
            toast.error('JSON export failed', {
                description: 'Unable to generate JSON file. Please try again.',
                duration: 4000,
            })
        } finally {
            setIsExporting(false)
            setExportType('')
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    disabled={isExporting || data.length === 0}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                >
                    {isExporting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {exportType === 'excel' && 'Exporting...'}
                            {exportType === 'csv' && 'Generating...'}
                            {exportType === 'json' && 'Creating...'}
                        </>
                    ) : (
                        <>
                            <Download className="mr-2 h-4 w-4" />
                            Export Data
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border border-slate-200 shadow-xl rounded-lg p-1">
                <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold text-slate-700">
                    Export Options
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-200" />

                <DropdownMenuItem
                    onClick={exportToExcel}
                    disabled={isExporting}
                    className="px-3 py-2.5 cursor-pointer hover:bg-emerald-50 rounded-md transition-colors duration-150"
                >
                    <FileSpreadsheet className="mr-3 h-4 w-4 text-emerald-600" />
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-800">Excel Spreadsheet</span>
                        <span className="text-xs text-slate-500">Best for data analysis</span>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={exportToCSV}
                    disabled={isExporting}
                    className="px-3 py-2.5 cursor-pointer hover:bg-blue-50 rounded-md transition-colors duration-150"
                >
                    <FileText className="mr-3 h-4 w-4 text-blue-600" />
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-800">CSV File</span>
                        <span className="text-xs text-slate-500">Universal compatibility</span>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={exportToJSON}
                    disabled={isExporting}
                    className="px-3 py-2.5 cursor-pointer hover:bg-purple-50 rounded-md transition-colors duration-150"
                >
                    <div className="mr-3 h-4 w-4 text-purple-600 font-bold text-xs flex items-center justify-center">{ }</div>
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-800">JSON Format</span>
                        <span className="text-xs text-slate-500">For developers</span>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-200 mt-2" />
                <div className="px-3 py-2 text-xs text-slate-400">
                    {data.length} record{data.length !== 1 ? 's' : ''} ready to export
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}