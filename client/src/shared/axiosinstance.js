import axios from 'axios';

const axiosinstance = axios.create({
  baseURL: '/api',
});

let accessToken = '';

export function setAccessToken(token) {
  accessToken = token
}

axiosinstance.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config;
})

axiosinstance.interceptors.response.use((res) => res, async (err) => {
  const prev = err.config;
  if (err.response?.status === 403 && !prev.sent) {
    try {
      const response = await axios.get('/api/auth/refresh');
      prev.sent = true;
      const newToken = response.data.accessToken;
      setAccessToken(newToken);
      prev.headers.Authorization = `Bearer ${newToken}`;
      return axiosinstance(prev)
    } catch (refreshError) {
      return Promise.reject(refreshError)
    }
  }
  return Promise.reject(err)
})

export default axiosinstance;