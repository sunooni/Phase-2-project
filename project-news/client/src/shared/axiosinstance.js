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
  if (err.status === 403 && !prev.sent) {
    const response = await axios.get('/api/auth/refresh');
    prev.sent = true;
    setAccessToken(response.data.accessToken);
    prev.headers.Authorization = `Bearer ${accessToken}`;
    return axiosinstance(prev)
  }
  return Promise.reject(err)
})

export default axiosinstance;