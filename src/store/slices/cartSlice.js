import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

import {
  getCartApi,
  addCartItemApi,
  updateCartItemQuantityApi,
  removeCartItemApi,
  checkoutApi,
  buyNowApi,
} from '../../api/cart.api';

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

export const fetchCart =
  createAsyncThunk(
    'cart/fetchCart',

    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await getCartApi();

        return response.data;
      } catch (error) {
        return rejectWithValue(
          getErrorPayload(
            error,
            'No se ha podido cargar el carrito'
          )
        );
      }
    },

    {
      condition: (
        _,
        { getState }
      ) => {
        const {
          initialized,
          loading,
        } = getState().cart;

        return (
          !initialized &&
          !loading
        );
      },
    }
  );

export const addCartItem =
  createAsyncThunk(
    'cart/addCartItem',

    async (
      {
        productId,
        quantity = 1,
      },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await addCartItemApi({
            productId,
            quantity,
          });

        return response.data;
      } catch (error) {
        return rejectWithValue(
          getErrorPayload(
            error,
            'No se ha podido añadir el producto al carrito'
          )
        );
      }
    }
  );

export const updateCartItemQuantity =
  createAsyncThunk(
    'cart/updateCartItemQuantity',

    async (
      {
        itemId,
        quantity,
      },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await updateCartItemQuantityApi({
            itemId,
            quantity,
          });

        return response.data;
      } catch (error) {
        return rejectWithValue(
          getErrorPayload(
            error,
            'No se ha podido actualizar la cantidad'
          )
        );
      }
    }
  );

export const removeCartItem =
  createAsyncThunk(
    'cart/removeCartItem',

    async (
      itemId,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await removeCartItemApi(
            itemId
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          getErrorPayload(
            error,
            'No se ha podido eliminar el producto del carrito'
          )
        );
      }
    }
  );

export const checkoutCart =
  createAsyncThunk(
    'cart/checkout',

    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await checkoutApi();

        return response.data;
      } catch (error) {
        return rejectWithValue(
          getErrorPayload(
            error,
            'No se ha podido completar el pedido'
          )
        );
      }
    }
  );

export const checkoutBuyNow =
  createAsyncThunk(
    'cart/checkoutBuyNow',

    async (
      {
        productId,
        quantity = 1,
      },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await buyNowApi({
            productId,
            quantity,
          });

        return response.data;
      } catch (error) {
        return rejectWithValue(
          getErrorPayload(
            error,
            'No se ha podido completar la compra'
          )
        );
      }
    }
  );

const initialState = {
  cart: null,
  items: [],

  buyNowItem: null,
  checkoutMode: null,

  loading: false,
  mutationLoading: false,
  checkoutLoading: false,

  error: null,
  errorCode: null,

  lastOrder: null,
  initialized: false,
};

const createInitialState = () => ({
  ...initialState,
  items: [],
  buyNowItem: null,
  checkoutMode: null,
});

const setError = (
  state,
  action
) => {
  state.error =
    action.payload?.message ||
    'Se ha producido un error con el carrito';

  state.errorCode =
    action.payload?.code ||
    null;
};

