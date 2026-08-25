import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { getProducts } from '../api/products.api';

export const useProducts = (params = {}) => {
  const [state, setState] = useState({
    products: [],
    loading: true,
    error: null,
  });

  const activeControllerRef = useRef(null);
  const requestIdRef = useRef(0);

  const executeRequest = useCallback(
    async ({ signal, requestId }) => {
      try {
        const response = await getProducts(params, {
          signal,
        });

        if (
          signal.aborted ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        setState({
          products: Array.isArray(response.data)
            ? response.data
            : [],
          loading: false,
          error: null,
        });
      } catch (error) {
        if (
          error?.code === 'REQUEST_CANCELED' ||
          signal.aborted ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        setState({
          products: [],
          loading: false,
          error:
            error?.message ||
            'No se han podido cargar los productos',
        });
      }
    },
    [params]
  );

  const fetchProducts = useCallback(() => {
    activeControllerRef.current?.abort();

    const controller = new AbortController();
    const requestId = ++requestIdRef.current;

    activeControllerRef.current = controller;

    executeRequest({
      signal: controller.signal,
      requestId,
    });
  }, [executeRequest]);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++requestIdRef.current;

    activeControllerRef.current = controller;

    executeRequest({
      signal: controller.signal,
      requestId,
    });

    return () => {
      controller.abort();
    };
  }, [executeRequest]);

  const refetch = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products: state.products,
    loading: state.loading,
    error: state.error,
    refetch,
  };
};

export default useProducts;