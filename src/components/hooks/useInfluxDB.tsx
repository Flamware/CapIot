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
    const [error, setError] = useState<any>(null);
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
        setError(null);
        setMonitoringData(null);
        setNoData(false);
        setValidationError(null);

        try {
            // Corrected URL construction to match the Go server's path variables
            const url = `/sensordata/${selecteddeviceID}/${selectedlocationID}`;

            const queryParams = {
                sensorType: selectedComponents.map((comp) => comp.component_subtype),
                measurement: "sensor_data",
                timeRangeStart: startTime ? new Date(startTime).toISOString() : undefined,
                timeRangeStop: endTime ? new Date(endTime).toISOString() : undefined,
                windowPeriod: "10s",
            };

            const { data } = await influxApi.get(url, { params: queryParams });

            if (data && Array.isArray(data) && data.length > 0) {
                setMonitoringData(data as DeviceReadings[]);
            } else {
                setNoData(true);
            }
        } catch (err: any) {
            setError(err);
            console.error("Error fetching data from InfluxDB:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getMetrics = useCallback(async (params: GetMetricData) => {
        const { device_id, metric, startTime, endTime } = params;

        // Use URLSearchParams to build the query string correctly
        const queryParams = new URLSearchParams();

        // Append device_id
        if (device_id) {
            queryParams.append('deviceID', device_id);
        }

        // Append each metric individually
        if (metric && Array.isArray(metric)) {
            metric.forEach(m => {
                queryParams.append('metric', m);
            });
        }

        // Append time range parameters
        if (startTime) {
            queryParams.append('time_range_start', new Date(startTime).toISOString());
        }
        if (endTime) {
            queryParams.append('time_range_stop', new Date(endTime).toISOString());
        }

        try {
            const url = `/metrics?${queryParams.toString()}`;
            console.log("Fetching metrics from URL:", url);

            // Pass the constructed URL directly to the get method
            const { data } = await influxApi.get(url);

            console.log("Metrics data received:", data);
            setMonitoringData(data as DeviceReadings[]);
            return data as DeviceReadings[];
        } catch (err) {
            console.error("Error fetching metrics from InfluxDB:", err);
            throw err;
        }
    }, []);
    return {
        monitoringData,
        loading,
        error,
        validationError,
        noData,
        getSensorData,
        getMetrics
    };
};
