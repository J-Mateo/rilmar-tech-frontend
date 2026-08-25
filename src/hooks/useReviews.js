import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { getReviewsByProductId } from '../api/reviews.api';

export const useReviews = (productId) => {
  const [state, setState] = useState({
    reviews: [],
    loading: Boolean(productId),
    error: null,
  });

  const activeControllerRef = useRef(null);
  const requestIdRef = useRef(0);

  const executeRequest = useCallback(
    async ({ signal, requestId }) => {
      if (!productId) {
        return;
      }

      try {
        const response =
          await getReviewsByProductId(
            productId,
            { signal }
          );

        if (
          signal.aborted ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        const reviews = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];

        setState({
          reviews,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (
          error?.code === 'REQUEST_CANCELED' ||
          error?.name === 'CanceledError' ||
          error?.name === 'AbortError' ||
          signal.aborted ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        setState({
          reviews: [],
          loading: false,
          error:
            error?.message ||
            'No se han podido cargar las reseñas',
        });
      }
    },
    [productId]
  );

  const fetchReviews = useCallback(() => {
    if (!productId) {
      return;
    }

    activeControllerRef.current?.abort();

    const controller = new AbortController();
    const requestId = ++requestIdRef.current;

    activeControllerRef.current = controller;

    executeRequest({
      signal: controller.signal,
      requestId,
    });
  }, [executeRequest, productId]);

  useEffect(() => {
    if (!productId) {
      return undefined;
    }

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
  }, [executeRequest, productId]);

  return {
    reviews: state.reviews,
    loading: state.loading,
    error: state.error,
    refetch: fetchReviews,
  };
};

export default useReviews;