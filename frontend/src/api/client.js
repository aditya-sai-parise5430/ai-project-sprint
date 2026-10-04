import axios from 'axios'

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const baseURL = isLocal 
  ? 'http://localhost:8000/v1' 
  : 'https://ai-project-sprint-api.onrender.com/v1';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

export default api
