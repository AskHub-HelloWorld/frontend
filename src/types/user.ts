//user type정의
import type { ApiResponse } from './auth';

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
  position: string;
  email: string;
  joinedDate: string;
  postCount: number;
  myCommentCount: number;
  point: number;
  myPostList: MyPost[];
  myPointHistory: PointHistory[];
}

// ApiResponse 래핑 타입
export type MyPageResponse = ApiResponse<MyPageData>;
export type SignoutResponse = ApiResponse<string>;