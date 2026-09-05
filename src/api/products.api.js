import apiClient from './axios';

/*
 * =========================================================
 * PRODUCTOS
 * =========================================================
 */

export const getProducts = async (
  params = {},
  options = {}
) => {
  const response =
    await apiClient.get(
      '/products',
      {
        params,
        signal:
          options.signal,
      }
    );

  return response.data;
};

export const getProductById = async (
  id,
  options = {}
) => {
  const response =
    await apiClient.get(
      `/products/${id}`,
      {
        signal:
          options.signal,
      }
    );

  return response.data;
};

/*
 * =========================================================
 * ALERTAS DE REPOSICIÓN
 * =========================================================
 */

export const getRestockAlertApi = async (
  productId
) => {
  const response =
    await apiClient.get(
      `/products/${productId}/restock-alert`
    );

  return response.data;
};

export const subscribeRestockAlertApi =
  async (productId) => {
    const response =
      await apiClient.post(
        `/products/${productId}/restock-alert`
      );

    return response.data;
  };

export const cancelRestockAlertApi =
  async (productId) => {
    const response =
      await apiClient.delete(
        `/products/${productId}/restock-alert`
      );

    return response.data;
  };