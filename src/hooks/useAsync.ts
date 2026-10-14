import { useEffect, useState, type DependencyList } from 'react';

export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList) {
  const key = JSON.stringify(deps);
  const [result, setResult] = useState<{ key: string; data: T } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fn().then((data) => {
      if (!cancelled) setResult({ key, data });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data: result?.data, loading: result?.key !== key };
}
