"use client"

import * as React from "react"
import maplibregl from "maplibre-gl"
// import {
//     // AttributionControl,
//     FullscreenControl,
//     GeolocateControl,
//     Marker,
//     NavigationControl
//   } from 'react-map-gl';
//   import Map, { MapRef, Source, Layer } from 'react-map-gl/maplibre';

import "maplibre-gl/dist/maplibre-gl.css"
import { cn } from "@/lib/utils"
import { samplePois } from "@/lib/data" // Import the samplePois data
import * as turf from "@turf/turf"
interface MapViewProps {
    className?: string
}

export function MapView({ className }: MapViewProps) {
    const mapContainer = React.useRef<HTMLDivElement>(null)
    const map = React.useRef<maplibregl.Map | null>(null)

    React.useEffect(() => {
        if (map.current) return

        if (mapContainer.current) {
            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: "https://map.barikoi.com/styles/osm_barikoi_v2/style.json?key=NDE2NzpVNzkyTE5UMUoy",
                center: [90.4125, 23.8103], // Centered on Dhaka, Bangladesh
                zoom: 12
            })

            map.current.addControl(new maplibregl.NavigationControl(), "top-right")

            // Add markers for each POI
            samplePois.forEach((poi, idx) => {
                new maplibregl.Marker({
                    color: idx % 2 === 0 ? "#00A79D" : "#FF0000",
                    draggable: true,
                    rotation: 0,
                    anchor: "bottom",
                    offset: [0, -32]
                })
                    .setLngLat([poi.longitude, poi.latitude]) // Replace with actual coordinates from your data
                    .addTo(map.current!)
            })

            map.current.on("click", (e) => {
                console.log(e)
            })

            // fit bounds to all markers bbox using turf
            const features = samplePois.map(poi => turf.point([poi.longitude, poi.latitude]));
            const bbox = turf.bbox(turf.featureCollection(features));
            map.current?.fitBounds([bbox[0], bbox[1], bbox[2], bbox[3]], {
                padding: 100,
                maxZoom: 15,
                duration: 1000,
                linear: true,
            })
        }

        return () => {
            if (map.current) {
                map.current.remove()
                map.current = null
            }
        }
    }, [])

    return (
        <div
            ref={mapContainer}
            className={cn("w-full h-full rounded-md overflow-hidden", className)}
        />
    )
} 