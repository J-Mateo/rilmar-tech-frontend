import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Correo electrónico o contraseña incorrectos.');
    }
    const message = error.response?.data?.message || 'Error al conectar con el servidor.';
    throw new Error(message);
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al completar el registro.';
    throw new Error(message);
  }
};