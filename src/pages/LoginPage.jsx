import { useEffect, useRef, useState, } from 'react';
import { Link, useNavigate, } from 'react-router-dom';
import { useDispatch, useSelector,} from 'react-redux';

import { clearAuthError, loginUser, } from '../store/slices/authSlice';
import FormInput from '../components/common/FormInput/FormInput';
import Button from '../components/common/Button/Button';
import styles from './LoginPage.module.css';

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailInputRef = useRef(null);

  const {
    loading,
    error: apiError,
  } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    emailInputRef.current?.focus();
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: null,
      }));
    }
  };

  const validate = () => {
    const validationErrors = {};
    const normalizedEmail =
      formData.email.trim();

    if (!normalizedEmail) {
      validationErrors.email =
        'El correo electrónico es obligatorio';
    } else if (
      !EMAIL_PATTERN.test(normalizedEmail)
    ) {
      validationErrors.email =
        'Introduce un correo válido';
    }

    if (!formData.password) {
      validationErrors.password =
        'La contraseña es obligatoria';
    }

    setErrors(validationErrors);

    return (
      Object.keys(validationErrors).length === 0
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const credentials = {
      email: formData.email
        .trim()
        .toLowerCase(),
      password: formData.password,
    };

    try {
      await dispatch(
        loginUser(credentials)
      ).unwrap();

      navigate('/products', {
        replace: true,
      });
    } catch {
      return;
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>
          Iniciar Sesión
        </h1>

        <p className={styles.subtitle}>
          Accede a tu cuenta para gestionar tus compras
        </p>

        {apiError && (
          <div
            className={styles.apiError}
            role="alert"
          >
            {apiError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className={styles.form}
        >
          <FormInput
            ref={emailInputRef}
            label="Correo electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="tu@email.com"
            autoComplete="email"
            required
          />

          <FormInput
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            disabled={loading}
            className={styles.submitButton}
          >
            Entrar
          </Button>
        </form>

        <p className={styles.authFooter}>
          ¿No tienes cuenta?{' '}
          <Link
            to="/register"
            className={styles.authLink}
          >
            Regístrate aquí
          </Link>
        </p>
      </section>
    </main>
  );
};

export default LoginPage;