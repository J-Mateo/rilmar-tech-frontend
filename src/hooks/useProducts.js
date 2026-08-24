import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../api/products.api';

export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback((signal) => {
    setLoading(true);
    setError(null);

    getProducts(params, { signal })
      .then((data) => {
        setProducts(data.data || data);
      })
      .catch((err) => {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError(err.message || 'Error al cargar los productos');
        }
      })
      .finally(() => {
        if (!signal?.aborted) {
          setLoading(false);
        }
      });
  }, [params]);

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);

    return () => controller.abort();
  }, [fetchProducts]);

  const refetch = useCallback(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);
  }, [fetchProducts]);

  return { products, loading, error, refetch };
};

export default useProducts;