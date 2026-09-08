import apiClient from './axios';

export const getCheckoutOrderApi =
  async (
    sessionId
  ) => {
    const response =
      await apiClient.get(
        `/payments/checkout-session/${encodeURIComponent(
          sessionId
        )}`
      );

    return response.data;
  };