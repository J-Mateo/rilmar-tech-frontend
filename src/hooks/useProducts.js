import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { getProducts } from '../api/products.api';

const EMPTY_PARAMS = {};

export const useProducts = (params = EMPTY_PARAMS) => {
  const [state, setState] = useState({
    products: [],
    loading: true,
    refreshing: false,
    error: null,
    hasLoaded: false,
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
          refreshing: false,
          error: null,
          hasLoaded: true,
        });
      } catch (error) {
        if (
          error?.code === 'REQUEST_CANCELED' ||
          signal.aborted ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        setState((currentState) => ({
          ...currentState,
          loading: false,
          refreshing: false,
          error:
            error?.message ||
            'No se han podido cargar los productos',
          hasLoaded: true,
        }));
      }
    },
    [params]
  );

  const fetchProducts = useCallback(() => {
    activeControllerRef.current?.abort();

    const controller = new AbortController();
    const requestId = ++requestIdRef.current;

    activeControllerRef.current = controller;

    setState((currentState) => ({
      ...currentState,
      loading: !currentState.hasLoaded,
      refreshing: currentState.hasLoaded,
      error: null,
    }));

    executeRequest({
      signal: controller.signal,
      requestId,
    });
  }, [executeRequest]);

  useEffect(() => {
    fetchProducts();

    return () => {
      activeControllerRef.current?.abort();
    };
  }, [fetchProducts]);

  return {
    products: state.products,
    loading: state.loading,
    refreshing: state.refreshing,
    error: state.error,
    refetch: fetchProducts,
  };
};

export default useProducts;