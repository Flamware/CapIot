export const runtimeEnv = {
    apiUrl: window.__ENV__?.VITE_API_URL ?? import.meta.env.VITE_API_URL,
    influxUrl: window.__ENV__?.VITE_INFLUXDB_URL ?? import.meta.env.VITE_INFLUXDB_URL
};
