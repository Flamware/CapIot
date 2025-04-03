interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_DEBUG_MODE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}