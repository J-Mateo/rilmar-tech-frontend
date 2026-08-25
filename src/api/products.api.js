import apiClient from './axios';

export const getProducts = async (params = {}, options = {}) => {
  const response = await apiClient.get('/products', {
    params,
    signal: options.signal,
  });

  return response.data;
};

export const getProductById = async (id, options = {}) => {
  const response = await apiClient.get(`/products/${id}`, {
    signal: options.signal,
  });

  return response.data;
};