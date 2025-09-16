import React, { useState, useEffect, useMemo } from "react";
import { createInfluxApi } from "../axios/api";
import SelectionTree from "../components/history/SelectionTree.tsx";
import DateTimeInputs from "../components/commun/DateTimeInputs.tsx";
import { Loader2, Menu, X } from "lucide-react";
import {
    LocationWithDevices,
    SiteWithLocationAndDevices,
} from "../components/types/location";
import {useSites} from "../components/hooks/useSite.tsx";
import {useDeviceApi} from "../components/hooks/useDevice.tsx";
import {useLocations} from "../components/hooks/useLocation.tsx";
import {useIsMobile} from "../components/hooks/useIsMobile.tsx";
import {Device} from "../components/types/device.ts";

const History: React.FC = () => {
    // --- Selection states ---
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    const [selectedSensorIds, setSelectedSensorIds] = useState<string[]>([]);
    const [selectedSensorTypes, setSelectedSensorTypes] = useState<string[]>([]);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    // --- Data states from hooks ---
    const { sites, loading: loadingSites, error: sitesError, fetchMySites } = useSites();
    const { loadingDevices, apiError: deviceApiError, fetchDeviceFromLocation, fetchDeviceSensors } = useDeviceApi();
    const { fetchLocationsBySiteIds, locations: baseLocations } = useLocations();

    const [sitesWithLocations, setSitesWithLocations] = useState<SiteWithLocationAndDevices[]>([]);
    const [monitoringData, setMonitoringData] = useState<Record<string, unknown> | null>(null);

    // --- Influx states ---
    const influxApi = useMemo(() => createInfluxApi(), []);
    const [influxLoading, setInfluxLoading] = useState(false);
    const [influxError, setInfluxError] = useState<Error | null>(null);
    const [noInfluxData, setNoInfluxData] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    // --- UI state ---
    const [expandedLocationId, setExpandedLocationId] = useState<number | null>(null);
    const [expandedDeviceId, setExpandedDeviceId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const isMobile = useIsMobile();
    const [isSidebarExplicitlyOpen, setIsSidebarExplicitlyOpen] = useState(false);

    useEffect(() => {
        if (!isMobile) setIsSidebarExplicitlyOpen(false);
    }, [isMobile]);

    // --- Helpers ---
    const resetSelections = () => {
        setSelectedDeviceId(null);
        setSelectedSensorIds([]);
        setSelectedSensorTypes([]);
        setStartTime("");
        setEndTime("");
        setMonitoringData(null);
        setNoInfluxData(false);
        setValidationError(null);
    };

    // --- Fetch data ---
    useEffect(() => { fetchMySites(); }, [fetchMySites]);

    useEffect(() => {
        if (!sites || sites.length === 0) return;
        fetchLocationsBySiteIds(sites.map((s) => s.site_id));
    }, [sites, fetchLocationsBySiteIds]);

    useEffect(() => {
        let isCancelled = false;

        const fetchDevicesAndSensors = async () => {
            if (!baseLocations || baseLocations.length === 0) return;

            try {
                setLoading(true);

                const locationsWithDevices: LocationWithDevices[] = await Promise.all(
                    baseLocations.map(async (location) => {
                        const devices = await fetchDeviceFromLocation(location.location_id);
                        const devicesWithSensors: Device[] = await Promise.all(
                            devices.map(async (device) => {
                                const sensors = await fetchDeviceSensors(device.device_id);
                                return { ...device, components: sensors || []};
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
                if (!isCancelled) setLoading(false);
            }
        };

        fetchDevicesAndSensors();
        return () => { isCancelled = true; };
    }, [baseLocations]);

    // --- Handlers ---
    const handleLocationClick = (locationId: number) => {
        setExpandedLocationId((prev) => (prev === locationId ? null : locationId));
        setSelectedLocationId((prev) => (prev === locationId ? null : locationId));
        resetSelections();
    };

    const handleDeviceClick = (deviceId: string) => {
        setExpandedDeviceId((prev) => (prev === deviceId ? null : deviceId));
        setSelectedDeviceId((prev) => (prev === deviceId ? null : deviceId));
        setSelectedSensorIds([]);
        setSelectedSensorTypes([]);
        setMonitoringData(null);
    };

    const handleSensorChange = (sensorId: string, sensorType: string) => {
        setMonitoringData(null);
        setNoInfluxData(false);
        setValidationError(null);

        setSelectedSensorIds((prev) =>
            prev.includes(sensorId) ? prev.filter((id) => id !== sensorId) : [...prev, sensorId]
        );

        setSelectedSensorTypes((prev) =>
            prev.includes(sensorType) ? prev.filter((type) => type !== sensorType) : [...prev, sensorType]
        );
    };

    const handleMonitor = async () => {
        if (!selectedLocationId || !selectedDeviceId || selectedSensorIds.length === 0) {
            setValidationError("Veuillez sélectionner une localisation, un appareil et au moins un capteur.");
            return;
        }

        setInfluxLoading(true);
        setInfluxError(null);
        setMonitoringData(null);
        setNoInfluxData(false);

        try {
            const queryParams = {
                locationId: selectedLocationId,
                deviceId: selectedDeviceId,
                sensorType: selectedSensorTypes,
                measurement: "sensor_data",
                timeRangeStart: startTime ? new Date(startTime).toISOString() : undefined,
                timeRangeStop: endTime ? new Date(endTime).toISOString() : undefined,
                windowPeriod: "10s",
            };

            const { data } = await influxApi.get("/query", { params: queryParams });

            if (data && Object.keys(data).length > 0) setMonitoringData(data);
            else setNoInfluxData(true);
        } catch (err: any) {
            setInfluxError(err);
            console.error("Error fetching data from InfluxDB:", err);
        } finally {
            setInfluxLoading(false);
        }
    };

    // --- Conditional renders ---
    if (loadingSites || loadingDevices || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="animate-spin h-10 w-10 text-green-500 mr-3" />
                <p className="text-gray-500 text-lg font-medium">Chargement des données...</p>
            </div>
        );
    }

    if (sitesError || deviceApiError) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-red-100 p-8">
                <div className="bg-white p-6 rounded-xl shadow-lg text-red-800">
                    <p className="font-semibold text-lg">Erreur de connexion</p>
                    <p className="text-sm mt-1">Impossible de charger les données. Veuillez vérifier votre connexion et réessayer.</p>
                    <p className="text-xs mt-2 text-gray-500">Détails de l'erreur: {sitesError || deviceApiError}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans antialiased">
            {/* Mobile Menu Button */}
            {isMobile && (
                <button
                    onClick={() => setIsSidebarExplicitlyOpen(true)}
                    className="fixed top-15 left-4 z-50 p-2 bg-white rounded-full shadow-md text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <Menu size={24} />
                </button>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:static inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 bg-white shadow-xl rounded-r-2xl p-6 overflow-y-auto
                    ${isMobile ? (isSidebarExplicitlyOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
                `}
            >
                {isMobile && (
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Sélectionner</h2>
                        <button
                            onClick={() => setIsSidebarExplicitlyOpen(false)}
                            className="p-2 text-gray-600 rounded-full hover:bg-gray-200"
                        >
                            <X size={24} />
                        </button>
                    </div>
                )}
                {!isMobile && (
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                        Sélectionner
                    </h2>
                )}
                <SelectionTree
                    sitesWithLocations={sitesWithLocations}
                    selectedLocationId={selectedLocationId}
                    selectedDeviceId={selectedDeviceId}
                    selectedSensorIds={selectedSensorIds}
                    expandedLocationId={expandedLocationId}
                    expandedDeviceId={expandedDeviceId}
                    onLocationClick={handleLocationClick}
                    onDeviceClick={handleDeviceClick}
                    onSensorChange={handleSensorChange}
                />
            </aside>

            {/* Mobile overlay */}
            {isMobile && isSidebarExplicitlyOpen && (
                <div
                    onClick={() => setIsSidebarExplicitlyOpen(!isSidebarExplicitlyOpen)}
                    className="fixed inset-0 bg-black bg-opacity-40 z-30"
                />
            )}

            {/* Main content */}
            <main className="flex-1 p-4 md:p-8">
                <div className="bg-white rounded-xl md:rounded-3xl shadow-lg p-6 md:p-8">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Historique de Monitoring
                    </h1>

                    <DateTimeInputs
                        startTime={startTime}
                        endTime={endTime}
                        onStartTimeChange={(e) => setStartTime(e.target.value)}
                        onEndTimeChange={(e) => setEndTime(e.target.value)}
                    />

                    {selectedLocationId && selectedDeviceId && selectedSensorIds.length > 0 && (
                        <button
                            onClick={handleMonitor}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md mt-6 flex items-center justify-center"
                            disabled={influxLoading}
                        >
                            {influxLoading ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                                    Chargement...
                                </>
                            ) : (
                                "Afficher les Données"
                            )}
                        </button>
                    )}

                    <div className="mt-8 space-y-4">
                        {validationError && (
                            <div className="bg-red-100 text-red-800 rounded-xl p-4 font-medium border border-red-200 text-sm">
                                {validationError}
                            </div>
                        )}
                        {influxError && (
                            <div className="bg-red-100 text-red-800 rounded-xl p-4 font-medium border border-red-200 text-sm">
                                Erreur lors de la récupération des données d'InfluxDB: {influxError.message}
                            </div>
                        )}
                        {noInfluxData && (
                            <div className="bg-yellow-100 text-yellow-800 rounded-xl p-4 font-medium border border-yellow-200 text-sm">
                                Aucune donnée de monitoring trouvée pour la sélection et la période spécifiées.
                            </div>
                        )}

                        {!selectedLocationId && !sitesError && (
                            <div className="bg-blue-50 rounded-xl p-4 text-blue-800 text-center font-medium shadow-sm text-sm">
                                <p className="text-base mb-2">Bienvenue sur l'historique de monitoring.</p>
                                <p>Pour commencer, veuillez sélectionner une localisation.</p>
                            </div>
                        )}
                        {selectedLocationId && !selectedDeviceId && (
                            <div className="bg-blue-50 rounded-xl p-4 text-blue-800 text-center font-medium shadow-sm text-sm">
                                <p>Veuillez sélectionner un appareil.</p>
                            </div>
                        )}
                        {selectedDeviceId && selectedSensorIds.length === 0 && (
                            <div className="bg-blue-50 rounded-xl p-4 text-blue-800 text-center font-medium shadow-sm text-sm">
                                <p>Veuillez sélectionner au moins un capteur.</p>
                            </div>
                        )}
                    </div>

                    {monitoringData && Object.keys(monitoringData).length > 0 && (
                        <div className="bg-gray-50 rounded-xl shadow-inner p-4 md:p-6 mt-8">
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">Données de Monitoring</h2>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default History;
