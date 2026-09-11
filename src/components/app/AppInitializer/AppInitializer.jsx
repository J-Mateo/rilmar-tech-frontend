import { useEffect } from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import App from '../../../App.jsx';

import {
  checkAuth,
} from '../../../store/slices/authSlice';

import {
  fetchCart,
  resetCartForGuest,
  syncGuestCart,
} from '../../../store/slices/cartSlice';

import {
  fetchWishlist,
} from '../../../store/slices/wishlistSlice';

let authenticatedCartInitializationInFlight = false;
let guestCartInitializationInFlight = false;

const AppInitializer = () => {
  const dispatch = useDispatch();

  const {
    initialized: authInitialized,
    isAuthenticated,
  } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!authInitialized) {
      return;
    }

    if (!isAuthenticated) {
      if (guestCartInitializationInFlight) {
        return;
      }

      guestCartInitializationInFlight = true;

      dispatch(resetCartForGuest());

      dispatch(fetchCart()).finally(() => {
        guestCartInitializationInFlight = false;
      });

      return;
    }

    if (
      authenticatedCartInitializationInFlight
    ) {
      return;
    }

    authenticatedCartInitializationInFlight = true;

    const initializeAuthenticatedCart =
      async () => {
        try {
          await dispatch(
            syncGuestCart()
          ).unwrap();
        } catch {
          return;
        } finally {
          dispatch(
            resetCartForGuest()
          );

          dispatch(fetchCart());
          dispatch(fetchWishlist());

          authenticatedCartInitializationInFlight = false;
        }
      };

    initializeAuthenticatedCart();
  }, [
    dispatch,
    authInitialized,
    isAuthenticated,
  ]);

  return <App />;
};

export default AppInitializer;
