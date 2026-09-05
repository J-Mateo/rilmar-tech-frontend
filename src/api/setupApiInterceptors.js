import apiClient from './axios';

import {
  sessionExpired,
} from '../store/slices/authSlice';

import {
  resetCart,
} from '../store/slices/cartSlice';

import {
  clearWishlist,
} from '../store/slices/wishlistSlice';

export const setupApiInterceptors = (store) => {
  const responseInterceptor =
    apiClient.interceptors.response.use(
      (response) => response,

      (error) => {
        const state = store.getState();

        if (
          error?.status === 401 &&
          state.auth.isAuthenticated
        ) {
          store.dispatch(
            sessionExpired()
          );

          store.dispatch(
            resetCart()
          );

          store.dispatch(
            clearWishlist()
          );
        }

        return Promise.reject(
          error
        );
      }
    );

  return () => {
    apiClient.interceptors.response.eject(
      responseInterceptor
    );
  };
};