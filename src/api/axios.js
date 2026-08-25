import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const normalizeHttpError = (error) => {
  if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
    return {
      status: null,
      code: 'REQUEST_CANCELED',
      message: 'Request canceled',
    };
  }

  if (!error.response) {
    return {
      status: null,
      code: 'NETWORK_ERROR',
      message: 'No se ha podido conectar con el servidor',
    };
  }

  const { status, data } = error.response;

  return {
    status,
    code: data?.error?.code || 'HTTP_ERROR',
    message:
      data?.error?.message ||
      'Se ha producido un error en la solicitud',
  };
};

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeHttpError(error))
);

export default apiClient;