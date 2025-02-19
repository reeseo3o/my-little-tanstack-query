import { useEffect, useState } from 'react';

type CacheData<T> = {
  data: T;
  timestamp: number;
  staleTimestamp: number;
};

const queryCache = new Map<string, CacheData<unknown>>();

type UseQueryProps<T = unknown> = {
  queryKey: string;
  queryFn: () => T | Promise<T>;
  retry?: boolean | number;
  cache?: boolean;
  cacheTime?: number;
  staleTime?: number;
};

export function useQuery<TData = unknown, TError = unknown>({
  queryKey,
  queryFn,
  retry = 3,
  cache = true,
  cacheTime = 5 * 60 * 1000,
  staleTime = 0,
}: UseQueryProps<TData>) {
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<TError | null>(null);
  const [data, setData] = useState<TData | null>(() => {

    if (!cache) return null;
    
    const cachedData = queryCache.get(queryKey) as CacheData<TData> | undefined;
    if (!cachedData) {

      return null;
    }
    
    const now = Date.now();
    const timeSinceCache = now - cachedData.timestamp;


    
    const isExpired = timeSinceCache > cacheTime;
    if (isExpired) {
      return null;
    } else {
      return cachedData.data;
    }
  });

  useEffect(() => {
    let isActive = true;
    let failureCount = 0;
    
    if (!cache) {

      queryCache.delete(queryKey);
    }

    const cachedData = queryCache.get(queryKey) as CacheData<TData> | undefined;
    const now = Date.now();
    const isExpired = cachedData ? now - cachedData.timestamp > cacheTime : true;
    const isStale = cachedData ? now - cachedData.staleTimestamp > staleTime : true;






    



    if (cache && cachedData && !isExpired && !isStale) {
      setData(cachedData.data);
      setIsPending(false);
      return;
    }

    if (cache && cachedData && !isExpired && isStale) {
      setData(cachedData.data);
      setIsPending(false);
    }

    const executeQuery = async () => {
      try {
        const result = await queryFn();
        if (!isActive) return;
        
        if (cache) {
          queryCache.set(queryKey, {
            data: result,
            timestamp: Date.now(),
            staleTimestamp: Date.now(),
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

    if (isStale || !cachedData) {
      if (!cachedData) setIsPending(true);
      executeQuery();
    }
    
    return () => {
      isActive = false;
    };
  }, [queryKey, retry, cache, cacheTime, staleTime]);

  return { isPending, error, data };
}