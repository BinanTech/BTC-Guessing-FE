import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../context/authContext';
import { AuthTokenError } from './errors/AuthTokenError';

let isRefreshing: boolean = false;
let failedRequestQueue: any[] = [];

export function setupAPIClient(ctx: any = undefined) {
  let cookies = parseCookies(ctx);

  const api =  axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      Authorization: `Bearer ${cookies['nextauth.token']}`
    }
  });
  
  api.interceptors.response.use(response => {
    return response;
  }, (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        cookies = parseCookies(ctx);
  
        const { 'nextauth.refreshToken': refreshToken } = cookies;
        const originalConfig: AxiosRequestConfig<any> = error.config;
  
        if (!isRefreshing) {
          isRefreshing = true;
  
          api.post('/auth/refresh-token', {
            refreshToken,
          }).then(response => {
            const { tokens } = response.data;
    
            setCookie(ctx, 'nextauth.token', tokens.accessToken, {
              maxAge: 60 * 60 * 24 *30, // 30 Dias
              path: '/'
            });
      
            setCookie(ctx, 'nextauth.refreshToken', response.data.refreshToken, {
              maxAge: 60 * 60 * 24 *30, // 30 Dias
              path: '/'
            });
    
            api.defaults.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
  
            failedRequestQueue.forEach(request => request.onSuccess(tokens.accessToken));
            failedRequestQueue = [];
          }).catch(error => {
            failedRequestQueue.forEach(request => request.onFailure(error));
            failedRequestQueue = [];
  
            if (process.browser) {
              signOut();
            }
          }).finally(() => {
            isRefreshing = false;
          });
        }
  
        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`;
  
              resolve(api(originalConfig));
            },
            onFailure: (error: AxiosError) => {
              reject(error);
            }
          })
        });
      } else {
        if (process.browser) {
          signOut();
        } else {
          return Promise.reject(new AuthTokenError())
        }
      }
    }
  
    return Promise.reject(error);
  });

  return api;
}