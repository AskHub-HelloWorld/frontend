//User API 구현
import api from './api';
import type { MyPageData, SignoutResponse } from '../types/user';
import type { ApiResponse } from '../types/auth';

// 마이페이지 조회
export const getMyPage = async (): Promise<MyPageData> => {
  const { data } = await api.get<ApiResponse<MyPageData>>('/api/users/my');
  return data.data;
};

// 회원탈퇴
export const signout = async (): Promise<string> => {
  const { data } = await api.patch<SignoutResponse>('/api/users/signout');
  return data.data;
};