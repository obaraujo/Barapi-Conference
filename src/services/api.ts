import axios, { AxiosRequestConfig } from "axios";

export const apiBarapiV1 = axios.create({
  baseURL: "/api/brp/v1",
} as AxiosRequestConfig);

export const apiBarapiV2 = axios.create({
  baseURL: "https://www.barapi.shop/api/brp/v2",
} as AxiosRequestConfig);
export const ajaxWordPress = axios.create({
  baseURL: "/wp-admin/admin-ajax.php",
} as AxiosRequestConfig);
