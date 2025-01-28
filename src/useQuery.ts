import { useEffect, useState } from 'react';

type CacheData<T> = {
  data: T;
  timestamp: number;
};

const queryCache = new Map<string, CacheData<unknown>>();

type UseQueryProps<T = unknown> = {
  queryKey: string;
  queryFn: () => T | Promise<T>;
  retry?: boolean | number;
  cache?: boolean;
  cacheTime?: number;
};

export function useQuery<TData = unknown, TError = unknown>({
  queryKey,
  queryFn,
  retry = 3,
  cache = true,
  cacheTime = 5 * 60 * 1000,
}: UseQueryProps<TData>) {
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<TError | null>(null);
  const [data, setData] = useState<TData | null>(() => {
    console.log('Initial state setup time:', Date.now());
    if (!cache) return null;
    
    const cachedData = queryCache.get(queryKey) as CacheData<TData> | undefined;
    if (!cachedData) return null;
    
    const isExpired = Date.now() - cachedData.timestamp > cacheTime;
    return isExpired ? null : cachedData.data;
  });

  useEffect(() => {
    let isActive = true;
    let failureCount = 0;
    
    if (!cache) {
      queryCache.delete(queryKey);
    }


    const cachedData = queryCache.get(queryKey) as CacheData<TData> | undefined;
    console.log('Effect execution time:', Date.now());
    const isExpired = cachedData 
      ? Date.now() - cachedData.timestamp > cacheTime
      : true;

    if (cache && cachedData && !isExpired) {
      setData(cachedData.data);
      setIsPending(false);
      return;
    }

    const executeQuery = async () => {
      try {
        const result = await queryFn();
        if (!isActive) return;
        
        if (cache) {
          queryCache.set(queryKey, {
            data: result,
            timestamp: Date.now(),
          });                 
        }
        setData(result);
        setIsPending(false);
      } catch (err) {
        if (!isActive) return;

        const shouldRetry = retry === true || 
          (typeof retry === 'number' && failureCount < retry);

        if (shouldRetry) {
          failureCount++;
          executeQuery();
        } else {
          setError(err as TError);
          setIsPending(false);
        }
      }
    };

    setIsPending(true);
    executeQuery();
    
    return () => {
      isActive = false;
    };
  }, [queryKey, retry, cache, cacheTime]);

  return { isPending, error, data };
}