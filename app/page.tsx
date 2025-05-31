// "use client"

import React from "react"
import { FileUpload } from "@/components/file-upload"
import { samplePois } from "@/lib/data"
import { getPois } from "@/lib/api"
import Dashboard from "@/components/Dashboard"

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
        <Dashboard data={mergedPois} />
      </main>
    </div>
  )
}