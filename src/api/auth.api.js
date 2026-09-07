import apiClient from './axios';

export const loginApi = async (
  credentials
) => {
  const response =
    await apiClient.post(
      '/auth/login',
      credentials
    );

  return response.data;
};

export const registerApi = async (
  userData
) => {
  const response =
    await apiClient.post(
      '/auth/register',
      userData
    );

  return response.data;
};

export const logoutApi = async () => {
  const response =
    await apiClient.post(
      '/auth/logout'
    );

  return response.data;
};

export const getProfileApi = async () => {
  const response =
    await apiClient.get(
      '/users/profile'
    );

  return response.data;
};

export const forgotPasswordApi =
  async (email) => {
    const response =
      await apiClient.post(
        '/auth/forgot-password',
        {
          email,
        }
      );

    return response.data;
  };

export const resetPasswordApi =
  async ({
    token,
    password,
  }) => {
    const response =
      await apiClient.post(
        '/auth/reset-password',
        {
          token,
          password,
        }
      );

    return response.data;
  };