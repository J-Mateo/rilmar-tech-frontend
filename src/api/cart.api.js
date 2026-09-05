import apiClient from './axios';

export const getCartApi = async () => {
  const response =
    await apiClient.get('/cart');

  return response.data;
};

export const addCartItemApi = async ({
  productId,
  quantity = 1,
}) => {
  const response =
    await apiClient.post(
      '/cart/items',
      {
        productId,
        quantity,
      }
    );

  return response.data;
};

export const updateCartItemQuantityApi = async ({
  itemId,
  quantity,
}) => {
  const response =
    await apiClient.patch(
      `/cart/items/${itemId}`,
      {
        quantity,
      }
    );

  return response.data;
};

export const removeCartItemApi = async (
  itemId
) => {
  const response =
    await apiClient.delete(
      `/cart/items/${itemId}`
    );

  return response.data;
};

export const checkoutApi = async () => {
  const response =
    await apiClient.post(
      '/cart/checkout'
    );

  return response.data;
};

export const buyNowApi = async ({
  productId,
  quantity = 1,
}) => {
  const response =
    await apiClient.post(
      '/cart/buy-now',
      {
        productId,
        quantity,
      }
    );

  return response.data;
};