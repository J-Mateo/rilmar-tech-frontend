import {
  lazy,
} from 'react';

export const AboutPage =
  lazy(() =>
    import('../pages/AboutPage')
  );

export const ProductsPage =
  lazy(() =>
    import('../pages/ProductsPage')
  );

export const ProductDetailPage =
  lazy(() =>
    import('../pages/ProductDetailPage')
  );

export const LoginPage =
  lazy(() =>
    import('../pages/LoginPage')
  );

export const RegisterPage =
  lazy(() =>
    import('../pages/RegisterPage')
  );

export const ForgotPasswordPage =
  lazy(() =>
    import(
      '../pages/ForgotPasswordPage'
    )
  );

export const ResetPasswordPage =
  lazy(() =>
    import(
      '../pages/ResetPasswordPage'
    )
  );

export const CartPage =
  lazy(() =>
    import('../pages/CartPage')
  );

export const WishlistPage =
  lazy(() =>
    import('../pages/WishlistPage')
  );

export const ProfilePage =
  lazy(() =>
    import('../pages/ProfilePage')
  );

export const CheckoutPage =
  lazy(() =>
    import('../pages/CheckoutPage')
  );

export const CheckoutSuccessPage =
  lazy(() =>
    import(
      '../pages/CheckoutSuccessPage'
    )
  );

export const NotFoundPage =
  lazy(() =>
    import('../pages/NotFoundPage')
  );

export const AdminLayout =
  lazy(() =>
    import(
      '../components/layout/AdminLayout'
    )
  );

export const AdminDashboard =
  lazy(() =>
    import(
      '../pages/admin/AdminDashboard'
    )
  );

export const AdminProducts =
  lazy(() =>
    import(
      '../pages/admin/AdminProducts'
    )
  );

export const AdminProductForm =
  lazy(() =>
    import(
      '../pages/admin/AdminProductForm'
    )
  );

export const AdminOrders =
  lazy(() =>
    import(
      '../pages/admin/AdminOrders'
    )
  );

export const AdminUsers =
  lazy(() =>
    import(
      '../pages/admin/AdminUsers'
    )
  );