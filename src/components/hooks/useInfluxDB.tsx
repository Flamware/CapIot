import {useState, useCallback} from "react";
import {Component, DeviceReadings} from "../types/device.ts";
import {createInfluxApi} from "../../axios/api.tsx";

interface GetSensorDataParams {
    selectedlocationID: number | null;
    selecteddeviceID: string | null;
    selectedComponents: Component[];
    startTime?: string;
    endTime?: string;
}
interface GetMetricData {
    device_id: string;
    metric: string[];
    startTime?: string;
    endTime?: string;
}

export const useInfluxDB = () => {
    const [monitoringData, setMonitoringData] = useState<DeviceReadings[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [noData, setNoData] = useState(false);
    const influxApi = createInfluxApi();

    const getSensorData = useCallback(async (params: GetSensorDataParams) => {
        const { selectedlocationID, selecteddeviceID, selectedComponents, startTime, endTime } = params;

        if (!selectedlocationID || !selecteddeviceID || selectedComponents.length === 0) {
            setValidationError("Veuillez sélectionner une localisation, un appareil et au moins un composant.");
            return;
        }

        setLoading(true);
        setMonitoringData(null);
        setNoData(false);
        setValidationError(null);

        try {
            // Use URLSearchParams to build the query string correctly
            const queryParams = new URLSearchParams();

            // Append each parameter to the query string
            if (selectedlocationID) {
                queryParams.append('location_id', selectedlocationID.toString());
            }
            if (selecteddeviceID) {
                queryParams.append('device_id', selecteddeviceID);
            }
            if (selectedComponents && selectedComponents.length > 0) {
                selectedComponents.forEach(comp => {
                    queryParams.append('sensor_type', comp.component_subtype || '');
                });
            }
            if (startTime) {
                queryParams.append('time_range_start', new Date(startTime).toISOString());
            }
            if (endTime) {
                queryParams.append('time_range_stop', new Date(endTime).toISOString());
            }
            queryParams.append('window_period', "10s");

            // Construct the URL with query parameters
            const url = `/sensordata?${queryParams.toString()}`;

            // Make the GET request without a payload
            const { data } = await influxApi.get(url);

            if (data && Array.isArray(data) && data.length > 0) {
                setMonitoringData(data as DeviceReadings[]);
            } else {
                setNoData(true);
            }
        } catch (err: any) {
            console.error("Error fetching data from InfluxDB:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getMetrics = useCallback(async (params: GetMetricData) => {
        const { device_id, metric, startTime, endTime } = params;

        // Check if device_id is provided
        if (!device_id || metric.length === 0) {
            console.error("Device ID and metrics are required.");
            throw new Error("Device ID and metrics are required.");
        }

        setLoading(true);
        setMonitoringData(null);
        setNoData(false);
        setValidationError(null);

        try {
            // Use URLSearchParams to build the query string correctly
            const queryParams = new URLSearchParams();

            // Append each parameter to the query string
            queryParams.append('device_id', device_id);
            metric.forEach(m => {
                queryParams.append('metric', m);
            });
            if (startTime) {
                queryParams.append('time_range_start', new Date(startTime).toISOString());
            }
            if (endTime) {
                queryParams.append('time_range_stop', new Date(endTime).toISOString());
            }

            // Construct the URL with query parameters
            const url = `/metrics?${queryParams.toString()}`;

            console.log("Fetching metrics from URL:", url);

            // Make the GET request without a payload
            const { data } = await influxApi.get(url);

            console.log("Metrics data received:", data);
            setMonitoringData(data as DeviceReadings[]);
            return data as DeviceReadings[];
        } catch (err) {
            console.error("Error fetching metrics from InfluxDB:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);
    return {
        monitoringData,
        loading,
        validationError,
        noData,
        getSensorData,
        getMetrics
    };
};
