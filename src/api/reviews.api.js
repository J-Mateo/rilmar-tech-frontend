import api from './axios';

export const getReviewsByProductId = async (productId, options = {}) => {
    const response = await api.get(`/products/${productId}/reviews`, {
        signal: options.signal,
    });
    return response.data;
};

export const createReview = async (productId, reviewData) => {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
};