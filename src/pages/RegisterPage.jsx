import { useEffect, useRef, useState, } from 'react';
import { Link, useNavigate, } from 'react-router-dom';
import { useDispatch, useSelector,} from 'react-redux';

import { clearAuthError, registerUser, } from '../store/slices/authSlice';
import FormInput from '../components/common/FormInput/FormInput';
import Button from '../components/common/Button/Button';
import styles from './RegisterPage.module.css';

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nameInputRef = useRef(null);

  const {
    loading,
    error: apiError,
  } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    nameInputRef.current?.focus();
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

    const normalizedName =
      formData.name.trim();

    const normalizedEmail =
      formData.email.trim();

    if (!normalizedName) {
      validationErrors.name =
        'El nombre es obligatorio';
    }

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
    } else if (formData.password.length < 6) {
      validationErrors.password =
        'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      validationErrors.confirmPassword =
        'Confirma la contraseña';
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      validationErrors.confirmPassword =
        'Las contraseñas no coinciden';
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

    const registerPayload = {
      name: formData.name.trim(),
      email: formData.email
        .trim()
        .toLowerCase(),
      password: formData.password,
    };

    try {
      await dispatch(
        registerUser(registerPayload)
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
          Crear Cuenta
        </h1>

        <p className={styles.subtitle}>
          Regístrate para comenzar tus compras
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
            ref={nameInputRef}
            label="Nombre completo"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Juan Pérez"
            autoComplete="name"
            required
          />

          <FormInput
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
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            required
          />

          <FormInput
            label="Confirmar contraseña"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Repite la contraseña"
            autoComplete="new-password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            disabled={loading}
            className={styles.submitButton}
          >
            Registrarse
          </Button>
        </form>

        <p className={styles.authFooter}>
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className={styles.authLink}
          >
            Inicia sesión
          </Link>
        </p>
      </section>
    </main>
  );
};

export default RegisterPage;