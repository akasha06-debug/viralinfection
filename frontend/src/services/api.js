import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

export async function submitAnalysis(formData) {
  const response = await api.post('/analysis', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}
