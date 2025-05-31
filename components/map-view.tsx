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
import * as turf from "@turf/turf"
import Link from "next/link"
import Image from "next/image"
import { Poi } from "./pois-columns"

interface MapViewProps {
    className?: string,
    samplePois: Poi[],
    selectedPoi: Poi | null
}

export function MapView({ className, samplePois, selectedPoi }: MapViewProps) {
    const mapContainer = React.useRef<HTMLDivElement>(null)
    const map = React.useRef<maplibregl.Map | null>(null)

    React.useEffect(() => {
        if (map.current) return

        if (mapContainer.current) {
            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: "https://map.barikoi.com/styles/osm_barikoi_v2/style.json?key=NDE2NzpVNzkyTE5UMUoy",
                center: [90.4125, 23.8103], // Centered on Dhaka, Bangladesh
                zoom: 12,
                attributionControl: false
            })

            map.current.addControl(new maplibregl.NavigationControl(), "top-right")

            map.current.on('load', async () => {
                try {
                    // Load the custom icon image
                    const image = await map.current!.loadImage("/barikoi_icon.png")
                    map.current!.addImage("barikoi_icon", image.data)

                    // Load selected icon for highlighted POI
                    const selectedImage = await map.current!.loadImage("/barikoi_icon.png")
                    map.current!.addImage("barikoi_icon_selected", selectedImage.data)

                    // Initial map setup
                    updateMapData()

                } catch (error) {
                    console.error('Error loading map icons:', error)
                    // Fallback: use default markers if icon loading fails
                    samplePois.forEach((poi, idx) => {
                        new maplibregl.Marker({
                            color: idx % 2 === 0 ? "#00A79D" : "#FF0000"
                        })
                            .setLngLat([poi.longitude, poi.latitude])
                            .addTo(map.current!)
                    })
                }
            })

            map.current.on("click", (e) => {
                console.log(e)
            })
        }

        return () => {
            if (map.current) {
                map.current.remove()
                map.current = null
            }
        }
    }, [])

    // Function to update map data when POIs or selection changes
    const updateMapData = React.useCallback(() => {
        if (!map.current || !map.current.isStyleLoaded()) return

        try {
            // Determine which POIs to show
            const poisToShow = selectedPoi ? [selectedPoi] : samplePois

            // Create GeoJSON data
            const geojsonData = {
                type: "FeatureCollection" as const,
                features: poisToShow.map((poi, idx) => ({
                    type: "Feature" as const,
                    geometry: {
                        type: "Point" as const,
                        coordinates: [poi.longitude, poi.latitude]
                    },
                    properties: {
                        id: poi.id,
                        name: poi.name,
                        address: poi.address,
                        status: poi.status,
                        index: idx,
                        isSelected: selectedPoi?.id === poi.id
                    }
                }))
            }

            // Update the source data
            const source = map.current.getSource('pois') as maplibregl.GeoJSONSource
            if (source) {
                source.setData(geojsonData)
            } else {
                // Add the GeoJSON source if it doesn't exist
                map.current.addSource('pois', {
                    type: 'geojson',
                    data: geojsonData
                })

                // Add symbol layer for regular POIs
                map.current.addLayer({
                    id: 'poi-icons',
                    type: 'symbol',
                    source: 'pois',
                    filter: ['!', ['get', 'isSelected']],
                    layout: {
                        'icon-image': 'barikoi_icon',
                        'icon-size': 0.2,
                        'icon-anchor': 'bottom',
                        'icon-allow-overlap': true,
                        'text-field': ['get', 'name'],
                        'text-font': ['Open Sans Regular'],
                        'text-offset': [0, 0],
                        'text-anchor': 'top',
                        'text-size': 11
                    },
                    paint: {
                        'text-color': '#374151',
                        'text-halo-color': '#ffffff',
                        'text-halo-width': 1.5,
                        'icon-opacity': selectedPoi ? 0.4 : 1
                    }
                })

                // Add symbol layer for selected POI
                map.current.addLayer({
                    id: 'poi-icons-selected',
                    type: 'symbol',
                    source: 'pois',
                    filter: ['get', 'isSelected'],
                    layout: {
                        'icon-image': 'barikoi_icon_selected',
                        'icon-size': 0.2,
                        'icon-anchor': 'bottom',
                        'icon-allow-overlap': true,
                        'text-field': ['get', 'name'],
                        'text-font': ['Open Sans Regular'],
                        'text-offset': [0, 0],
                        'text-anchor': 'top',
                        'text-size': 13
                    },
                    paint: {
                        'text-color': '#DC2626',
                        'text-halo-color': '#ffffff',
                        'text-halo-width': 2
                    }
                })

                // Add click events for both layers
                const layerIds = ['poi-icons', 'poi-icons-selected'] as const
                layerIds.forEach((layerId: string) => {
                    map.current!.on('click', layerId, (e) => {
                        if (e.features && e.features[0]) {
                            const properties = e.features[0].properties
                            console.log('POI clicked:', properties)

                            // Create enhanced popup
                            new maplibregl.Popup({ closeOnClick: true })
                                .setLngLat(e.lngLat)
                                .setHTML(`
                                    <div style="padding: 12px; min-width: 200px;">
                                        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">${properties.name}</h3>
                                        <p style="margin: 0 0 6px 0; font-size: 13px; color: #6b7280; line-height: 1.4;">${properties.address}</p>
                                        <div style="display: flex; align-items: center; gap: 6px; margin-top: 8px;">
                                            <span style="padding: 2px 8px; background: ${properties.status === 'valid' ? '#dcfce7' : properties.status === 'pending' ? '#fef3c7' : '#fecaca'}; color: ${properties.status === 'valid' ? '#166534' : properties.status === 'pending' ? '#92400e' : '#991b1b'}; border-radius: 12px; font-size: 11px; font-weight: 500;">
                                                ${properties.status.charAt(0).toUpperCase() + properties.status.slice(1)}
                                            </span>
                                            ${properties.isSelected ? '<span style="font-size: 11px; color: #dc2626; font-weight: 500;">● Selected</span>' : ''}
                                        </div>
                                    </div>
                                `)
                                .addTo(map.current!)
                        }
                    })

                    // Hover effects
                    map.current!.on('mouseenter', layerId, () => {
                        map.current!.getCanvas().style.cursor = 'pointer'
                    })

                    map.current!.on('mouseleave', layerId, () => {
                        map.current!.getCanvas().style.cursor = ''
                    })
                })
            }

            // Fit bounds to visible POIs
            if (poisToShow.length > 0) {
                if (selectedPoi) {
                    // Zoom to selected POI
                    map.current.flyTo({
                        center: [selectedPoi.longitude, selectedPoi.latitude],
                        zoom: 16,
                        duration: 1500,
                        essential: true
                    })
                } else {
                    // Fit to all POIs
                    const features = poisToShow.map(poi => turf.point([poi.longitude, poi.latitude]))
                    const bbox = turf.bbox(turf.featureCollection(features))
                    map.current.fitBounds([bbox[0], bbox[1], bbox[2], bbox[3]], {
                        padding: 100,
                        maxZoom: 15,
                        duration: 1000,
                        linear: true,
                    })
                }
            }

        } catch (error) {
            console.error('Error updating map data:', error)
        }
    }, [samplePois, selectedPoi])

    // Update map when POIs or selection changes
    React.useEffect(() => {
        updateMapData()
    }, [updateMapData])

    return (
        <div className="relative w-full h-full overflow-hidden">
            <div
                ref={mapContainer}
                className={cn("w-full h-full rounded-md overflow-hidden", className)}
            />
            <Link
                href="https://barikoi.com/"
                className="absolute bottom-2 left-3 w-16"
                target="_blank"
            >
                <Image
                    src={"/barikoi-logo-black.svg"}
                    alt="Logo"
                    width={20}
                    height={24}
                    layout="responsive"
                    className="z-10"
                />
            </Link>
        </div>
    )
} 