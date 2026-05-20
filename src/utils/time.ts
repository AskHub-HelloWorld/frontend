// src/utils/date.ts

// 뒤에 Z 붙여서 UTC로 명시 후 한국시간으로 변환
const toKST = (dateStr: string): Date => {
  return new Date(dateStr + 'Z'); // 'Z' = UTC 명시
};

// 날짜만
export const formatDate = (dateStr: string): string => {
  return toKST(dateStr).toLocaleDateString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// 날짜 + 시간
export const formatDateTime = (dateStr: string): string => {
  return toKST(dateStr).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};