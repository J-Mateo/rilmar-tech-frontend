import {
  NavLink,
  Outlet,
} from 'react-router-dom';

import styles from './AdminLayout.module.css';

export const AdminLayout = () => {
  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <p className={styles.eyebrow}>
            RILMAR TECH
          </p>

          <h1 className={styles.title}>
            Administración
          </h1>
        </div>

        <nav
          className={styles.navigation}
          aria-label="Navegación administrativa"
        >
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `${styles.navLink} ${
                isActive
                  ? styles.active
                  : ''
              }`
            }
          >
            Resumen
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `${styles.navLink} ${
                isActive
                  ? styles.active
                  : ''
              }`
            }
          >
            Productos
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `${styles.navLink} ${
                isActive
                  ? styles.active
                  : ''
              }`
            }
          >
            Pedidos
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `${styles.navLink} ${
                isActive
                  ? styles.active
                  : ''
              }`
            }
          >
            Usuarios
          </NavLink>
        </nav>
      </aside>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;