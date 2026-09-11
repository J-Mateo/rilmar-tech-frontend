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

import {
  getProductById,
} from '../../api/products.api';

import {
  addGuestCartItem,
  readGuestCart,
  removeGuestCartItem,
  updateGuestCartItem,
} from '../../utils/guestCart';

import {
  logoutUser,
} from './authSlice';

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

const getProductFromResponse = (
  response
) =>
  response?.data ?? null;

const hydrateGuestCart = async (
  guestItems
) => {
  const hydratedItems = [];

  for (const guestItem of guestItems) {
    try {
      const response =
        await getProductById(
          guestItem.productId
        );

      const product =
        getProductFromResponse(
          response
        );

      if (!product) {
        continue;
      }

      const stock =
        Math.max(
          0,
          Number(
            product.stock || 0
          )
        );

      if (stock <= 0) {
        continue;
      }

      const quantity =
        Math.min(
          Math.max(
            1,
            Number(
              guestItem.quantity ||
                1
            )
          ),
          stock
        );

      hydratedItems.push({
        id:
          `guest-${product.id}`,
        productId:
          product.id,
        quantity,
        product,
        isGuest: true,
      });
    } catch {
      continue;
    }
  }

  return hydratedItems;
};

export const fetchCart =
  createAsyncThunk(
    'cart/fetchCart',

    async (
      _,
      {
        getState,
        rejectWithValue,
      }
    ) => {
      const {
        isAuthenticated,
      } = getState().auth;

      if (!isAuthenticated) {
        try {
          const guestItems =
            readGuestCart();

          const items =
            await hydrateGuestCart(
              guestItems
            );

          return {
            mode: 'guest',
            cart: {
              items,
            },
          };
        } catch (error) {
          return rejectWithValue(
            getErrorPayload(
              error,
              'No se ha podido cargar el carrito'
            )
          );
        }
      }

      try {
        const response =
          await getCartApi();

        return {
          mode:
            'authenticated',
          cart:
            response.data,
        };
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
        } =
          getState().cart;

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
      {
        getState,
        rejectWithValue,
      }
    ) => {
      const {
        isAuthenticated,
      } = getState().auth;

      if (!isAuthenticated) {
        try {
          const guestItems =
            addGuestCartItem({
              productId,
              quantity,
            });

          const items =
            await hydrateGuestCart(
              guestItems
            );

          return {
            mode: 'guest',
            cart: {
              items,
            },
          };
        } catch (error) {
          return rejectWithValue(
            getErrorPayload(
              error,
              'No se ha podido añadir el producto al carrito'
            )
          );
        }
      }

      try {
        const response =
          await addCartItemApi({
            productId,
            quantity,
          });

        return {
          mode:
            'authenticated',
          cart:
            response.data,
        };
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
        productId,
      },
      {
        getState,
        rejectWithValue,
      }
    ) => {
      const {
        isAuthenticated,
      } = getState().auth;

      if (!isAuthenticated) {
        try {
          const guestProductId =
            Number(
              productId ||
                String(
                  itemId
                ).replace(
                  'guest-',
                  ''
                )
            );

          const guestItems =
            updateGuestCartItem({
              productId:
                guestProductId,
              quantity,
            });

          const items =
            await hydrateGuestCart(
              guestItems
            );

          return {
            mode: 'guest',
            cart: {
              items,
            },
          };
        } catch (error) {
          return rejectWithValue(
            getErrorPayload(
              error,
              'No se ha podido actualizar la cantidad'
            )
          );
        }
      }

      try {
        const response =
          await updateCartItemQuantityApi({
            itemId,
            quantity,
          });

        return {
          mode:
            'authenticated',
          cart:
            response.data,
        };
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
      {
        itemId,
        productId,
      },
      {
        getState,
        rejectWithValue,
      }
    ) => {
      const {
        isAuthenticated,
      } = getState().auth;

      if (!isAuthenticated) {
        try {
          const guestProductId =
            Number(
              productId ||
                String(
                  itemId
                ).replace(
                  'guest-',
                  ''
                )
            );

          const guestItems =
            removeGuestCartItem(
              guestProductId
            );

          const items =
            await hydrateGuestCart(
              guestItems
            );

          return {
            mode: 'guest',
            cart: {
              items,
            },
          };
        } catch (error) {
          return rejectWithValue(
            getErrorPayload(
              error,
              'No se ha podido eliminar el producto del carrito'
            )
          );
        }
      }

      try {
        const response =
          await removeCartItemApi(
            itemId
          );

        return {
          mode:
            'authenticated',
          cart:
            response.data,
        };
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

export const syncGuestCart =
  createAsyncThunk(
    'cart/syncGuestCart',

    async (
      _,
      {
        getState,
        rejectWithValue,
      }
    ) => {
      const {
        isAuthenticated,
      } = getState().auth;

      if (!isAuthenticated) {
        return null;
      }

      const pendingItems =
        readGuestCart();

      if (
        pendingItems.length === 0
      ) {
        return null;
      }

      try {
        for (
          const item of
            pendingItems
        ) {
          await addCartItemApi({
            productId:
              item.productId,
            quantity:
              item.quantity,
          });

          removeGuestCartItem(
            item.productId
          );
        }

        return true;
      } catch (error) {
        return rejectWithValue(
          getErrorPayload(
            error,
            'No se ha podido sincronizar el carrito'
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
      {
        getState,
        rejectWithValue,
      }
    ) => {
      const {
        isAuthenticated,
      } = getState().auth;

      if (!isAuthenticated) {
        return rejectWithValue({
          message:
            'Debes iniciar sesión para continuar con la compra',
          status: 401,
          code:
            'AUTH_REQUIRED',
        });
      }

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
      {
        getState,
        rejectWithValue,
      }
    ) => {
      const {
        isAuthenticated,
      } = getState().auth;

      if (!isAuthenticated) {
        return rejectWithValue({
          message:
            'Debes iniciar sesión para continuar con la compra',
          status: 401,
          code:
            'AUTH_REQUIRED',
        });
      }

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
  syncingGuestCart: false,

  error: null,
  errorCode: null,

  lastOrder: null,
  initialized: false,
  mode: 'guest',
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

const setCartPayload = (
  state,
  action
) => {
  state.mode =
    action.payload?.mode ||
    state.mode;

  setCart(
    state,
    action.payload?.cart
  );
};

const cartSlice =
  createSlice({
    name: 'cart',
    initialState,

    reducers: {
      clearCartError: (
        state
      ) => {
        state.error = null;
        state.errorCode =
          null;
      },

      resetCart: () =>
        createInitialState(),

      clearLastOrder: (
        state
      ) => {
        state.lastOrder =
          null;
      },

      prepareBuyNow: (
        state,
        action
      ) => {
        state.buyNowItem = {
          product:
            action.payload
              .product,

          quantity:
            Number(
              action.payload
                .quantity || 1
            ),
        };

        state.checkoutMode =
          'buyNow';

        state.error = null;
        state.errorCode =
          null;
      },

      prepareCartCheckout: (
        state
      ) => {
        state.checkoutMode =
          'cart';

        state.buyNowItem =
          null;

        state.error = null;
        state.errorCode =
          null;
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

      resetCartForGuest: (
        state
      ) => {
        state.cart = null;
        state.items = [];
        state.buyNowItem =
          null;
        state.checkoutMode =
          null;
        state.loading = false;
        state.mutationLoading =
          false;
        state.checkoutLoading =
          false;
        state.syncingGuestCart =
          false;
        state.error = null;
        state.errorCode = null;
        state.lastOrder = null;
        state.initialized =
          false;
        state.mode = 'guest';
      },
    },

    extraReducers: (
      builder
    ) => {
      builder
        .addCase(
          fetchCart.pending,
          (state) => {
            state.loading =
              true;
            state.error = null;
            state.errorCode =
              null;
          }
        )

        .addCase(
          fetchCart.fulfilled,
          (
            state,
            action
          ) => {
            state.loading =
              false;
            state.initialized =
              true;

            setCartPayload(
              state,
              action
            );
          }
        )

        .addCase(
          fetchCart.rejected,
          (
            state,
            action
          ) => {
            state.loading =
              false;
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
            state.errorCode =
              null;
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
            state.initialized =
              true;

            setCartPayload(
              state,
              action
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
          updateCartItemQuantity
            .pending,
          (state) => {
            state.mutationLoading =
              true;

            state.error = null;
            state.errorCode =
              null;
          }
        )

        .addCase(
          updateCartItemQuantity
            .fulfilled,
          (
            state,
            action
          ) => {
            state.mutationLoading =
              false;

            setCartPayload(
              state,
              action
            );
          }
        )

        .addCase(
          updateCartItemQuantity
            .rejected,
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
            state.errorCode =
              null;
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

            setCartPayload(
              state,
              action
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
          syncGuestCart.pending,
          (state) => {
            state.syncingGuestCart =
              true;
          }
        )

        .addCase(
          syncGuestCart.fulfilled,
          (state) => {
            state.syncingGuestCart =
              false;
          }
        )

        .addCase(
          syncGuestCart.rejected,
          (
            state,
            action
          ) => {
            state.syncingGuestCart =
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
            state.errorCode =
              null;
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
            state.buyNowItem =
              null;
            state.checkoutMode =
              null;
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
            state.errorCode =
              null;
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

            state.buyNowItem =
              null;
            state.checkoutMode =
              null;
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
  resetCartForGuest,
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

export const selectCartMutationLoading =
  (state) =>
    state.cart
      .mutationLoading;

export const selectCheckoutLoading =
  (state) =>
    state.cart
      .checkoutLoading;

export const selectCartError = (
  state
) =>
  state.cart.error;

export const selectLastOrder = (
  state
) =>
  state.cart.lastOrder;

export const selectCartMode = (
  state
) =>
  state.cart.mode;

export const selectGuestCartSyncing =
  (state) =>
    state.cart
      .syncingGuestCart;

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
        item.quantity || 0
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
            ?.price || 0
        );

      const quantity =
        Number(
          item.quantity || 0
        );

      return (
        total +
        price * quantity
      );
    },
    0
  );

export default cartSlice.reducer;