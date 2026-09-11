import apiClient from './axios';

export const getOrdersApi = async () => {
  const response =
    await apiClient.get('/orders');

  return response.data;
};

export const getOrderByIdApi = async (
  orderId
) => {
  const response =
    await apiClient.get(
      `/orders/${orderId}`
    );

  return response.data;
};

export const getAdminOrdersApi = async (
  params = {},
  options = {}
) => {
  const response =
    await apiClient.get(
      '/orders/admin',
      {
        params,
        ...options,
      }
    );

  return response.data;
};