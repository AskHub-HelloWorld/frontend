//post type정의
import type { ApiResponse } from './auth';
import type { Position } from './auth';

// 카테고리 (게시글 직군 필터)
export type Category = 
  | 'FRONTEND' 
  | 'BACKEND' 
  | 'AI' 
  | 'DESIGNER' 
  | 'FULLSTACK' 
  | 'SECURITY' 
  | 'UNKNOWN' 
  | 'OTHER';

// 페이지네이션 요청 파라미터
export interface PageRequest {
  page: number;
  size: number;
  sort?: string[];
}

// 게시글 목록 아이템
export interface PostItem {
  postId: number;
  title: string;
  content: string;
  position: Position;
  point: number;
  isResolved: boolean;
  writer: string;
  isMine: boolean;
  createdAt: string;
  commentCount: number;
}

// 페이지네이션 응답 래퍼
export interface PageData<T> {
  content: T[];
  page: number;
  size: number;
  hasNext: boolean;
}

// 채택된 댓글
export interface ResolvedComment {
  writer: string;
  position: Position;
  createdAt: string;
  content: string;
}

// 게시글 상세
export interface PostDetail {
  title: string;
  content: string;
  position: Position;
  isResolved: boolean;
  writer: string;
  createdAt: string;
  commentCount: number;
  resolvedComment: ResolvedComment | null;
}

// 게시글 생성 요청
export interface CreatePostRequest {
  title: string;
  isAnonymous: boolean;
  content: string;
  point: number;
  position: Position;
}

// ApiResponse 타입 별칭
export type PostListResponse = ApiResponse<PageData<PostItem>>;
export type PostDetailResponse = ApiResponse<PostDetail>;
export type CreatePostResponse = ApiResponse<number>; // 생성된 postId 반환
export type ResolvePostResponse = ApiResponse<string>;