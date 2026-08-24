import { useState, useEffect } from 'react';
import { getProductById } from '../api/products.api';

export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    setLoading(true);
    setError(null);

    getProductById(id, { signal: controller.signal })
      .then((data) => {
        setProduct(data.data || data);
      })
      .catch((err) => {
        if (err.name !== 'CanceledError') {
          setError(err.message || 'Error al cargar el producto');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id]);

  return { product, loading, error };
};

export default useProduct;