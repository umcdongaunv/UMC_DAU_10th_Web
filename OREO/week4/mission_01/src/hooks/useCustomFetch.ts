import { useEffect, useState } from "react";
import axios from "axios";

interface UseCustomFetchResult<T> {
  data: T | null;
  isPending: boolean;
  isError: boolean;
}

/**
 * TMDB API 데이터를 패칭하는 커스텀 훅
 * - url이 변경되면 자동으로 재요청
 * - 데이터, 로딩 상태, 에러 상태를 반환
 */
export function useCustomFetch<T>(url: string): UseCustomFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      try {
        const { data: responseData } = await axios.get<T>(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          },
        });
        setData(responseData);
        setIsError(false);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    if (url) fetchData();
  }, [url]);

  return { data, isPending, isError };
}
