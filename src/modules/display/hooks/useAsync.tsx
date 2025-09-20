import { useState, useCallback, useEffect, useRef } from "react";

// Inspired by https://medium.com/@sergeyleschev/react-custom-hook-useasync-8fe13f4d4032
export function useAsync<Fn extends (...args: any[]) => Promise<any>>(
  fn: Fn,
  onMount?: boolean,
  defaultArgs?: Parameters<Fn>
) {
  const [data, setData] = useState<Awaited<ReturnType<Fn>> | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const argsRef = useRef(defaultArgs);

  const run = useCallback(
    async (...args: Parameters<Fn>): Promise<Awaited<ReturnType<Fn>>> => {
      setLoading(true);
      setError(null);
      try {
        const result = await fn(...args);
        setData(result);
        return result;
      } catch (err: any) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  useEffect(() => {
    if (onMount && argsRef.current) {
      run(...argsRef.current);
    }
  }, [onMount, run]);

  return { data, error, loading, run };
}
