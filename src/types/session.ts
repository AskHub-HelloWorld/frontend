import type { ApiResponse } from './auth';
import type { PageData, PageRequest } from './post';

// 메시지 역할
export type MessageRole = 'ASKER' | 'REPLIER';

// 메시지 단일 아이템 (전송 응답용)
export interface MessageRoleItem {
  messageId: number;
  role: MessageRole;
}

// 메시지 전송 응답
export interface SendMessageData {
  asker: MessageRoleItem;
  replier: MessageRoleItem;
}

// 메시지 전송 요청
export interface SendMessageRequest {
  sessionId: number;
  teamId: number;
  message: string;
  files?: File[];
}

// 세션 목록 아이템
export interface SessionItem {
  teamId: number;
  sessionId: number;
  teamName: string;
  messagePreview: string;
  captainName: string;
}

// 메시지 목록 아이템 - response 안에 messageId, role
export interface MessageItem {
  response: {
    messageId: number;
    role: MessageRole;
    content : string ;
  };
}

// ApiResponse 타입 별칭
export type SendMessageResponse = ApiResponse<SendMessageData>;
export type SessionListResponse = ApiResponse<PageData<SessionItem>>;
export type MessageListResponse = ApiResponse<PageData<MessageItem>>;
export type DeleteSessionResponse = ApiResponse<string>;

export type { PageRequest };