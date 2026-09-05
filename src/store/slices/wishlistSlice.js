import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

import {
  getWishlistApi,
  toggleWishlistProductApi,
} from '../../api/wishlist.api';

import { logoutUser } from './authSlice';

const getErrorPayload = (
  error,
  fallbackMessage
) => ({
  message:
    error?.message ||
    fallbackMessage,

  status:
    error?.status ?? null,

  code:
    error?.code || null,
});

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',

  async (_, { rejectWithValue }) => {
    try {
      const response = await getWishlistApi();

      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorPayload(
          error,
          'No se ha podido cargar la lista de deseos'
        )
      );
    }
  },

  {
    condition: (_, { getState }) => {
      const {
        initialized,
        loading,
      } = getState().wishlist;

      return !initialized && !loading;
    },
  }
);

export const toggleWishlistProduct = createAsyncThunk(
  'wishlist/toggleWishlistProduct',

  async (
    productId,
    { rejectWithValue }
  ) => {
    try {
      const response =
        await toggleWishlistProductApi(
          productId
        );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorPayload(
          error,
          'No se ha podido actualizar la lista de deseos'
        )
      );
    }
  }
);

const initialState = {
  productIds: [],
  loading: false,
  togglingProductId: null,
  initialized: false,
  error: null,
  errorCode: null,
};

const createInitialState = () => ({
  ...initialState,
  productIds: [],
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,

  reducers: {
    clearWishlist: () => createInitialState(),

    clearWishlistError: (state) => {
      state.error = null;
      state.errorCode = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.errorCode = null;
      })

      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;

        state.productIds = Array.isArray(
          action.payload?.productIds
        )
          ? action.payload.productIds.map(String)
          : [];

        state.error = null;
        state.errorCode = null;
      })

      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;

        state.error =
          action.payload?.message ||
          'No se ha podido cargar la lista de deseos';

        state.errorCode =
          action.payload?.code || null;
      })

      .addCase(
        toggleWishlistProduct.pending,
        (state, action) => {
          state.togglingProductId = String(
            action.meta.arg
          );

          state.error = null;
          state.errorCode = null;
        }
      )

      .addCase(
        toggleWishlistProduct.fulfilled,
        (state, action) => {
          state.togglingProductId = null;
          state.initialized = true;

          state.productIds = Array.isArray(
            action.payload?.productIds
          )
            ? action.payload.productIds.map(String)
            : [];

          state.error = null;
          state.errorCode = null;
        }
      )

      .addCase(
        toggleWishlistProduct.rejected,
        (state, action) => {
          state.togglingProductId = null;

          state.error =
            action.payload?.message ||
            'No se ha podido actualizar la lista de deseos';

          state.errorCode =
            action.payload?.code || null;
        }
      )

      .addCase(
        logoutUser.fulfilled,
        () => createInitialState()
      );
  },
});

export const {
  clearWishlist,
  clearWishlistError,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;