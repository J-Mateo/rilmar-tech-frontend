import apiClient from './axios';

export const getReviewsByProductId = async (productId, options = {}) => {
    const response = await apiClient.get(`/products/${productId}/reviews`, {
        signal: options.signal,
    });
    return response.data;
};

export const createReview = async (productId, reviewData) => {
    const response = await apiClient.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
};