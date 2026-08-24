import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth.api';
import FormInput from '../components/common/FormInput/FormInput';
import Button from '../components/common/Button/Button';

const RegisterPage = () => {
  const navigate = useNavigate();
  const nameInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    nameInputRef.current?.focus();
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

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Introduce un correo válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
      const { confirmPassword, ...registerPayload } = formData;
      await register(registerPayload);
      navigate('/login');
    } catch (err) {
      setApiError(err.message || 'Error al completar el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '440px', margin: '3rem auto', padding: '2rem 1rem' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#0f172a', textAlign: 'center' }}>
          Crear Cuenta
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', textAlign: 'center', marginBottom: '1.5rem' }}>
          Regístrate para comenzar tus compras
        </p>

        {apiError && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormInput
            ref={nameInputRef}
            label="Nombre completo"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Juan Pérez"
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
            required
          />

          <Button type="submit" variant="primary" isLoading={loading} style={{ marginTop: '0.5rem', width: '100%' }}>
            Registrarse
          </Button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: '#000000', fontWeight: '600', textDecoration: 'none' }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;