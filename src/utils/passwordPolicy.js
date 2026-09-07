export const PASSWORD_REQUIREMENTS = [
  {
    key: 'length',
    label:
      'Al menos 8 caracteres',
    test: (password) =>
      password.length >= 8,
  },
  {
    key: 'lowercase',
    label:
      'Una letra minúscula',
    test: (password) =>
      /[a-z]/.test(
        password
      ),
  },
  {
    key: 'uppercase',
    label:
      'Una letra mayúscula',
    test: (password) =>
      /[A-Z]/.test(
        password
      ),
  },
  {
    key: 'number',
    label:
      'Un número',
    test: (password) =>
      /\d/.test(
        password
      ),
  },
  {
    key: 'special',
    label:
      'Un carácter especial',
    test: (password) =>
      /[^A-Za-z0-9]/.test(
        password
      ),
  },
];

export const validatePassword =
  (password) => {
    if (
      typeof password !==
      'string'
    ) {
      return {
        isValid: false,
        failedRequirements:
          PASSWORD_REQUIREMENTS,
      };
    }

    const failedRequirements =
      PASSWORD_REQUIREMENTS.filter(
        ({ test }) =>
          !test(
            password
          )
      );

    return {
      isValid:
        failedRequirements.length ===
        0,

      failedRequirements,
    };
  };

export const getPasswordError =
  (password) => {
    const {
      isValid,
      failedRequirements,
    } =
      validatePassword(
        password
      );

    if (isValid) {
      return null;
    }

    return `La contraseña debe incluir: ${failedRequirements
      .map(
        ({ label }) =>
          label.toLowerCase()
      )
      .join(', ')}`;
  };