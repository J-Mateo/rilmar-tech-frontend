import { configureStore } from '@reduxjs/toolkit';

import apiClient from '../api/axios';

import authReducer, {
  sessionExpired,
} from './slices/authSlice';

import cartReducer, {
  resetCart,
} from './slices/cartSlice';

import wishlistReducer, {
  clearWishlist,
} from './slices/wishlistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const state = store.getState();

    if (
      error?.status === 401 &&
      state.auth.isAuthenticated
    ) {
      store.dispatch(sessionExpired());
      store.dispatch(resetCart());
      store.dispatch(clearWishlist());
    }

    return Promise.reject(error);
  }
);