import { useState, useEffect } from 'react';

interface ApiOptions<T> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
}

export function useApi<T>({
  url,
  method = 'GET',
  body,
  initialData,
  onSuccess,
  onError,
  immediate = true,
}: ApiOptions<T>) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Função para fazer a requisição
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Executar a requisição imediatamente se immediate for true
  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [url]);

  return { data, loading, error, fetchData, setData };
}