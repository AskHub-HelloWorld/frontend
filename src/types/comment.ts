//지식인 답변 type
import type { ApiResponse } from './auth';
import type { Position } from './auth';
import type { PageData, PageRequest } from './post';

// 댓글 아이템
export interface CommentItem {
  commentId: number;
  writer: string;
  position: Position;
  createdAt: string;
  content: string;
  isMine: boolean;
}

// 댓글 생성 요청
export interface CreateCommentRequest {
  content: string;
  isAnonymous: boolean;
  postId: number;
}

// ApiResponse 타입 별칭
export type CommentListResponse = ApiResponse<PageData<CommentItem>>;
export type CreateCommentResponse = ApiResponse<number>; // 생성된 commentId 반환

// PageRequest는 post.ts에서 재사용
export type { PageRequest };