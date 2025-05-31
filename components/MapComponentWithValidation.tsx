"use client"

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { throttle } from 'lodash';
import { Switch } from '@/components/ui/switch';
import BarikoiLogo from '@/app/image/barikoi-logo-black.svg';

import {
    // AttributionControl,
    FullscreenControl,
    GeolocateControl,
    Marker,
    NavigationControl
} from 'react-map-gl';
import Map, { MapRef, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';

import ToggleButton from './ui/ToggleButton';
import PopUpOnClick from './ui/PopUpOnClick';
import useFilterLayers from './ui/FilterLayers';
import PolarOutletHover from './ui/PolarOutletHover';
import StatisticsOnHover from './ui/StatisticsOnClick';
import BuildingStatisticsOnClick from './ui/BuildingStatisticsOnClick';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from 'antd';
import { FaInfoCircle } from 'react-icons/fa';

import AreaPopupOnClick from './ui/AreaPopupOnClick';
import useFilteredFeaturesByRegion from './ui/useFilteredFeaturesByRegion';
import ZoneClickedMarkers from './MarkerSection/ZoneClickedMarkers';
import useCustomMapStyles from '@/hooks/useCustomMapStyles';
import { setSwitchPolarOutlets } from '@/lib/store/features/MapSlice/mapSlice';
import BarikoiOutletLayer from './ui/BarikoiOutletLayer';

// Import the validation markers component
import { ValidInvalidMarkers, ValidationPoint } from './MarkerSection/ValidInvalidMarkers';

function MapComponentWithValidation() {
    const mapStyles = useCustomMapStyles()
    const dispatch = useAppDispatch();
    const mapRef = React.useRef<MapRef>(null);
    const TimeFrame = useAppSelector((state: any) => state.leftPanel.timeState);
    const [zoomLevel, setZoomLevel] = React.useState(14.3);
    const { statistics } = useAppSelector((state) => state.statistics);
    const statisticsBuilding = useAppSelector((state) => state.buildingstatistics.buildingStatistics);
    const bbox = useAppSelector((state: any) => state.leftPanel.boundingBox);
    const selection = useAppSelector((state) => state?.mapdata?.selectedButton);
    const highlight = useAppSelector((state: any) => state?.mapdata?.highlight);
    const switchPolarOutlets = useAppSelector((state) => state?.mapdata?.switchPolarOutlets);
    const selectedSubArea = useAppSelector((state) => state?.mapdata?.selectedSubAreaData);

    // Show validation markers toggle state
    const [showValidationMarkers, setShowValidationMarkers] = React.useState(false);

    // Sample validation points - in a real app, you would fetch these from an API
    const [validationPoints, setValidationPoints] = React.useState<ValidationPoint[]>([
        {
            id: '1',
            longitude: 90.4125,
            latitude: 23.8103,
            type: 'valid',
            name: 'Barikoi Office',
            address: 'Banani, Dhaka'
        },
        {
            id: '2',
            longitude: 90.4150,
            latitude: 23.8110,
            type: 'invalid',
            name: 'Coffee Shop',
            address: 'Gulshan, Dhaka'
        },
        {
            id: '3',
            longitude: 90.4110,
            latitude: 23.8090,
            type: 'valid',
            name: 'Tech Hub',
            address: 'Banani, Dhaka'
        }
    ]);

    // Selected validation point
    const [selectedValidationPoint, setSelectedValidationPoint] = React.useState<ValidationPoint | null>(null);

    useFilterLayers();
    useFilteredFeaturesByRegion();

    // Update zoom level on zoom event
    const handleZoom = React.useCallback(() => {
        const throttledZoom = throttle(() => {
            const zoom = mapRef?.current?.getZoom();
            if (zoom) {
                setZoomLevel(zoom);
            }
        }, 200);
        throttledZoom();
    }, []);

    // Handle validation marker click
    const handleValidationMarkerClick = (point: ValidationPoint) => {
        setSelectedValidationPoint(point);
        // You can also fly to the marker
        mapRef.current?.flyTo({
            center: [point.longitude, point.latitude],
            zoom: 15,
            duration: 1000
        });
    };

    // Fly to the selected zone or building
    React.useEffect(() => {
        if (statistics.lng != 0 && selection === 'Zone' && mapRef.current) {
            mapRef.current.flyTo({
                center: [statistics.lng, statistics.lat],
                essential: true,
            });
        }
    }, [statistics, selection]);

    // Fly to the selected building
    React.useEffect(() => {
        if (
            statisticsBuilding.poi_info &&
            selection === 'Building' &&
            mapRef.current
        ) {
            mapRef.current.flyTo({
                center: [statisticsBuilding.lng, statisticsBuilding.lat],
                essential: true,
            });
        }
    }, [statisticsBuilding, selection]);

    // Fit the map to the bounding box
    React.useEffect(() => {
        if (bbox) {
            mapRef?.current?.fitBounds(
                [
                    //@ts-ignore
                    [bbox?.minLng, bbox?.minLat],
                    //@ts-ignore
                    [bbox?.maxLng, bbox?.maxLat],
                ],
                { padding: 40, duration: 1000 }
            );
        }
    }, [bbox]);

    // Add this geojson data (you can move it to a separate file if preferred)
    const mainePolygon = React.useMemo(() => {
        return selectedSubArea
    }, [selectedSubArea]);

    // maplibre addImage from local
    React.useEffect(() => {
        const map = mapRef.current?.getMap();
        if (!map) return;
        map.on('load', async () => {
            const polar_icon_1 = await map.loadImage('polar_icons/1.png');
            const polar_icon_9 = await map.loadImage('polar_icons/9.png');
            const polar_icon_10 = await map.loadImage('polar_icons/10.png');
            const polar_icon_11 = await map.loadImage('polar_icons/11.png');
            const polar_icon_12 = await map.loadImage('polar_icons/12.png');
            const polar_icon_13 = await map.loadImage('polar_icons/13.png');
            const polar_icon_14 = await map.loadImage('polar_icons/14.png');
            const polar_icon_25 = await map.loadImage('polar_icons/25.png');
            const polar_icon_26 = await map.loadImage('polar_icons/26.png');
            const custom_bkoi_icon = await map.loadImage('barikoi_icon.png');

            map.addImage('polar_outlet_type_id_1', polar_icon_1.data);
            map.addImage('polar_outlet_type_id_9', polar_icon_9.data);
            map.addImage('polar_outlet_type_id_10', polar_icon_10.data);
            map.addImage('polar_outlet_type_id_11', polar_icon_11.data);
            map.addImage('polar_outlet_type_id_12', polar_icon_12.data);
            map.addImage('polar_outlet_type_id_13', polar_icon_13.data);
            map.addImage('polar_outlet_type_id_14', polar_icon_14.data);
            map.addImage('polar_outlet_type_id_25', polar_icon_25.data);
            map.addImage('polar_outlet_type_id_26', polar_icon_26.data);
            map.addImage('custom_bkoi_icon', custom_bkoi_icon.data);
        }
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapRef.current]);

    // Render the map component
    return (
        <div className="rounded-[20px] relative h-full md:min-h-[68vh] w-full mr-1 @apply shadow-[0px_4px_4px_0px_#00000040]">
            <nav className="bg-white @apply shadow-[0px_2px_2px_0px_#00000066] z-40 absolute top-0 left-0 right-0 rounded-t-[20px]">
                <div className="flex flex-row justify-between p-2 px-4 space-y-2 sm:space-y-0 sm:space-x-4">
                    {/* Current Zoom Level */}
                    <div className="flex justify-between items-center space-x-2">
                        <span className="text-base sm:text-xs md:text-sm lg:text-md">
                            Current zoom level:{' '}
                        </span>
                        <div
                            className={`${parseFloat(zoomLevel.toFixed(2)) >= 14
                                ? 'text-green-600'
                                : 'text-red-400'
                                } font-bold text-base sm:text-xs md:text-sm lg:text-md`}
                        >
                            {zoomLevel.toFixed(2)}
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button type="text">
                                        <FaInfoCircle className="text-base sm:text-xs md:text-sm lg:text-md" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-xs border-none">
                                        Zoom in to at least level 14 to view detailed building and
                                        zone data.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    {/* Latest Update */}
                    <div className="text-base sm:text-xs md:text-sm lg:text-md font-semibold text-gray-700 p-2">
                        Latest Update: October 10
                    </div>

                    {/* Switch for Validation Markers */}
                    <div className="flex justify-center items-center space-x-2">
                        <Switch
                            onCheckedChange={(val) => setShowValidationMarkers(val)}
                        />
                        <span className="ml-2 text-base sm:text-xs md:text-sm lg:text-md">
                            Show Validation Markers
                        </span>
                    </div>

                    {/* Switch Polar Outlet */}
                    <div className="flex justify-center items-center space-x-2">
                        <Switch
                            onCheckedChange={(val) => dispatch(setSwitchPolarOutlets(val))}
                        />
                        <span className="ml-2 text-base sm:text-xs md:text-sm lg:text-md">
                            Show Polar Outlet Details
                        </span>
                    </div>
                </div>
            </nav>
            {mapStyles && (
                <Map
                    ref={mapRef}
                    id="myMapA"
                    initialViewState={{
                        longitude: 90.4169,
                        latitude: 23.7896,
                        zoom: 14.3,
                    }}
                    onZoomEnd={handleZoom} // Listen for zoom changes
                    style={{
                        width: '100%',
                        height: '100%',
                        minHeight: '68vh',
                        borderRadius: 20,
                        position: 'relative',
                        border: `${highlight ? '2px solid #FF9B50' : ''}`,
                    }}
                    // @ts-ignore
                    mapStyle={mapStyles}
                    attributionControl={false}
                >
                    {/* <LoadPolarIcon /> */}
                    {/* Add the polygon source and layer */}
                    <Source id="maine" type="geojson" data={mainePolygon}>
                        <Layer
                            id="maine-fill"
                            type="fill"
                            paint={{
                                'fill-color': '#088',
                                'fill-opacity': 0.2
                            }}
                            layout={{
                                'visibility': selectedSubArea ? 'visible' : 'none'
                            }}
                        />
                        <Layer
                            id="maine-border"
                            type="line"
                            paint={{
                                'line-color': '#000',
                                'line-width': 2,
                                'line-dasharray': [2, 2], // This creates the dashed effect
                                'line-opacity': 0.8
                            }}
                            layout={{
                                'visibility': selectedSubArea ? 'visible' : 'none'
                            }}
                        />
                    </Source>

                    {/* Validation Markers */}
                    {showValidationMarkers && (
                        <ValidInvalidMarkers
                            points={validationPoints}
                            onMarkerClick={handleValidationMarkerClick}
                        />
                    )}

                    {/* Add the polygon source and layer */}
                    <BarikoiOutletLayer />
                    <Link
                        href="https://barikoi.com/"
                        className="absolute bottom-2 left-3 w-16"
                        target="_blank"
                    >
                        <Image
                            src={BarikoiLogo}
                            alt="Logo"
                            width={20}
                            height={24}
                            layout="responsive"
                        />
                    </Link>
                    {TimeFrame && <ToggleButton />}
                    {/* <AttributionControl /> */}
                    <NavigationControl position="bottom-right" />
                    <GeolocateControl position="bottom-right" />
                    <FullscreenControl position="bottom-right" />
                    <PopUpOnClick mode={TimeFrame} />
                    {statisticsBuilding?.poi_info && selection === 'Building' && (
                        <AreaPopupOnClick />
                    )}
                    <StatisticsOnHover mode={TimeFrame} />
                    <BuildingStatisticsOnClick mode={TimeFrame} />
                    {/* Polar Outlet Hover */}
                    {switchPolarOutlets && <PolarOutletHover />}
                    <ZoneClickedMarkers />
                    {statistics && selection === 'Zone' && (
                        <Marker
                            longitude={statistics?.lng}
                            color="red"
                            latitude={statistics?.lat}
                        />
                    )}
                    {statisticsBuilding.poi_info && selection === 'Building' && (
                        <Marker
                            longitude={statisticsBuilding?.lng}
                            color="blue"
                            latitude={statisticsBuilding?.lat}
                        />
                    )}
                </Map>
            )}

            {/* Selected Validation Point Info Panel */}
            {selectedValidationPoint && (
                <div className="absolute top-16 right-4 bg-white p-4 rounded-md shadow-lg z-10 max-w-xs">
                    <h3 className="font-bold text-lg">
                        {selectedValidationPoint.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{selectedValidationPoint.address}</p>
                    <div className="flex items-center">
                        <span className="mr-2">Status:</span>
                        <span
                            className={`px-2 py-1 rounded-full text-xs text-white ${selectedValidationPoint.type === 'valid'
                                    ? 'bg-[#00A79D]'
                                    : 'bg-red-500'
                                }`}
                        >
                            {selectedValidationPoint.type === 'valid' ? 'Valid' : 'Invalid'}
                        </span>
                    </div>
                    <button
                        className="mt-2 text-sm text-gray-500 hover:text-gray-700"
                        onClick={() => setSelectedValidationPoint(null)}
                    >
                        Close
                    </button>
                </div>
            )}

            {/* Legend for Validation Markers */}
            {showValidationMarkers && (
                <div className="absolute bottom-16 left-4 bg-white p-3 rounded-md shadow-md">
                    <h4 className="font-medium text-sm mb-2">Validation Legend</h4>
                    <div className="flex items-center mb-1">
                        <div className="w-4 h-4 rounded-full bg-[#00A79D] mr-2"></div>
                        <span className="text-xs">Valid Points</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-xs">Invalid Points</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MapComponentWithValidation; 