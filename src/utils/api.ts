import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiResponse } from '../types';
import dotenv from 'dotenv';
dotenv.config();

export class EmblemApi {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      }
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use((config) => {
      console.debug(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          console.error('API Error:', error.response.data);
          throw new Error(error.response.data.message || 'API request failed');
        }
        throw error;
      }
    );
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get(endpoint, config);
    return response.data;
  }

  async post<T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post(endpoint, data, config);
    return response.data;
  }

  updateApiKey(newApiKey: string): void {
    this.apiKey = newApiKey;
    this.client.defaults.headers['x-api-key'] = newApiKey;
  }

  updateBaseUrl(newBaseUrl: string): void {
    this.client.defaults.baseURL = newBaseUrl;
  }
}
