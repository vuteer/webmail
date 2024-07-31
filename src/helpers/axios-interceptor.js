//  a wrapper for axios interceptor
// helps avoid importing and adding headers on each api call
// especially with those calls that require authorization 

import axios from 'axios';
import envs from '../config/env';
import { getCookie } from './cookies';

const headers = {};

const Instance = axios.create({
  baseURL: envs.api_url,
  headers,
});


Instance.interceptors.request.use(
  config => {
    const token = getCookie('_auth') || '';

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
    }
    return config;
  },
  errors => Promise.reject,
);

export default Instance;
