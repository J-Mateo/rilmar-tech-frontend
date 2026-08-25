import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import ProtectedRoute from '../components/common/ProtectedRoute/ProtectedRoute';
import GuestRoute from '../components/common/GuestRoute/GuestRoute';

import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CartPage from '../pages/CartPage';
import WishlistPage from '../pages/WishlistPage';
import ProfilePage from '../pages/ProfilePage';
import CheckoutPage from '../pages/CheckoutPage';
import CheckoutSuccessPage from '../pages/CheckoutSuccessPage';
import NotFoundPage from '../pages/NotFoundPage';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/products/:id', element: <ProductDetailPage /> },

      {
        element: <GuestRoute />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          { path: '/cart', element: <CartPage /> },
          { path: '/wishlist', element: <WishlistPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/checkout', element: <CheckoutPage /> },
          { path: '/checkout/success', element: <CheckoutSuccessPage /> },
        ],
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default router;