// "use client"

import React from "react"
import { MapView } from "@/components/map-view"
import { FileUpload } from "@/components/file-upload"
import { DataTable } from "@/components/data-table"
import { columns } from "@/components/pois-columns"
import { samplePois } from "@/lib/data"
import { getPois } from "@/lib/api"
export default async function Home() {
  // const [file, setFile] = React.useState<File | null>(null)

  // const handleFileSelect = (selectedFile: File | null) => {
  //   setFile(selectedFile)
  // }
  const pois = await getPois()
  console.log(pois)
  // i want to merge samplePois and pois
  const mergedPois = samplePois.map((poi, idx) => ({
    ...poi,
    image: pois[idx]?.s3_url ?? ""
  }))
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#333333]">
      <header className="bg-[#00A79D] p-4 text-white">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">POI Management</h1>
        </div>
      </header>
      <main className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <FileUpload
            accept=".csv,.xlsx"
          // onFileSelect={handleFileSelect}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[600px] rounded-md border">
            <MapView className="h-full" />
          </div>
          <div className="h-[600px]">
            <h2 className="text-xl font-semibold mb-4">POI List</h2>
            <div className="overflow-auto h-[calc(100%-2rem)]">
              <DataTable columns={columns} data={mergedPois} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}