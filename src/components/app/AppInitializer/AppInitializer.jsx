import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import App from '../../../App.jsx';
import { checkAuth } from '../../../store/slices/authSlice';
import { fetchCart } from '../../../store/slices/cartSlice';
import { fetchWishlist } from '../../../store/slices/wishlistSlice';

const AppInitializer = () => {
  const dispatch = useDispatch();

  const { isAuthenticated, isCheckingAuth } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isCheckingAuth || !isAuthenticated) {
      return;
    }

    dispatch(fetchCart());
    dispatch(fetchWishlist());
  }, [dispatch, isAuthenticated, isCheckingAuth]);

  return <App />;
};

export default AppInitializer;