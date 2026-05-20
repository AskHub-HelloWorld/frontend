import api from './api';
import type {
  SendMessageData,
  SendMessageRequest,
  SessionItem,
  MessageItem,
  SendMessageResponse,
  SessionListResponse,
  MessageListResponse,
  DeleteSessionResponse,
} from '../types/session';
import type { PageData, PageRequest } from '../types/post';

// 공통 pageable 파라미터 변환
const toPageParams = (pageable: PageRequest) => ({
  page: pageable.page,
  size: pageable.size,
  ...(pageable.sort && { sort: pageable.sort.join(',') }),
});

// 1. 메시지 보내기
export const sendMessage = async (body: SendMessageRequest): Promise<SendMessageData> => {
  const { data } = await api.post<SendMessageResponse>('/api/sessions/messages', body);
  return data.data;
};

// 2. 내 세션 목록 조회
export const getSessions = async (pageable: PageRequest): Promise<PageData<SessionItem>> => {
  const { data } = await api.get<SessionListResponse>('/api/sessions', {
    params: toPageParams(pageable),
  });
  return data.data;
};

// 3. 메시지 목록 조회
export const getMessages = async (
  sessionId: number,
  pageable: PageRequest
): Promise<PageData<MessageItem>> => {
  const { data } = await api.get<MessageListResponse>(
    `/api/sessions/${sessionId}/messages`,
    { params: toPageParams(pageable) }
  );
  return data.data;
};

// 4. 세션 검색
export const searchSessions = async (
  keyword: string,
  pageable: PageRequest
): Promise<PageData<SessionItem>> => {
  const { data } = await api.get<SessionListResponse>('/api/sessions/search', {
    params: {
      keyword,
      ...toPageParams(pageable),
    },
  });
  return data.data;
};

// 5. 세션 삭제
export const deleteSession = async (sessionId: number): Promise<string> => {
  const { data } = await api.delete<DeleteSessionResponse>(`/api/sessions/${sessionId}`);
  return data.data;
};