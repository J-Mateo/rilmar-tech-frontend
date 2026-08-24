import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth.api';
import FormInput from '../components/common/FormInput/FormInput';
import Button from '../components/common/Button/Button';

const LoginPage = () => {
  const navigate = useNavigate();
  const emailInputRef = useRef(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Introduce un correo válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      await login(formData);
      navigate('/products');
    } catch (err) {
      setApiError(err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '420px', margin: '3rem auto', padding: '2rem 1rem' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#0f172a', textAlign: 'center' }}>
          Iniciar Sesión
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', textAlign: 'center', marginBottom: '1.5rem' }}>
          Accede a tu cuenta para gestionar tus compras
        </p>

        {apiError && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormInput
            ref={emailInputRef}
            label="Correo electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="tu@email.com"
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
            required
          />

          <Button type="submit" variant="primary" isLoading={loading} style={{ marginTop: '0.5rem', width: '100%' }}>
            Entrar
          </Button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={{ color: '#000000', fontWeight: '600', textDecoration: 'none' }}>
            Regístrate aquí
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;