const setCart = (
  state,
  cart
) => {
  state.cart =
    cart ?? null;

  state.items =
    Array.isArray(
      cart?.items
    )
      ? cart.items
      : [];
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,

  reducers: {
    clearCartError: (
      state
    ) => {
      state.error = null;
      state.errorCode = null;
    },

    resetCart: () =>
      createInitialState(),

    clearLastOrder: (
      state
    ) => {
      state.lastOrder = null;
    },

    prepareBuyNow: (
      state,
      action
    ) => {
      state.buyNowItem = {
        product:
          action.payload.product,

        quantity:
          Number(
            action.payload.quantity ||
              1
          ),
      };

      state.checkoutMode =
        'buyNow';

      state.error = null;
      state.errorCode = null;
    },

    prepareCartCheckout: (
      state
    ) => {
      state.checkoutMode =
        'cart';

      /*
       * Entrar al checkout desde
       * el carrito invalida cualquier
       * "Comprar ahora" anterior.
       */
      state.buyNowItem = null;

      state.error = null;
      state.errorCode = null;
    },

    clearBuyNow: (
      state
    ) => {
      state.buyNowItem =
        null;

      if (
        state.checkoutMode ===
        'buyNow'
      ) {
        state.checkoutMode =
          null;
      }
    },
  },

  extraReducers: (
    builder
  ) => {
    builder
      .addCase(
        fetchCart.pending,
        (state) => {
          state.loading = true;
          state.error = null;
          state.errorCode = null;
        }
      )

      .addCase(
        fetchCart.fulfilled,
        (
          state,
          action
        ) => {
          state.loading = false;
          state.initialized =
            true;

          setCart(
            state,
            action.payload
          );
        }
      )

      .addCase(
        fetchCart.rejected,
        (
          state,
          action
        ) => {
          state.loading = false;
          state.initialized =
            true;

          setError(
            state,
            action
          );
        }
      )

      .addCase(
        addCartItem.pending,
        (state) => {
          state.mutationLoading =
            true;

          state.error = null;
          state.errorCode = null;
        }
      )

      .addCase(
        addCartItem.fulfilled,
        (
          state,
          action
        ) => {
          state.mutationLoading =
            false;

          setCart(
            state,
            action.payload
          );
        }
      )

      .addCase(
        addCartItem.rejected,
        (
          state,
          action
        ) => {
          state.mutationLoading =
            false;

          setError(
            state,
            action
          );
        }
      )

      .addCase(
        updateCartItemQuantity.pending,
        (state) => {
          state.mutationLoading =
            true;

          state.error = null;
          state.errorCode = null;
        }
      )

      .addCase(
        updateCartItemQuantity.fulfilled,
        (
          state,
          action
        ) => {
          state.mutationLoading =
            false;

          setCart(
            state,
            action.payload
          );
        }
      )

      .addCase(
        updateCartItemQuantity.rejected,
        (
          state,
          action
        ) => {
          state.mutationLoading =
            false;

          setError(
            state,
            action
          );
        }
      )

      .addCase(
        removeCartItem.pending,
        (state) => {
          state.mutationLoading =
            true;

          state.error = null;
          state.errorCode = null;
        }
      )

      .addCase(
        removeCartItem.fulfilled,
        (
          state,
          action
        ) => {
          state.mutationLoading =
            false;

          setCart(
            state,
            action.payload
          );
        }
      )

      .addCase(
        removeCartItem.rejected,
        (
          state,
          action
        ) => {
          state.mutationLoading =
            false;

          setError(
            state,
            action
          );
        }
      )

      .addCase(
        checkoutCart.pending,
        (state) => {
          state.checkoutLoading =
            true;

          state.error = null;
          state.errorCode = null;
        }
      )

      .addCase(
        checkoutCart.fulfilled,
        (
          state,
          action
        ) => {
          state.checkoutLoading =
            false;

          state.lastOrder =
            action.payload;

          state.cart = null;
          state.items = [];
          state.buyNowItem = null;
          state.checkoutMode = null;
        }
      )

      .addCase(
        checkoutCart.rejected,
        (
          state,
          action
        ) => {
          state.checkoutLoading =
            false;

          setError(
            state,
            action
          );
        }
      )

      .addCase(
        checkoutBuyNow.pending,
        (state) => {
          state.checkoutLoading =
            true;

          state.error = null;
          state.errorCode = null;
        }
      )

      .addCase(
        checkoutBuyNow.fulfilled,
        (
          state,
          action
        ) => {
          state.checkoutLoading =
            false;

          state.lastOrder =
            action.payload;

          /*
           * Comprar ahora NO modifica
           * el carrito normal.
           */
          state.buyNowItem = null;
          state.checkoutMode = null;
        }
      )

      .addCase(
        checkoutBuyNow.rejected,
        (
          state,
          action
        ) => {
          state.checkoutLoading =
            false;

          setError(
            state,
            action
          );
        }
      )

      .addCase(
        logoutUser.fulfilled,
        () =>
          createInitialState()
      );
  },
});

export const {
  clearCartError,
  resetCart,
  clearLastOrder,
  prepareBuyNow,
  prepareCartCheckout,
  clearBuyNow,
} = cartSlice.actions;

export const selectCart = (
  state
) =>
  state.cart.cart;

export const selectCartItems = (
  state
) =>
  state.cart.items;

export const selectBuyNowItem = (
  state
) =>
  state.cart.buyNowItem;

export const selectCheckoutMode = (
  state
) =>
  state.cart.checkoutMode;

export const selectCartLoading = (
  state
) =>
  state.cart.loading;

export const selectCartMutationLoading = (
  state
) =>
  state.cart.mutationLoading;

export const selectCheckoutLoading = (
  state
) =>
  state.cart.checkoutLoading;

export const selectCartError = (
  state
) =>
  state.cart.error;

export const selectLastOrder = (
  state
) =>
  state.cart.lastOrder;

export const selectCartItemCount = (
  state
) =>
  state.cart.items.reduce(
    (
      total,
      item
    ) =>
      total +
      Number(
        item.quantity ||
          0
      ),
    0
  );

export const selectCartTotal = (
  state
) =>
  state.cart.items.reduce(
    (
      total,
      item
    ) => {
      const price =
        Number(
          item.product
            ?.price ||
            0
        );

      const quantity =
        Number(
          item.quantity ||
            0
        );

      return (
        total +
        price *
          quantity
      );
    },
    0
  );

export default cartSlice.reducer;