import api from './api';
import type {
  ApiResponse,
  TokenData,
  SignupRequest,
  LoginRequest,
  RestoreRequest,
  CheckEmailResponse,
} from '../types/auth';

// 회원가입 - data: string 반환
export const signup = async (body: SignupRequest): Promise<string> => {
  const { data } = await api.post<ApiResponse<string>>('/auth/signup', body);
  return data.data;
};

// 로그인 - accessToken, refreshToken 반환
export const login = async (body: LoginRequest): Promise<TokenData> => {
  const { data } = await api.post<ApiResponse<TokenData>>('/auth/login', body);
  return data.data;
};

// 로그아웃 - data: string 반환
export const logout = async (): Promise<string> => {
  const { data } = await api.post<ApiResponse<string>>('/auth/logout');
  return data.data;
};

// refresh token 재발급
export const reissue = async (): Promise<TokenData> => {
  const { data } = await api.post<ApiResponse<TokenData>>('/auth/reissue');
  return data.data;
};

// 회원복구 - data: string 반환
export const restore = async (body: RestoreRequest): Promise<string> => {
  const { data } = await api.patch<ApiResponse<string>>('/auth/restore', body);
  return data.data;
};

// 이메일 중복 확인
export const checkEmail = async (email: string): Promise<string> => {
  const { data } = await api.post<CheckEmailResponse>('/auth/email', { email });
  return data.data;
};