import type { ApiResponse } from './auth';

// 팀 생성 응답
export interface CreateTeamData {
  teamId: number;
  sessionId: number;
}

//파일 정보
export interface ConventionItem {
  conventionId: number;
  conventionName: string;
}

// 세션 내부 정보 (팀 상세)
export interface TeamDetail {
  name: string;
  conventionResponses: ConventionItem[];
  userNameList: string[];
  captainName: string;
}

// 컨벤션 파일 다운로드 응답
export interface ConventionDownloadData {
  presignedUrl: string;
}

// 참여자 초대 요청
export interface InviteUsersRequest {
  teamId: number;
  userIds: number[];
}

// ApiResponse 타입 별칭
export type CreateTeamResponse = ApiResponse<CreateTeamData>;
export type TeamDetailResponse = ApiResponse<TeamDetail>;
export type AddConventionResponse = ApiResponse<string>;
export type InviteUsersResponse = ApiResponse<string>;
export type ConventionDownloadResponse = ApiResponse<ConventionDownloadData>;
export type DeleteConventionResponse = ApiResponse<string>;