import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

import {
  getWishlistApi,
  toggleWishlistProductApi,
} from '../../api/wishlist.api';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getWishlistApi();

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const toggleWishlistProduct = createAsyncThunk(
  'wishlist/toggleWishlistProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await toggleWishlistProductApi(productId);

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  productIds: [],
  loading: false,
  initialized: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,

  reducers: {
    clearWishlist: (state) => {
      state.productIds = [];
      state.loading = false;
      state.initialized = false;
      state.error = null;
    },

    clearWishlistError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.productIds = Array.isArray(action.payload?.productIds)
          ? action.payload.productIds.map(String)
          : [];
      })

      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.error =
          action.payload?.message ||
          'No se ha podido cargar la lista de deseos';
      })

      .addCase(toggleWishlistProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(toggleWishlistProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.productIds = Array.isArray(action.payload?.productIds)
          ? action.payload.productIds.map(String)
          : [];
      })

      .addCase(toggleWishlistProduct.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          'No se ha podido actualizar la lista de deseos';
      });
  },
});

export const {
  clearWishlist,
  clearWishlistError,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;