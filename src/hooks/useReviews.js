import { useState, useEffect, useCallback } from 'react';
import { getReviewsByProductId } from '../api/reviews.api';

export const useReviews = (productId) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReviews = useCallback(async (signal) => {
        if (!productId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await getReviewsByProductId(productId, { signal });
            setReviews(response.data || response);
        } catch (err) {
            if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
                setError(err.message || 'Error al cargar las reseñas');
            }
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        const controller = new AbortController();
        fetchReviews(controller.signal);

        return () => controller.abort();
    }, [fetchReviews]);

    return { reviews, loading, error, refetch: fetchReviews };
};