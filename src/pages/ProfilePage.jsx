import { CalendarDays, Heart, LogOut, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { logoutUser } from '../store/slices/authSlice';
import { clearWishlist } from '../store/slices/wishlistSlice';
import Button from '../components/common/Button/Button';
import styles from './ProfilePage.module.css';

const formatDate = (value) => {
  if (!value) {
    return 'No disponible';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'No disponible';
  }

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const getRoleLabel = (role) => {
  if (role === 'ADMIN') {
    return 'Administrador';
  }

  return 'Usuario';
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    user,
    loading,
  } = useSelector((state) => state.auth);

  const {
    productIds,
  } = useSelector((state) => state.wishlist);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearWishlist());
      navigate('/login', { replace: true });
    } catch {
      return;
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.headerSection}>
          <div>
            <p className={styles.eyebrow}>Mi cuenta</p>

            <h1 className={styles.title}>
              Mi perfil
            </h1>

            <p className={styles.subtitle}>
              Consulta la información asociada a tu cuenta.
            </p>
          </div>

          <div className={styles.statusBadge}>
            <span className={styles.statusDot} />
            Sesión activa
          </div>
        </section>

        <div className={styles.contentGrid}>
          <section className={styles.profileCard}>
            <div className={styles.avatar}>
              <UserRound size={34} />
            </div>

            <div className={styles.identity}>
              <h2 className={styles.userName}>
                {user?.name || 'Usuario'}
              </h2>

              <p className={styles.userEmail}>
                {user?.email}
              </p>
            </div>

            <div className={styles.details}>
              <div className={styles.detailRow}>
                <div className={styles.detailIcon}>
                  <Mail size={18} />
                </div>

                <div>
                  <span className={styles.detailLabel}>
                    Correo electrónico
                  </span>

                  <p className={styles.detailValue}>
                    {user?.email || 'No disponible'}
                  </p>
                </div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.detailIcon}>
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <span className={styles.detailLabel}>
                    Rol
                  </span>

                  <p className={styles.detailValue}>
                    {getRoleLabel(user?.role)}
                  </p>
                </div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.detailIcon}>
                  <CalendarDays size={18} />
                </div>

                <div>
                  <span className={styles.detailLabel}>
                    Miembro desde
                  </span>

                  <p className={styles.detailValue}>
                    {formatDate(user?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className={styles.sideColumn}>
            <section className={styles.actionCard}>
              <div className={styles.actionHeader}>
                <Heart size={20} />

                <div>
                  <h2 className={styles.actionTitle}>
                    Lista de deseos
                  </h2>

                  <p className={styles.actionText}>
                    {productIds.length === 1
                      ? 'Tienes 1 producto guardado.'
                      : `Tienes ${productIds.length} productos guardados.`}
                  </p>
                </div>
              </div>

              <Link
                to="/wishlist"
                className={styles.secondaryAction}
              >
                Ver lista de deseos
              </Link>
            </section>

            <section className={styles.actionCard}>
              <div className={styles.actionHeader}>
                <LogOut size={20} />

                <div>
                  <h2 className={styles.actionTitle}>
                    Cerrar sesión
                  </h2>

                  <p className={styles.actionText}>
                    Finaliza la sesión actual de forma segura.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="primary"
                onClick={handleLogout}
                isLoading={loading}
                className={styles.logoutButton}
              >
                Cerrar sesión
              </Button>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;