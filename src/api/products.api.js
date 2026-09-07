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

/*
 * =========================================================
 * ADMIN PRODUCTOS
 * =========================================================
 */

export const getAdminProducts = async (
  params = {},
  options = {}
) => {
  const response =
    await apiClient.get(
      '/products/admin',
      {
        params,
        signal:
          options.signal,
      }
    );

  return response.data;
};

export const getAdminProductById = async (
  id,
  options = {}
) => {
  const response =
    await apiClient.get(
      `/products/admin/${id}`,
      {
        signal:
          options.signal,
      }
    );

  return response.data;
};

export const createProductApi = async (
  formData
) => {
  const response =
    await apiClient.post(
      '/products',
      formData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data',
        },
      }
    );

  return response.data;
};

export const updateProductApi = async (
  productId,
  formData
) => {
  const response =
    await apiClient.put(
      `/products/${productId}`,
      formData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data',
        },
      }
    );

  return response.data;
};

export const deactivateProductApi = async (
  productId
) => {
  const response =
    await apiClient.delete(
      `/products/${productId}`
    );

  return response.data;
};

export const restoreProductApi = async (
  productId
) => {
  const response =
    await apiClient.patch(
      `/products/${productId}/restore`
    );

  return response.data;
};