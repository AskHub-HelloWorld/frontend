import type { ApiResponse } from './auth';
import type { Position } from './auth';

// 내 게시글
export interface MyPost {
  title: string;
  createdAt: string;
  commentCount: number;
  isResolved: boolean;
}

// 포인트 내역
export interface PointHistory {
  point: number;
  dateTime: string;
}

// 마이페이지 응답
export interface MyPageData {
  name: string;
  company: string;
  position: Position;
  email: string;
  joinedDate: string;
  postCount: number;
  myCommentCount: number;
  point: number;
  myPostList: MyPost[];
  myPointHistory: PointHistory[];
}

// 내 활동 요약
export interface ActivitySummary {
  postCount: number;
  commentCount: number;
  point: number;
}

// 회원 정보 수정 요청
export interface UpdateUserRequest {
  name: string;
  company: string;
  position: Position;
  email: string;
  joinedDate: string; // 'YYYY-MM-DD'
}

// 회사명으로 사원 검색 결과
export interface UserSearchItem {
  userId: number;
  name: string;
  position: Position;
}

export interface UserSearchResult {
  userList: UserSearchItem[];
}

// ApiResponse 타입 별칭
export type MyPageResponse = ApiResponse<MyPageData>;
export type SignoutResponse = ApiResponse<string>;
export type ActivitySummaryResponse = ApiResponse<ActivitySummary>;
export type UpdateUserResponse = ApiResponse<string>;
export type UserSearchResponse = ApiResponse<UserSearchResult>;