import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/axios';

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/cart');
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Error al obtener el carrito';
            return rejectWithValue(message);
        }
    }
);

export const addToCartServer = createAsyncThunk(
    'cart/addToCartServer',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/cart', { productId, quantity });
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Error al añadir producto';
            return rejectWithValue(message);
        }
    }
);

export const updateCartItemServer = createAsyncThunk(
    'cart/updateCartItemServer',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/cart/${productId}`, { quantity });
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Error al actualizar cantidad';
            return rejectWithValue(message);
        }
    }
);

export const removeFromCartServer = createAsyncThunk(
    'cart/removeFromCartServer',
    async (productId, { rejectWithValue }) => {
        try {
            await apiClient.delete(`/cart/${productId}`);
            return productId;
        } catch (error) {
            const message = error.response?.data?.message || 'Error al eliminar producto';
            return rejectWithValue(message);
        }
    }
);

const initialState = {
    items: [],
    isOpen: false,
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        toggleCart: (state) => {
            state.isOpen = !state.isOpen;
        },
        setCartOpen: (state, action) => {
            state.isOpen = action.payload;
        },
        addItemLocal: (state, action) => {
            const { product, quantity = 1 } = action.payload;
            const existingItem = state.items.find((item) => item.product._id === product._id);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({ product, quantity });
            }
        },
        updateQuantityLocal: (state, action) => {
            const { productId, quantity } = action.payload;
            const existingItem = state.items.find((item) => item.product._id === productId);

            if (existingItem) {
                if (quantity <= 0) {
                    state.items = state.items.filter((item) => item.product._id !== productId);
                } else {
                    existingItem.quantity = quantity;
                }
            }
        },
        removeItemLocal: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter((item) => item.product._id !== productId);
        },
        clearCartLocal: (state) => {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items || action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addToCartServer.fulfilled, (state, action) => {
                state.items = action.payload.items || action.payload;
            })
            .addCase(updateCartItemServer.fulfilled, (state, action) => {
                state.items = action.payload.items || action.payload;
            })
            .addCase(removeFromCartServer.fulfilled, (state, action) => {
                const productId = action.payload;
                state.items = state.items.filter((item) => item.product._id !== productId);
            });
    },
});

export const {
    toggleCart,
    setCartOpen,
    addItemLocal,
    updateQuantityLocal,
    removeItemLocal,
    clearCartLocal,
} = cartSlice.actions;

export default cartSlice.reducer;