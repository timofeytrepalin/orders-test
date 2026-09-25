import axios from 'axios';

export const httpService = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 30000,
  responseType: 'json',
});

export default httpService;