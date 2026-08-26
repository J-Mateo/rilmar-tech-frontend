import { useState } from 'react';
import {
  Link,
  NavLink,
  useNavigate,
} from 'react-router-dom';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  LogOut,
} from 'lucide-react';

import {
  logoutUser,
} from '../../store/slices/authSlice';

import {
  selectCartItemCount,
} from '../../store/slices/cartSlice';

import styles from './Header.module.css';

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    isAuthenticated,
    loading,
  } = useSelector((state) => state.auth);

  const cartItemCount = useSelector(
    selectCartItemCount
  );

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();

      closeMenu();

      navigate('/login', {
        replace: true,
      });
    } catch {
      return;
    }
  };

  const cartLabel =
    cartItemCount > 0
      ? `Carrito, ${cartItemCount} ${cartItemCount === 1
        ? 'producto'
        : 'productos'
      }`
      : 'Carrito';

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <button
          type="button"
          className={styles.menuToggleBtn}
          onClick={toggleMenu}
          aria-label={
            isMenuOpen
              ? 'Cerrar menú'
              : 'Abrir menú'
          }
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
        >
          {isMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>

        <Link
          to="/"
          className={styles.logo}
          onClick={closeMenu}
          aria-label="Rilmar Tech - Inicio"
        >
          RILMAR<span>TECH</span>
        </Link>

        <nav
          id="main-navigation"
          className={`${styles.navLinks} ${isMenuOpen ? styles.navOpen : ''
            }`}
          aria-label="Navegación principal"
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? styles.active : ''
            }
            onClick={closeMenu}
          >
            Inicio
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? styles.active : ''
            }
            onClick={closeMenu}
          >
            Catálogo
          </NavLink>
        </nav>

        <div className={styles.headerActions}>
          <Link
            to="/products"
            className={styles.iconBtn}
            aria-label="Buscar productos"
            title="Buscar productos"
            onClick={closeMenu}
          >
            <Search
              size={20}
              aria-hidden="true"
            />
          </Link>

          <Link
            to={
              isAuthenticated
                ? '/profile'
                : '/login'
            }
            className={styles.iconBtn}
            aria-label={
              isAuthenticated
                ? 'Mi perfil'
                : 'Iniciar sesión'
            }
            title={
              isAuthenticated
                ? 'Mi perfil'
                : 'Iniciar sesión'
            }
            onClick={closeMenu}
          >
            <User
              size={20}
              aria-hidden="true"
            />
          </Link>

          {isAuthenticated && (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={handleLogout}
              disabled={loading}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut
                size={20}
                aria-hidden="true"
              />
            </button>
          )}

          <Link
            to={
              isAuthenticated
                ? '/cart'
                : '/login'
            }
            className={`${styles.iconBtn} ${styles.cartBtn}`}
            aria-label={cartLabel}
            title="Carrito"
            onClick={closeMenu}
          >
            <ShoppingBag
              size={20}
              aria-hidden="true"
            />

            {isAuthenticated &&
              cartItemCount > 0 && (
                <span
                  className={styles.cartBadge}
                  aria-hidden="true"
                >
                  {cartItemCount > 99
                    ? '99+'
                    : cartItemCount}
                </span>
              )}
          </Link>
        </div>
      </div>
    </header>
  );
};