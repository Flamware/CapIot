// Handles both build-time and runtime environments
const runtimeEnv = {
    apiUrl:
        (window as any).__ENV__?.VITE_API_URL ??
        import.meta.env.VITE_API_URL ??
        "http://localhost:5173/api", // optional fallback
    influxUrl:
        (window as any).__ENV__?.VITE_INFLUXDB_URL ??
        import.meta.env.VITE_INFLUXDB_URL ??
        "http://localhost:8086/influxdb",
};

export default runtimeEnv;
