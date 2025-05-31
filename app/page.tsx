// "use client"

import React from "react"
import { getPois } from "@/lib/api"
import Dashboard from "@/components/Dashboard"

export default async function Home() {

  const pois = await getPois()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mergedPois = pois.map((poi: any) => ({
    id: poi.id,
    name: poi.ocr_name,
    address: poi.ocr_address,
    image: poi.s3_url,
    type: poi.ocr_building_type,
    floor: poi.ocr_floor_count,
    phone: poi.ocr_phone,
    status: poi.status,
    createdAt: poi.created_at,
    updatedAt: poi.updated_at,
    latitude: poi.latitude,
    longitude: poi.longitude,
  }))
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#333333]">
      <header className="bg-[#00A79D] p-4 text-white">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">POI Management</h1>
        </div>
      </header>
      <main className="container mx-auto py-6 px-4">
        <Dashboard data={mergedPois} />
      </main>
    </div>
  )
}