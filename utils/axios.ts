import axios from 'axios'; 
import { API_BASE_URL } from './constant';

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, 
  headers: { 'Content-Type': 'application/json' },
});

export default instance;
