import {
  useRef,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import {
  forgotPasswordApi,
} from '../api/auth.api';

import FormInput from '../components/common/FormInput/FormInput';
import Button from '../components/common/Button/Button';

import styles from './ForgotPasswordPage.module.css';

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPasswordPage =
  () => {
    const emailInputRef =
      useRef(null);

    const [
      email,
      setEmail,
    ] =
      useState('');

    const [
      error,
      setError,
    ] =
      useState('');

    const [
      successMessage,
      setSuccessMessage,
    ] =
      useState('');

    const [
      loading,
      setLoading,
    ] =
      useState(false);

    const handleSubmit =
      async (event) => {
        event.preventDefault();

        setError('');
        setSuccessMessage('');

        const normalizedEmail =
          email
            .trim()
            .toLowerCase();

        if (
          !normalizedEmail
        ) {
          setError(
            'El correo electrónico es obligatorio'
          );

          return;
        }

        if (
          !EMAIL_PATTERN.test(
            normalizedEmail
          )
        ) {
          setError(
            'Introduce un correo válido'
          );

          return;
        }

        try {
          setLoading(
            true
          );

          const response =
            await forgotPasswordApi(
              normalizedEmail
            );

          setSuccessMessage(
            response.message ||
              'Si existe una cuenta asociada a ese correo, recibirás instrucciones para restablecer la contraseña.'
          );
        } catch (
          requestError
        ) {
          setError(
            requestError?.message ||
              'No se ha podido procesar la solicitud'
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    return (
      <main
        className={
          styles.page
        }
      >
        <section
          className={
            styles.card
          }
        >
          <h1
            className={
              styles.title
            }
          >
            Recuperar contraseña
          </h1>

          <p
            className={
              styles.subtitle
            }
          >
            Introduce el correo
            asociado a tu cuenta.
            Si existe, recibirás
            un enlace para crear
            una nueva contraseña.
          </p>

          {successMessage ? (
            <>
              <div
                className={
                  styles.success
                }
                role="status"
              >
                {
                  successMessage
                }
              </div>

              <p
                className={
                  styles.note
                }
              >
                Revisa también
                la carpeta de
                correo no deseado.
                El enlace caduca
                en 15 minutos.
              </p>
            </>
          ) : (
            <form
              onSubmit={
                handleSubmit
              }
              noValidate
              className={
                styles.form
              }
            >
              <FormInput
                ref={
                  emailInputRef
                }
                label="Correo electrónico"
                name="email"
                type="email"
                value={
                  email
                }
                onChange={(
                  event
                ) => {
                  setEmail(
                    event.target.value
                  );

                  if (
                    error
                  ) {
                    setError(
                      ''
                    );
                  }
                }}
                error={
                  error
                }
                placeholder="tu@email.com"
                autoComplete="email"
                required
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={
                  loading
                }
                disabled={
                  loading
                }
                className={
                  styles.submitButton
                }
              >
                Enviar enlace
              </Button>
            </form>
          )}

          <p
            className={
              styles.authFooter
            }
          >
            <Link
              to="/login"
              className={
                styles.authLink
              }
            >
              Volver al inicio
              de sesión
            </Link>
          </p>
        </section>
      </main>
    );
  };

export default ForgotPasswordPage;