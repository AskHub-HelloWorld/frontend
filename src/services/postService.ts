//Convention API 구현
import api from './api';
import type {
  PostListResponse,
  PostDetailResponse,
  CreatePostResponse,
  ResolvePostResponse,
  CreatePostRequest,
  PageRequest,
  PageData,
  PostItem,
  PostDetail,
} from '../types/post';
import type { Category } from '../types/post';

// 공통 pageable 파라미터 변환
const toPageParams = (pageable: PageRequest) => ({
  page: pageable.page,
  size: pageable.size,
  ...(pageable.sort && { sort: pageable.sort.join(',') }),
});

// 1. 전체 게시글 목록 조회
export const getPosts = async (pageable: PageRequest): Promise<PageData<PostItem>> => {
  const { data } = await api.get<PostListResponse>('/api/posts', {
    params: toPageParams(pageable),
  });
  return data.data;
};

// 2. 게시글 생성
export const createPost = async (body: CreatePostRequest): Promise<number> => {
  const { data } = await api.post<CreatePostResponse>('/api/posts', body);
  return data.data; // 생성된 postId 반환
};

// 3. 게시글 상세 조회
export const getPostDetail = async (postId: number): Promise<PostDetail> => {
  const { data } = await api.get<PostDetailResponse>(`/api/posts/${postId}`);
  return data.data;
};

// 4. 게시글 답변 채택
export const resolvePost = async (postId: number, commentId: number): Promise<string> => {
  const { data } = await api.patch<ResolvePostResponse>(`/api/posts/${postId}`, null, {
    params: { commentId },
  });
  return data.data;
};

// 5. 미채택 게시글 목록 조회
export const getUnresolvedPosts = async (pageable: PageRequest): Promise<PageData<PostItem>> => {
  const { data } = await api.get<PostListResponse>('/api/posts/unresolved', {
    params: toPageParams(pageable),
  });
  return data.data;
};

// 6. 게시글 검색
export const searchPosts = async (keyword: string, pageable: PageRequest): Promise<PageData<PostItem>> => {
  const { data } = await api.get<PostListResponse>('/api/posts/search', {
    params: {
      keyword,
      ...toPageParams(pageable),
    },
  });
  return data.data;
};

// 7. 내가 작성한 게시글 목록 조회
export const getMyPosts = async (pageable: PageRequest): Promise<PageData<PostItem>> => {
  const { data } = await api.get<PostListResponse>('/api/posts/my', {
    params: toPageParams(pageable),
  });
  return data.data;
};

// 8. 카테고리별 게시글 목록 조회
export const getPostsByCategory = async (category: Category, pageable: PageRequest): Promise<PageData<PostItem>> => {
  const { data } = await api.get<PostListResponse>('/api/posts/category', {
    params: {
      category,
      ...toPageParams(pageable),
    },
  });
  return data.data;
};