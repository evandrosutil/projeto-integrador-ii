import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// adiciona tokens nas requisições
api.interceptors.request.use(
  config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Configuração da requisição:', config);
  return config;
},
(error) => {
  return Promise.reject(error);
});

// Erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
      const originalRequest = error.config;

      // Se receber um 401 e não for uma tentativa de refresh
      if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
              // Tenta renovar o token
              const refreshToken = localStorage.getItem('refreshToken');
              const response = await api.post('/token/refresh/', {
                  refresh: refreshToken
              });
              
              const { access } = response.data;
              localStorage.setItem('token', access);

              // Refaz a requisição original com o novo token
              originalRequest.headers.Authorization = `Bearer ${access}`;
              return api(originalRequest);
          } catch (refreshError) {
              // Se não conseguir renovar o token, faz logout
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              // Redireciona para login se necessário
              window.location.href = '/login';
              return Promise.reject(refreshError);
          }
      }
      return Promise.reject(error);
  }
);

export default api;
