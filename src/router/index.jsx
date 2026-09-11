import {
  Suspense,
} from 'react';

import {
  createBrowserRouter,
} from 'react-router-dom';

import {
  Layout,
} from '../components/layout/Layout';

import ProtectedRoute from '../components/common/ProtectedRoute/ProtectedRoute';
import GuestRoute from '../components/common/GuestRoute/GuestRoute';
import ScrollToTop from '../components/common/ScrollToTop/ScrollToTop';

import HomePage from '../pages/HomePage';

import {
  AboutPage,
  ProductsPage,
  ProductDetailPage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  CartPage,
  WishlistPage,
  ProfilePage,
  CheckoutPage,
  CheckoutSuccessPage,
  NotFoundPage,
  AdminLayout,
  AdminDashboard,
  AdminProducts,
  AdminProductForm,
  AdminOrders,
  AdminUsers,
} from './lazyPages';

import LoadingRoute from './LoadingRoute';

const lazyElement = (
  element
) => (
  <Suspense
    fallback={
      <LoadingRoute />
    }
  >
    {element}
  </Suspense>
);

const router =
  createBrowserRouter([
    {
      element: (
        <>
          <ScrollToTop />
          <Layout />
        </>
      ),

      children: [
        {
          path: '/',

          element:
            <HomePage />,
        },

        {
          path: '/about',

          element:
            lazyElement(
              <AboutPage />
            ),
        },

        {
          path: '/products',

          element:
            lazyElement(
              <ProductsPage />
            ),
        },

        {
          path:
            '/products/:id',

          element:
            lazyElement(
              <ProductDetailPage />
            ),
        },


        {
          path: '/cart',

          element:
            lazyElement(
              <CartPage />
            ),
        },

        {
          element:
            <GuestRoute />,

          children: [
            {
              path: '/login',

              element:
                lazyElement(
                  <LoginPage />
                ),
            },

            {
              path: '/register',

              element:
                lazyElement(
                  <RegisterPage />
                ),
            },

            {
              path:
                '/forgot-password',

              element:
                lazyElement(
                  <ForgotPasswordPage />
                ),
            },

            {
              path:
                '/reset-password',

              element:
                lazyElement(
                  <ResetPasswordPage />
                ),
            },
          ],
        },

        {
          element:
            <ProtectedRoute />,

          children: [
            {
              path:
                '/wishlist',

              element:
                lazyElement(
                  <WishlistPage />
                ),
            },

            {
              path:
                '/profile',

              element:
                lazyElement(
                  <ProfilePage />
                ),
            },

            {
              path:
                '/checkout',

              element:
                lazyElement(
                  <CheckoutPage />
                ),
            },

            {
              path:
                '/checkout/success',

              element:
                lazyElement(
                  <CheckoutSuccessPage />
                ),
            },
          ],
        },

        {
          element: (
            <ProtectedRoute
              allowedRoles={[
                'ADMIN',
              ]}
            />
          ),

          children: [
            {
              path: '/admin',

              element:
                lazyElement(
                  <AdminLayout />
                ),

              children: [
                {
                  index: true,

                  element:
                    lazyElement(
                      <AdminDashboard />
                    ),
                },

                {
                  path: 'products',

                  element:
                    lazyElement(
                      <AdminProducts />
                    ),
                },

                {
                  path:
                    'products/new',

                  element:
                    lazyElement(
                      <AdminProductForm />
                    ),
                },

                {
                  path:
                    'products/:id/edit',

                  element:
                    lazyElement(
                      <AdminProductForm />
                    ),
                },

                {
                  path: 'orders',

                  element:
                    lazyElement(
                      <AdminOrders />
                    ),
                },

                {
                  path: 'users',

                  element:
                    lazyElement(
                      <AdminUsers />
                    ),
                },
              ],
            },
          ],
        },

        {
          path: '*',

          element:
            lazyElement(
              <NotFoundPage />
            ),
        },
      ],
    },
  ]);

export default router;

