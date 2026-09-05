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
} from '../../../store/slices/cartSlice';

import {
  fetchWishlist,
} from '../../../store/slices/wishlistSlice';

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
    if (
      !authInitialized ||
      !isAuthenticated
    ) {
      return;
    }

    dispatch(fetchCart());
    dispatch(fetchWishlist());
  }, [
    dispatch,
    authInitialized,
    isAuthenticated,
  ]);

  return <App />;
};

export default AppInitializer;