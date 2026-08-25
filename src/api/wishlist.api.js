import apiClient from './axios';

export const getWishlistApi = async () => {
    const response = await apiClient.get('/wishlist');

    return response.data;
};

export const toggleWishlistProductApi = async (productId) => {
    const response = await apiClient.post(`/wishlist/${productId}`);

    return response.data;
};