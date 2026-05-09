/* 
import { useState, useEffect } from 'react';
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
    }
});

const useCustomFetch = <T>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                const response = await axiosInstance.get(url);
                setData(response.data);
            } catch (error) {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [url]);

    return { data, isLoading, isError };
};

export default useCustomFetch;
 */