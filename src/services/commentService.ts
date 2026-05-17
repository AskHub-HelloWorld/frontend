//지식인 답변 api함수
import api from './api';
import type {
  CommentItem,
  CommentListResponse,
  CreateCommentResponse,
  CreateCommentRequest,
} from '../types/comment';
import type { PageData, PageRequest } from '../types/post';
import type { ApiResponse } from '../types/auth';

// 공통 pageable 파라미터 변환
const toPageParams = (pageable: PageRequest) => ({
  page: pageable.page,
  size: pageable.size,
  ...(pageable.sort && { sort: pageable.sort.join(',') }),
});

// 1. 댓글 생성
export const createComment = async (body: CreateCommentRequest): Promise<number> => {
  const { data } = await api.post<CreateCommentResponse>('/api/posts/comments', body);
  return data.data; // 생성된 commentId 반환
};

// 2. 게시글 댓글 목록 조회
export const getComments = async (postId: number, pageable: PageRequest): Promise<PageData<CommentItem>> => {
  const { data } = await api.get<CommentListResponse>(`/api/posts/${postId}/comments`, {
    params: toPageParams(pageable),
  });
  return data.data;
};

// 3. 내가 작성한 댓글 목록 조회 (오타 그대로 반영: commnets)
export const getMyComments = async (pageable: PageRequest): Promise<PageData<CommentItem>> => {
  const { data } = await api.get<ApiResponse<PageData<CommentItem>>>('/api/posts/commnets/my', {
    params: toPageParams(pageable),
  });
  return data.data;
};