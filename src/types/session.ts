import type { ApiResponse } from './auth';
import type { PageData, PageRequest } from './post';

// 메시지 전송 응답
export interface SendMessageData {
  requestMessageId: number;
  responseMessageId: number;
}

// 메시지 전송 요청
export interface SendMessageRequest {
  files?: string[];
  request: {
    sessionId: number;
    teamId: number;
    message: string;
  };
}

// 세션 목록 아이템
export interface SessionItem {
  teamId: number;
  sessionId: number;
  teamName: string;
  messagePreview: string;
  captainName: string;
}

// 메시지 아이템
export interface MessageItem {
  messageId: number;
  content: string;
}

// ApiResponse 타입 별칭
export type SendMessageResponse = ApiResponse<SendMessageData>;
export type SessionListResponse = ApiResponse<PageData<SessionItem>>;
export type MessageListResponse = ApiResponse<PageData<MessageItem>>;
export type DeleteSessionResponse = ApiResponse<string>;

// PageRequest 재사용
export type { PageRequest };