import { useState, useEffect } from 'react';

interface FetchResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    fetchData: (...args: any[]) => Promise<void>;
}

function useFetch<T>(fetchFn: (...args: any[]) => Promise<T>, initialData: T | null = null, dependencies: any[] = []): FetchResult<T> {
    const [data, setData] = useState<T | null>(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (...args: any[]) => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchFn(...args);
            setData(result);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to fetch data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    return { data, loading, error, fetchData };
}

export default useFetch;