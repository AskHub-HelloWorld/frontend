//auth type 정의

//1. 직군 타입
export type Position =
  | 'FRONTEND'
  | 'BACKEND'
  | 'DESIGNER'
  | 'DEVOPS'
  | 'PM'
  | 'AI'
  | 'SECURITY'
  | 'FULLSTACK';

//================= 요청 타입 =======================================

//회원가입
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  company: string;
  position: Position;
  joinedDate: string; // 'YYYY-MM-DD'
}

//2. 로그인 형식
export interface LoginRequest {
  email: string;
  password: string;
}

//3. 회원 복구 형식
export interface RestoreRequest {
  email: string;
  password: string;
}



//========================== 응답 타입=================================

//1. 모든 응답
export interface ApiResponse<T> {
  result: 'SUCCESS' | 'FAIL';
  code: string;
  message: string;
  data: T;
}

//2. user 정보 형식
export interface UserInfo {
  id: number;
  email: string;
  name: string;
}

// 3. 토큰 타입
export interface TokenData {
  accessToken: string;
  refreshToken: string;
}

export type CheckEmailResponse = ApiResponse<string>;
