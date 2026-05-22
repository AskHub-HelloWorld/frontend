//Team API 구현
import api from './api';
import type {
  CreateTeamData,
  TeamDetail,
  InviteUsersRequest,
  CreateTeamResponse,
  TeamDetailResponse,
  AddConventionResponse,
  InviteUsersResponse,
  ConventionDownloadResponse,
  DeleteConventionResponse,
} from '../types/team';

// 1. 새 팀 생성
export const createTeam = async (
  name: string,
  userIds: number[],
  files?: File[]
): Promise<CreateTeamData> => {
  const formData = new FormData();
  if (files && files.length > 0) {
    files.forEach(file => formData.append('multipartFileList', file));
  } else {

    formData.append('multipartFileList', new Blob([]), '');
  }

  const { data } = await api.post<CreateTeamResponse>('/api/teams', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    params: {
      name,
      userIds,  
    },
  });
  return data.data;
};

// 2. 컨벤션 파일 추가 (방장만)
export const addConvention = async (teamId: number, file: File): Promise<number> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post<AddConventionResponse>(
    `/api/teams/${teamId}/conventions`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data.data; // conventionId 반환
};

// 3. 참여자 초대 (세션 생성)
export const inviteUsers = async (body: InviteUsersRequest): Promise<string> => {
  const { data } = await api.post<InviteUsersResponse>('/api/teams/sessions', body);
  return data.data;
};

// 4. 세션 내부 정보 조회
export const getTeamDetail = async (teamId: number): Promise<TeamDetail> => {
  const { data } = await api.get<TeamDetailResponse>(`/api/teams/${teamId}`);
  return data.data;
};

// 5. 컨벤션 파일 다운로드
export const downloadConvention = async (conventionId: number): Promise<string> => {
  const { data } = await api.get<ConventionDownloadResponse>(
    `/api/teams/conventions/${conventionId}`
  );
  return data.data.presignedUrl; // presignedUrl 바로 반환
};

// 6. 컨벤션 파일 삭제 (방장만)
export const deleteConvention = async (teamId: number, conventionId: number): Promise<string> => {
  const { data } = await api.delete<DeleteConventionResponse>(
    `/api/teams/${teamId}/conventions/${conventionId}`
  );
  return data.data;
};