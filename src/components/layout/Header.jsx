import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  LogOut,
} from 'lucide-react';

import { logoutUser } from '../../store/slices/authSlice';
import styles from './Header.module.css';

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isAuthenticated, loading } = useSelector(
    (state) => state.auth
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
      navigate('/login', { replace: true });
    } catch {
      return;
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <button
          type="button"
          className={styles.menuToggleBtn}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/" className={styles.logo} onClick={closeMenu}>
          RILMAR<span>TECH</span>
        </Link>

        <nav
          className={`${styles.navLinks} ${
            isMenuOpen ? styles.navOpen : ''
          }`}
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
          >
            <Search size={20} />
          </Link>

          <Link
            to={isAuthenticated ? '/profile' : '/login'}
            className={styles.iconBtn}
            aria-label={
              isAuthenticated ? 'Mi perfil' : 'Iniciar sesión'
            }
          >
            <User size={20} />
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
              <LogOut size={20} />
            </button>
          )}

          <button
            type="button"
            className={`${styles.iconBtn} ${styles.cartBtn}`}
            aria-label="Abrir carrito"
          >
            <ShoppingBag size={20} />
            <span className={styles.cartBadge}>0</span>
          </button>
        </div>
      </div>
    </header>
  );
};