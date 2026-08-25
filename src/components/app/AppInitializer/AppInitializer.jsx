import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { checkAuth } from '../../../store/slices/authSlice';
import { fetchWishlist } from '../../../store/slices/wishlistSlice';
import App from '../../../App.jsx';

const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      const authResult = await dispatch(checkAuth());

      if (checkAuth.fulfilled.match(authResult)) {
        await dispatch(fetchWishlist());
      }
    };

    initializeApp();
  }, [dispatch]);

  return <App />;
};

export default AppInitializer;