import api from './api';
import type {
  MyPageData,
  ActivitySummary,
  UpdateUserRequest,
  UserSearchResult,
  MyPageResponse,
  SignoutResponse,
  ActivitySummaryResponse,
  UpdateUserResponse,
  CheckEmailResponse,
  UserSearchResponse,
} from '../types/user';

// 마이페이지 조회
export const getMyPage = async (): Promise<MyPageData> => {
  const { data } = await api.get<MyPageResponse>('/api/users/my');
  return data.data;
};

// 내 활동 요약
export const getActivitySummary = async (): Promise<ActivitySummary> => {
  const { data } = await api.get<ActivitySummaryResponse>('/api/users');
  return data.data;
};

// 회원 정보 수정
export const updateUser = async (body: UpdateUserRequest): Promise<string> => {
  const { data } = await api.patch<UpdateUserResponse>('/api/users', body);
  return data.data;
};

// 회원 탈퇴
export const signout = async (): Promise<string> => {
  const { data } = await api.patch<SignoutResponse>('/api/users/signout');
  return data.data;
};

// 이메일 중복 확인
export const checkEmail = async (email: string): Promise<string> => {
  const { data } = await api.post<CheckEmailResponse>('/api/users/email', { email });
  return data.data;
};

// 회사명으로 사원 검색
export const searchUsersByCompany = async (company: string): Promise<UserSearchResult> => {
  const { data } = await api.get<UserSearchResponse>('/api/users/search', {
    params: { company },
  });
  return data.data;
};