import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  clearAuthError,
  registerUser,
} from '../store/slices/authSlice';

import FormInput from '../components/common/FormInput/FormInput';
import Button from '../components/common/Button/Button';

const EMAIL_PATTERN = /\S+@\S+\.\S+/;

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

    const normalizedName = formData.name.trim();
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
    <main
      style={{
        maxWidth: '440px',
        margin: '3rem auto',
        padding: '2rem 1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow:
            '0 4px 6px -1px rgba(0,0,0,0.05)',
        }}
      >
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '0.5rem',
            color: '#0f172a',
            textAlign: 'center',
          }}
        >
          Crear Cuenta
        </h1>

        <p
          style={{
            fontSize: '0.875rem',
            color: '#64748b',
            textAlign: 'center',
            marginBottom: '1.5rem',
          }}
        >
          Regístrate para comenzar tus compras
        </p>

        {apiError && (
          <div
            role="alert"
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              textAlign: 'center',
            }}
          >
            {apiError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
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
            style={{
              marginTop: '0.5rem',
              width: '100%',
            }}
          >
            Registrarse
          </Button>
        </form>

        <p
          style={{
            marginTop: '1.5rem',
            fontSize: '0.85rem',
            color: '#64748b',
            textAlign: 'center',
          }}
        >
          ¿Ya tienes cuenta?{' '}

          <Link
            to="/login"
            style={{
              color: '#000000',
              fontWeight: '600',
              textDecoration: 'none',
            }}
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;