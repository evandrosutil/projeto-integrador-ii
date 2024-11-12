import { jwtDecode } from 'jwt-decode';
import api from './api';

export const TOKEN_KEY = "token";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const USER_DATA_KEY = "userData";

export const login = async (username, password) => {
  try {
    console.log('Tentando login com:', { username });
    const response = await api.post('/token/', { username, password });
    console.log('Resposta do login:', response.data);
    const { access, refresh } = response.data;
  
    const decodedToken = jwtDecode(access);

    console.log('decoded: ', decodedToken);

    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);

    const userData = {
      username: decodedToken.username,
      role: decodedToken.role, 
    };
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Erro no login: ', error.response?.data || error.message);
  }
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  console.log('Token encontrado:', !!token);
  return !!token;
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const getUserData = () => {
  const userDataString = localStorage.getItem(USER_DATA_KEY);
  return userDataString ? JSON.parse(userDataString) : null;
};
