import React, { useState, useEffect } from "react";
import SelectionTree from "../components/history/SelectionTree.tsx";
import DateTimeInputs from "../components/commun/DateTimeInputs.tsx";
import { Loader2, Menu, X } from "lucide-react";
import { LocationWithDevices, SiteWithLocationAndDevices } from "../components/types/location";
import { useSites } from "../components/hooks/useSite.tsx";
import { useDeviceApi } from "../components/hooks/useDevice.tsx";
import { useLocations } from "../components/hooks/useLocation.tsx";
import { useIsMobile } from "../components/hooks/useIsMobile.tsx";
import { Component, Device } from "../components/types/device.ts";
import DataGraph from "../components/history/DataGraph.tsx";
import { useInfluxDB } from "../components/hooks/useInfluxDB.tsx";
import ComponentStatsGraph from "../components/history/ComponentStatsGraph.tsx";

const History: React.FC = () => {
    const [selectedlocationID, setSelectedlocationID] = useState<number | null>(null);
    const [selecteddeviceID, setSelecteddeviceID] = useState<string | null>(null);
    const [selectedComponents, setSelectedComponents] = useState<Component[]>([]);
    const [selectedMetric, setSelectedMetric] = useState<('current' | 'voltage' | 'power')[]>([]);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [expandedlocationID, setExpandedlocationID] = useState<number | null>(null);
    const [expandeddeviceID, setExpandeddeviceID] = useState<string | null>(null);
    const [isSidebarExplicitlyOpen, setIsSidebarExplicitlyOpen] = useState(false);
    const [isFetchTriggered, setIsFetchTriggered] = useState(false);
    const [selectedwindowPeriod, setSelectedwindowPeriod] = useState<string>("1h");
    const isMobile = useIsMobile(1100);

    const { sites, fetchMySites } = useSites();
    const {fetchDeviceFromLocation, fetchComponentsFromDevice } = useDeviceApi();
    const { fetchLocationsBySiteIds, locations: baseLocations } = useLocations();

    const [sitesWithLocations, setSitesWithLocations] = useState<SiteWithLocationAndDevices[]>([]);

    // useInfluxDB hook
    const {
        monitoringData: influxData,
        loading: influxLoading,
        validationError,
        noData: noInfluxData,
        getSensorData,
        getMetrics
    } = useInfluxDB();

    useEffect(() => {
        if (!isMobile) setIsSidebarExplicitlyOpen(false);
    }, [isMobile]);

    const resetSelections = () => {
        setSelecteddeviceID(null);
        setSelectedComponents([]);
        setSelectedMetric([]);
        setStartTime("");
        setEndTime("");
        setIsFetchTriggered(false);
    };

    useEffect(() => {
        fetchMySites();
    }, [fetchMySites]);

    useEffect(() => {
        if (!sites || sites.length === 0) return;
        fetchLocationsBySiteIds(sites.map((s) => s.site_id));
    }, [sites, fetchLocationsBySiteIds]);

    useEffect(() => {
        let isCancelled = false;

        const fetchDevicesAndSensors = async () => {
            if (!baseLocations || baseLocations.length === 0) return;
            try {

                const locationsWithDevices: LocationWithDevices[] = await Promise.all(
                    baseLocations.map(async (location) => {
                        const devices = await fetchDeviceFromLocation(location.location_id);
                        const devicesWithSensors: Device[] = await Promise.all(
                            devices.map(async (device) => {
                                const sensors = await fetchComponentsFromDevice(device.device_id);
                                return { ...device, components: sensors || [] };
                            })
                        );
                        return { ...location, devices: devicesWithSensors };
                    })
                );

                const updatedSites: SiteWithLocationAndDevices[] = sites.map((site) => ({
                    ...site,
                    locations: locationsWithDevices.filter((loc) => loc.site_id === site.site_id),
                }));

                if (!isCancelled) setSitesWithLocations(updatedSites);
            } catch (err) {
                console.error("Error fetching devices/sensors:", err);
            } finally {
                if (!isCancelled) {}
            }
        };

        fetchDevicesAndSensors();
        return () => { isCancelled = true; };
    }, [baseLocations]);

    const handleLocationClick = (locationID: number) => {
        setExpandedlocationID(prev => prev === locationID ? null : locationID);
        setSelectedlocationID(prev => prev === locationID ? null : locationID);
        resetSelections();
    };

    const handleDeviceClick = (deviceID: string) => {
        setExpandeddeviceID(prev => prev === deviceID ? null : deviceID);
        setSelecteddeviceID(prev => prev === deviceID ? null : deviceID);
        setSelectedComponents([]);
        setSelectedMetric([]);
        setIsFetchTriggered(false);
    };

    const handleComponentChange = (component: Component) => {
        setSelectedComponents(prev =>
            prev.some((c) => c.component_id === component.component_id)
                ? prev.filter((c) => c.component_id !== component.component_id)
                : [...prev, component]
        );
        setSelectedMetric([]);
        setIsFetchTriggered(false);
    };

    const handleDeviceAndMetricClick = (deviceID: string, metric: 'current' | 'voltage' | 'power' | null) => {
        setSelecteddeviceID(deviceID);
        setSelectedComponents([]);
        setIsFetchTriggered(false);

        if (metric === null) {
            setSelectedMetric([]);
        } else {
            setSelectedMetric(prevMetrics =>
                prevMetrics.includes(metric) ? prevMetrics.filter(m => m !== metric) : [...prevMetrics, metric]
            );
        }
    };

    const handleSearchClick = () => {
        setIsFetchTriggered(true);
    };

    // useEffect to fetch data when the search is triggered
    useEffect(() => {
        if (!isFetchTriggered || !selecteddeviceID) {
            return;
        }

        if (selectedComponents.length > 0 && selectedMetric.length > 0) {
            console.warn("Both components and a metric are selected. This is not supported. Please choose one.");
            setIsFetchTriggered(false);
            return;
        }

        if (selectedMetric.length > 0) {
            getMetrics({
                device_id: selecteddeviceID,
                metric: selectedMetric,
                startTime: startTime || undefined,
                endTime: endTime || undefined,
                windowPeriod: selectedwindowPeriod,
            });
        } else if (selectedComponents.length > 0) {
            getSensorData({
                selectedlocationID: selectedlocationID!,
                selecteddeviceID: selecteddeviceID,
                selectedComponents: selectedComponents,
                startTime: startTime || undefined,
                endTime: endTime || undefined,
                windowPeriod: selectedwindowPeriod,
            });
        }

        setIsFetchTriggered(false);
    }, [isFetchTriggered, selecteddeviceID, selectedComponents, selectedMetric, startTime, endTime, selectedlocationID, getMetrics, getSensorData]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans antialiased">

            {/* Sidebar */}
            <aside
                className={`transform transition-transform duration-300 bg-white shadow-xl rounded-r-2xl p-6 overflow-y-auto ${
                    isMobile ? 'fixed inset-y-0 left-0 z-40 w-full ' + (isSidebarExplicitlyOpen ? 'translate-x-0' : '-translate-x-full') : 'relative w-80 translate-x-0'
                }`}
            >
                {isMobile && (
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Sélectionner</h2>
                        <button
                            onClick={() => setIsSidebarExplicitlyOpen(false)}
                            className="p-2 text-gray-600 rounded-full hover:bg-gray-200"
                        >
                            <X size={24} />
                        </button>
                    </div>
                )}
                {!isMobile &&  (
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                        Sélectionner
                    </h2>
                )}
                {baseLocations.length === 0 && (
                    <div className="bg-blue-50 rounded-xl p-4 text-blue-800 text-center font-medium shadow-sm text-sm mb-4">
                        <p className="text-base mb-2">Aucune localisation n'est encore disponible.</p>
                        <p>Veuillez d'abord créer des localisations et y ajouter des appareils.</p>
                    </div>
                )}
                <SelectionTree
                    sitesWithLocations={sitesWithLocations}
                    selectedlocationID={selectedlocationID}
                    selecteddeviceID={selecteddeviceID}
                    selectedComponents={selectedComponents}
                    expandedlocationID={expandedlocationID}
                    expandeddeviceID={expandeddeviceID}
                    onLocationClick={handleLocationClick}
                    onDeviceClick={handleDeviceClick}
                    onComponentChange={handleComponentChange}
                    selectedMetric={selectedMetric}
                    onDeviceAndMetricClick={handleDeviceAndMetricClick}
                />
            </aside>

            {/* Mobile Overlay */}
            {isMobile && isSidebarExplicitlyOpen && (
                <div
                    onClick={() => setIsSidebarExplicitlyOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-40 z-30"
                />
            )}

            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Historique de Monitoring
                    </h1>


                    { !selectedComponents.some(c => c.component_type !== 'sensor') && (
                    <div className="mt-6">
                        <DateTimeInputs
                            windowPeriod={selectedwindowPeriod}
                            startTime={startTime}
                            endTime={endTime}
                            onStartTimeChange={(e) => setStartTime(e.target.value)}
                            onEndTimeChange={(e) => setEndTime(e.target.value)}
                            onwindowPeriodChange={(e) => setSelectedwindowPeriod(e.target.value)}
                        />
                        <button
                            onClick={handleSearchClick}
                            className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-colors duration-200 ${
                                selecteddeviceID && (selectedComponents.length > 0 || selectedMetric.length > 0)
                                    ? 'bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={!selecteddeviceID || (selectedComponents.length === 0 && selectedMetric.length === 0)}
                        >
                            {influxLoading  ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                                    Chargement...
                                </span>
                            ) : (
                                "Rechercher les données"
                            )}
                        </button>
                    </div>
                    )}

                    {validationError && (
                        <div className="bg-red-100 text-red-800 rounded-xl p-4 font-medium border border-red-200 text-sm mt-8">
                            {validationError}
                        </div>
                    )}
                    {noInfluxData && (
                        <div className="bg-yellow-100 text-yellow-800 rounded-xl p-4 font-medium border border-yellow-200 text-sm mt-8">
                            Aucune donnée de monitoring trouvée pour la sélection et la période spécifiées.
                        </div>
                    )}

                    <div className="mt-8 space-y-4">
                        {!selectedlocationID  && (
                            <div className="bg-blue-50 rounded-xl p-4 text-blue-800 text-center font-medium shadow-sm text-sm">
                                <p className="text-base mb-2">Bienvenue sur l'historique de monitoring.</p>
                                <p>Pour commencer, veuillez sélectionner une localisation.</p>
                            </div>
                        )}
                        {selectedlocationID && !selecteddeviceID && (
                            <div className="bg-blue-50 rounded-xl p-4 text-blue-800 text-center font-medium shadow-sm text-sm">
                                <p>Veuillez sélectionner un appareil.</p>
                            </div>
                        )}
                        {selecteddeviceID && selectedComponents.length === 0 && selectedMetric.length === 0 && (
                            <div className="bg-blue-50 rounded-xl p-4 text-blue-800 text-center font-medium shadow-sm text-sm">
                                <p>Veuillez sélectionner au moins un capteur ou une métrique (courant, tension, puissance).</p>
                            </div>
                        )}
                    </div>

                    {/* GRAPHIQUE DES DONNÉES INFLUXDB */}
                    {influxData && influxData.length > 0 && (
                        <DataGraph
                            monitoringData={influxData}
                            selectedComponents={selectedComponents}
                        />
                    )}

                    {/* GRAPHIQUE DES STATISTIQUES DES COMPOSANTS */}
                    {selectedComponents.length > 0 && (
                        <div className="mt-8">
                            <ComponentStatsGraph components={selectedComponents} />
                        </div>
                    )}

                </div>

                {/* Hamburger menu for mobile only */}
                {isMobile && (
                    <button
                        onClick={() => setIsSidebarExplicitlyOpen(!isSidebarExplicitlyOpen)}
                        className="fixed bottom-4 right-4 z-50 p-3 bg-green-500 text-white rounded-full shadow-lg transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300"
                        aria-label="Open sidebar"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                )}
            </main>
        </div>
    );
};

export default History;
