import { useEffect, useRef, useState } from 'react';
import { getProductById } from '../api/products.api';

export const useProduct = (id) => {
  const [state, setState] = useState({
    product: null,
    loading: Boolean(id),
    error: id ? null : 'Identificador de producto no válido',
  });

  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!id) {
      return undefined;
    }

    const controller = new AbortController();
    const requestId = ++requestIdRef.current;

    const fetchProduct = async () => {
      try {
        const response = await getProductById(id, {
          signal: controller.signal,
        });

        if (
          controller.signal.aborted ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        setState({
          product: response.data ?? null,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (
          error?.code === 'REQUEST_CANCELED' ||
          controller.signal.aborted ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        setState({
          product: null,
          loading: false,
          error:
            error?.message ||
            'No se ha podido cargar el producto',
        });
      }
    };

    fetchProduct();

    return () => {
      controller.abort();
    };
  }, [id]);

  return state;
};

export default useProduct;