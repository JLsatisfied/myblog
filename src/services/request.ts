/**
 * HTTP 请求封装 —— 基于 axios
 *
 * 后端全局拦截器将响应包装为 { code, data, msg, total? } 格式。
 * 导出 get / post 方法，调用方不直接接触 axios 实例。
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

// ─── 配置 ──────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5005';

/** axios 实例 */
const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── 响应拦截 ──────────────────────────────────────────────

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.msg ?? error.message ?? '网络请求失败';
    return Promise.reject(new Error(message));
  },
);

// ─── 封装方法 ──────────────────────────────────────────────

/**
 * GET 请求
 * @param url   接口路径（自动拼接 baseURL）
 * @param params  查询参数
 * @returns 响应中的 data 字段
 */
export async function get<T>(
  url: string,
  params?: Record<string, unknown>,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await http.get<T>(url, { params, ...config });
  return data;
}

/**
 * POST 请求
 * @param url   接口路径
 * @param body  请求体
 * @returns 响应中的 data 字段
 */
export async function post<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await http.post<T>(url, body, config);
  return data;
}
