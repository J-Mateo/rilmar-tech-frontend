import {
  useMemo,
  useState,
} from 'react';

import {
  Link,
  useSearchParams,
} from 'react-router-dom';

import {
  resetPasswordApi,
} from '../api/auth.api';

import FormInput from '../components/common/FormInput/FormInput';
import Button from '../components/common/Button/Button';

import {
  PASSWORD_REQUIREMENTS,
  getPasswordError,
} from '../utils/passwordPolicy';

import styles from './ResetPasswordPage.module.css';

const ResetPasswordPage =
  () => {
    const [
      searchParams,
    ] =
      useSearchParams();

    const token =
      useMemo(
        () =>
          searchParams.get(
            'token'
          )?.trim() ||
          '',
        [
          searchParams,
        ]
      );

    const [
      formData,
      setFormData,
    ] =
      useState({
        password: '',
        confirmPassword: '',
      });

    const [
      errors,
      setErrors,
    ] =
      useState({});

    const [
      apiError,
      setApiError,
    ] =
      useState('');

    const [
      success,
      setSuccess,
    ] =
      useState(false);

    const [
      loading,
      setLoading,
    ] =
      useState(false);

    const handleChange =
      (event) => {
        const {
          name,
          value,
        } =
          event.target;

        setFormData(
          (current) => ({
            ...current,
            [name]:
              value,
          })
        );

        if (
          errors[name]
        ) {
          setErrors(
            (current) => ({
              ...current,
              [name]:
                null,
            })
          );
        }

        if (
          apiError
        ) {
          setApiError(
            ''
          );
        }
      };

    const validate =
      () => {
        const validationErrors =
          {};

        if (
          !formData.password
        ) {
          validationErrors.password =
            'La contraseña es obligatoria';
        } else {
          const passwordError =
            getPasswordError(
              formData.password
            );

          if (
            passwordError
          ) {
            validationErrors.password =
              passwordError;
          }
        }

        if (
          !formData
            .confirmPassword
        ) {
          validationErrors.confirmPassword =
            'Confirma la contraseña';
        } else if (
          formData.password !==
          formData
            .confirmPassword
        ) {
          validationErrors.confirmPassword =
            'Las contraseñas no coinciden';
        }

        setErrors(
          validationErrors
        );

        return (
          Object.keys(
            validationErrors
          ).length === 0
        );
      };

    const handleSubmit =
      async (event) => {
        event.preventDefault();

        setApiError(
          ''
        );

        if (!token) {
          setApiError(
            'El enlace de recuperación no es válido.'
          );

          return;
        }

        if (!validate()) {
          return;
        }

        try {
          setLoading(
            true
          );

          await resetPasswordApi({
            token,

            password:
              formData.password,
          });

          setSuccess(
            true
          );
        } catch (
          requestError
        ) {
          if (
            requestError
              ?.status ===
            400
          ) {
            setApiError(
              'El enlace ha caducado, ya se ha utilizado o no es válido. Solicita uno nuevo.'
            );

            return;
          }

          setApiError(
            requestError?.message ||
              'No se ha podido cambiar la contraseña'
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    if (!token) {
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
              Enlace no válido
            </h1>

            <p
              className={
                styles.subtitle
              }
            >
              Este enlace de
              recuperación no
              contiene un token
              válido.
            </p>

            <Link
              to="/forgot-password"
              className={
                styles.primaryLink
              }
            >
              Solicitar un nuevo
              enlace
            </Link>
          </section>
        </main>
      );
    }

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
          {success ? (
            <>
              <h1
                className={
                  styles.title
                }
              >
                Contraseña actualizada
              </h1>

              <div
                className={
                  styles.success
                }
                role="status"
              >
                Tu contraseña se
                ha cambiado
                correctamente.
              </div>

              <p
                className={
                  styles.subtitleAfterSuccess
                }
              >
                Las sesiones
                anteriores han
                dejado de ser
                válidas. Inicia
                sesión con tu
                nueva contraseña.
              </p>

              <Link
                to="/login"
                className={
                  styles.primaryLink
                }
              >
                Iniciar sesión
              </Link>
            </>
          ) : (
            <>
              <h1
                className={
                  styles.title
                }
              >
                Nueva contraseña
              </h1>

              <p
                className={
                  styles.subtitle
                }
              >
                Crea una nueva
                contraseña segura
                para tu cuenta.
              </p>

              {apiError && (
                <div
                  className={
                    styles.apiError
                  }
                  role="alert"
                >
                  {apiError}
                </div>
              )}

              <form
                onSubmit={
                  handleSubmit
                }
                noValidate
                className={
                  styles.form
                }
              >
                <div>
                  <FormInput
                    label="Nueva contraseña"
                    name="password"
                    type="password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    error={
                      errors.password
                    }
                    placeholder="Contraseña segura"
                    autoComplete="new-password"
                    required
                  />

                  <ul
                    className={
                      styles.passwordRequirements
                    }
                  >
                    {PASSWORD_REQUIREMENTS.map(
                      ({
                        key,
                        label,
                        test,
                      }) => {
                        const passed =
                          test(
                            formData.password
                          );

                        return (
                          <li
                            key={
                              key
                            }
                            className={
                              passed
                                ? styles.requirementValid
                                : styles.requirement
                            }
                          >
                            {
                              label
                            }
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>

                <FormInput
                  label="Confirmar contraseña"
                  name="confirmPassword"
                  type="password"
                  value={
                    formData
                      .confirmPassword
                  }
                  onChange={
                    handleChange
                  }
                  error={
                    errors
                      .confirmPassword
                  }
                  placeholder="Repite la contraseña"
                  autoComplete="new-password"
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
                  Cambiar contraseña
                </Button>
              </form>
            </>
          )}
        </section>
      </main>
    );
  };

export default ResetPasswordPage;