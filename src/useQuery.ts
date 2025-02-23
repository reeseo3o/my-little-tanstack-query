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
      console.log(`[${queryKey}] 캐시된 데이터가 없습니다.`);
      return null;
    }
    
    const now = Date.now();
    const timeSinceCache = now - cachedData.timestamp;
    const isExpired = timeSinceCache > cacheTime;
    
    if (isExpired) {
      console.log(`[${queryKey}] 캐시가 만료되었습니다. (${timeSinceCache}ms)`);
      return null;
    } else {
      console.log(`[${queryKey}] 캐시된 데이터를 사용합니다.`);
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
      console.log(`[${queryKey}] 데이터가 신선합니다. 재요청하지 않습니다.`);
      setData(cachedData.data);
      setIsPending(false);
      return;
    }

    if (cache && cachedData && !isExpired && isStale) {
      console.log(`[${queryKey}] 데이터가 오래되었습니다. 백그라운드에서 갱신합니다.`);
      setData(cachedData.data);
      setIsPending(false);
    }

    const executeQuery = async () => {
      try {
        console.log(`[${queryKey}] 데이터를 가져오는 중...`);
        const result = await queryFn();
        if (!isActive) return;
        
        if (cache) {
          console.log(`[${queryKey}] 새로운 데이터를 캐시에 저장합니다.`);
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
          console.log(`[${queryKey}] 요청 실패. 재시도 중... (${failureCount + 1}/${retry})`);
          failureCount++;
          executeQuery();
        } else {
          console.error(`[${queryKey}] 최종 실패:`, err);
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