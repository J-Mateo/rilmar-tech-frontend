import apiClient from './axios';

export const getAdminUsersApi = async (
  params = {},
  options = {}
) => {
  const response =
    await apiClient.get(
      '/users/admin',
      {
        params,
        ...options,
      }
    );

  return response.data;
};