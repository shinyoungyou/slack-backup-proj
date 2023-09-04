import axios, { AxiosError, AxiosResponse } from "axios";
import { Message } from "@/models/message";
import { AxiosRequestConfig } from "axios";
import { PaginatedResult } from "@/models/pagination";
import { toast } from "react-toastify";
import { router } from "@/router/Routes";


interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  sent?: boolean;
}

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

// axios.interceptors.request.use(config => {
//   const token = store.getState().account.user?.token;
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// })

axios.interceptors.response.use(async response => {
  if (process.env.NODE_ENV === 'development') await sleep();
  const pagination = response.headers['pagination'];
  if (pagination) {
      response.data = new PaginatedResult(response.data, JSON.parse(pagination));
      return response;
  }
  return response
}, (error: AxiosError) => {
  const {data, status} = error.response as AxiosResponse;
  switch (status) {
      case 400:
          if (data.errors) {
              const modelStateErrors: string[] = [];
              for (const key in data.errors) {
                  if (data.errors[key]) {
                      modelStateErrors.push(data.errors[key])
                  }
              }
              throw modelStateErrors.flat();
          }
          toast.error(data.title);
          break;
      case 401:
          toast.error(data.title);
          break;
      case 403: 
          toast.error('You are not allowed to do that!');
          break;
      case 500:
          router.navigate('/server-error', {state: {error: data}});
          break;
      default:
          break;
  }

  return Promise.reject(error.response);
})

const requests = {
  get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  patch: <T>(url: string, body: {}) =>
    axios.patch<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Messages = {
  list: (params: URLSearchParams) => requests.get(`/messages`, params),
  details: (id: string) => requests.get(`/messages/${id}`),
};

const agent = {
  Messages,
};

export default agent;
