import { BACKEND_URL } from "../../config";
export const BINANCE_WS_URL = 'wss://stream.binance.com:9443';
export const BINANCE_REST_URL = 'https://api.binance.com/api';
export const SUPPORTED_PAIRS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'ADAUSDT'] as const;
export type SupportedPair = typeof SUPPORTED_PAIRS[number];

export const API_BASE_URL = `${BACKEND_URL}/api`; // Adjust if needed

export const AUTH_API = {
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: (token: string) => `${API_BASE_URL}/auth/reset-password/${token}`,
  VALIDATE_RESET_TOKEN: (token: string) => `${API_BASE_URL}/auth/validate-reset-token/${token}`,
  UPDATE_PROFILE: `${API_BASE_URL}/auth/update-profile`,        // New endpoint for updating name and avatar
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,      // New endpoint for changing password
  DELETE_ACCOUNT: `${API_BASE_URL}/auth/delete`,
  UPDATE_PROFILE_PICTURE: `${API_BASE_URL}/auth/update-profile-picture`,
};