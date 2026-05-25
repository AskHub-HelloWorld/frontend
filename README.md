# Ask Hub - Frontend

> 사내 지식 공유와 AI 협업을 하나로 연결한 플랫폼

<br />

## 📌 프로젝트 소개

**Ask Hub**는 사내 문서를 기반으로 AI와 대화하고, 동료 간 질문·답변을 통해 자연스럽게 지식을 축적하는 사내 협업 플랫폼입니다.

- 팀 단위로 회사 문서를 공유하고, 각자 AI와 1:1로 대화하며 필요한 정보를 즉시 탐색할 수 있습니다.
- 동료의 질문에 답변하고 답변이 채택되면 포인트가 지급되어 자연스러운 지식 공유 문화를 형성합니다.

> 본 레포지토리는 **Frontend** 전용 레포지토리 입니다.

<br />

## 🔗 프론트 배포 링크

> **[Ask Hub link](https://your-vercel-url.vercel.app)**

<br />

## 🚀 로컬 실행 방법

\```bash
### 1. 저장소 클론
git clone https://github.com/your-repo/ask-hub-frontend.git

### 2. 디렉토리 이동
cd ask-hub-frontend

### 3. 패키지 설치
npm install

### 4. 환경 변수 설정
* 루트에 .env 파일 생성
VITE_BASE_URL = https://www.askhub.cloud
### 5. 개발 서버 실행
npm run dev
\```

## ⚠️ 사용 시 주의사항
* 현재 백엔드는 무료 클라우드 서버 환경에서 운영되고 있습니다.
* AI 채팅 생성 시 업로드 파일 크기는 1MB 이하만 지원됩니다.
* 과도한 채팅 생성 및 대용량 파일 업로드가 반복될 경우 서버 응답 속도가 느려지거나 일시적으로 중단될 수 있습니다.
* 지식인 게시글 작성 시 제목 및 내용 길이가 지나치게 길면 등록이 제한될 수 있습니다.
* 포인트 스토어 기능은 현재 더미 데이터 기반으로 동작하며 실제 구매 기능은 지원되지 않습니다.

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React, TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| 상태관리 | React Context API |
| HTTP 클라이언트 | Axios |
| 라우팅 | React Router DOM v6 |
| 애니메이션 | Framer Motion |
| 마크다운 렌더링 | React Markdown, remark-gfm |
| 아이콘 | Lucide React |
| 배포 | Vercel |

<br />

## 📁 프로젝트 구조

```
src/
├── components/           # 공통 컴포넌트
│   └── layout/           # AppLayout, 사이드바, 헤더
├── context/              # 전역 상태
│   └── AuthContext.tsx   # 로그인 유저 정보 관리
├── pages/                # 페이지 컴포넌트
│   ├── auth/             # 로그인, 회원가입
│   ├── chat/             # AI 채팅
│   ├── dashboard/        # 메인 홈
│   ├── knowledge/        # 지식인 : 글 목록, 글 생성, 글 상세
│   ├── mypage/           # 마이페이지
│   └── store/            # 포인트 스토어
├── router/               # 라우팅 보호 (PrivateRoute)
├── services/             # API 통신 함수 정의 
│   ├── api.ts            # Axios 인스턴스 + 인터셉터
│   ├── authService.ts    # 인증 관련 API
│   ├── userService.ts    # 유저 관련 API
│   ├── postService.ts    # 지식인 게시글 관련 API 
│   ├── commentService.ts # 지식인 댓글 관련 API
│   ├── teamService.ts    # AI채팅 팀 관련 API
│   └── sessionService.ts # AI채팅 세션/메시지 관련 API
├── types/                # TypeScript 타입 정의
│   ├── auth.ts           
│   ├── user.ts
│   ├── post.ts
│   ├── comment.ts
│   ├── team.ts
│   └── session.ts
├── mock/                 # 더미 데이터
│   └── data.ts           # 상점 더미 데이터
└── utils/                # 유틸 함수
    └── time.ts           # 날짜 변환 함수
```

<br />

## ✨ 주요 기능

### 🤖 AI 채팅
- 팀 단위 채팅방 생성 및 팀원 초대
- 회사 문서(PDF 등) 업로드 → 문서 기반 AI 답변
- 마크다운 형식의 AI 응답 렌더링
- 방장 별도 권한 : 파일 업로드, 참여자 초대, 방 삭제

### 💬 지식인 Q&A
- 직군별 카테고리 단일 필터링
- 키워드 검색
- 미답변 / 전체 / 내가 쓴 글 필터
- 답변 채택 시 포인트 지급( 50P )
- 익명 질문 지원
- 페이지네이션 (hasNext 기반)

### 👤 회원 관리
- 회원가입시 이메일 중복 확인
- 회원가입 / 로그인 / 로그아웃 / 회원탈퇴
- JWT AccessToken + RefreshToken 기반 인증
- 토큰 만료(401/403) 시 자동 재발급 (Axios 인터셉터)
- 프로필 편집

### 📊 마이페이지
- 활동 통계 (작성 글, 답변 수, 포인트)
- 내가 쓴 글 목록

<br />

## 🔐 인증 흐름

```
로그인
  → AccessToken + RefreshToken 발급
  → LocalStorage 저장
  → Axios 요청 인터셉터에서 자동 첨부

토큰 만료 (401 / 403)
  → /auth/reissue 자동 호출
  → 새 토큰으로 원래 요청 재시도
  → reissue 실패 시 로그인 페이지로 이동
```

<br />

## 📄 페이지 구성

| 경로 | 페이지 | 접근 권한 |
|------|--------|-----------| 
| `/login` | 로그인 | 공개 |
| `/register` | 회원가입 | 공개 |
| `/dashboard` | 대시보드 | 인증 필요 |
| `/chat` | AI 채팅 | 인증 필요 |
| `/knowledge` | 지식인 목록 | 인증 필요 |
| `/knowledge/write` | 질문 작성 | 인증 필요 |
| `/knowledge/post/:id` | 게시글 상세 | 인증 필요 |
| `/mypage` | 마이페이지 | 인증 필요 |
| `/store` | 포인트 스토어 | 인증 필요 |

## 메인 화면
> 대시보드: 바로가기 링크, 실시간 지식인 게시글 및 포인트 확인
![메인 화면](./assets/main.png)


## ai채팅 화면
> ai채팅 메인: 채팅 생성, 채팅 목록, 채팅 검색
![채팅 메인 화면](./assets/aimain.png)
> ai채팅 상세: 1대1 대화, 파일 업로드, 다운로드, 팀원 추가, 채팅방 나가기(방장만)
![채팅 상세 화면](./assets/aidetail.png)

## 지식인 화면
> 지식인 메인 : 질문 목록, 질문 검색, 필터링( 카테고리 1개 / 내가쓴글만 / 미해결만 )
![지식인 메인 화면](./assets/qamain.png)
> 지식인 등록: 제목, 내용, 답변 부서, 익명 여부 등록
![지식인 등록 화면](./assets/qadetail.png)
> 지식인 상세: 질문 내용, 답변 내용, 답변 입력, 답변 채택(글쓴이만)
![지식인 상세 화면](./assets/qawriting.png)

## 상점 화면
> 상점 : 상품 검색, 필터링, 구매( 현재 포인트 > 상품 금액인 경우 가능)
![상점 화면](./assets/store.png)


## 설정 화면
> 마이페이지 : 개인정보 수정, 내 활동 확인
![마이페이지 화면](./assets/setting.png)


<br />

## 🗂 API 연동 현황

| 도메인 | 연동 여부 |
|--------|-----------|
| 인증 (로그인/회원가입/토큰 재발급) | ✅ 완료 |
| 유저 (마이페이지/프로필 수정/회원탈퇴) | ✅ 완료 |
| 게시글 (목록/상세/작성/검색/카테고리) | ✅ 완료 |
| 댓글 (목록/작성/채택) | ✅ 완료 |
| 팀 (생성/파일 업로드/참여자 초대) | ✅ 완료 |
| 세션/메시지 (AI 채팅) | ✅ 완료 |
| 포인트 스토어 | ❌ 미구현 (더미 데이터) |
<br />

## 🎯 트러블슈팅

### 1. CORS 에러 - 로컬 개발 환경

- **문제**
  - 로컬(`localhost:5173`)에서 AWS EC2 백엔드로 API 요청 시 CORS 에러 발생
  - OPTIONS preflight는 200이지만 실제 XHR 요청 차단
- **원인**
  - Spring Boot CORS 설정에 로컬 주소 미포함
  - Swagger, Postman은 브라우저 보안 정책 미적용으로 정상 작동하여 원인 파악 지연
- **해결**
  - 백엔드에 `localhost:5173` 및 Vercel 배포 도메인 CORS 허용 추가

---

### 2. 토큰 만료 시 자동 재발급 미작동

- **문제**
  - 오랫동안 로그인 상태 유지 후 API 요청 시 403 에러 발생
  - 자동 토큰 재발급이 되지 않아 수동으로 로그아웃 후 재로그인 필요
- **원인**
  - Axios 응답 인터셉터가 `401`만 처리하고 있었으나 백엔드는 토큰 만료 시 `403` 반환
- **해결**
  - 인터셉터에 `403` 조건 추가 및 `/auth/reissue` 재시도 무한루프 방지 처리

---

### 3. CORS 및 인증 예외 처리

- **문제**
  - 배포 후 이메일 중복 확인 API에서 403 Forbidden 발생
  - OPTIONS preflight는 성공했지만 실제 XHR 요청 실패
- **원인**
  - 로그인 전 호출되는 API임에도 Authorization 검증 적용
  - Vercel 배포 도메인이 CORS 허용 목록에 없음
- **해결**
  - 해당 엔드포인트 인증 예외 처리 적용
  - Vercel URL을 CORS 허용 origin에 추가

---

### 4. multipart/form-data 팀 생성 오류

- **문제**
  - 파일 미첨부 시 `Cannot invoke List.iterator() because multipartFileList is null` 발생
  - 파일 첨부 시 `JsonNode.get(String) is null` JSON 파싱 오류 발생
  - `name`, `userIds`를 FormData에 포함하여 전송했으나 백엔드가 query parameter로 기대
- **원인**
  - 백엔드 `multipartFileList` null 체크 누락
  - S3 업로드 응답 파싱 로직 오류
  - API 명세서상 `name`, `userIds`는 query parameter, 파일만 multipart/form-data
- **해결**
  - `name`, `userIds`는 query parameter로, 파일만 FormData로 분리 전송
  - 백엔드 null 체크 및 S3 파싱 로직 수정 요청

---

### 5. 메시지 전송 API Content-Type 오류

- **문제**
  - `POST /api/sessions/messages` 호출 시 `Content-Type 'application/json' is not supported` 에러 발생
- **원인**
  - API 명세서 변경으로 `teamId`, `sessionId`, `message`는 query parameter로, 파일은 multipart/form-data로 전송해야 했으나 전체를 JSON body로 전송
- **해결**
  - 명세서에 맞게 api 전송 type 변경

---

### 6. 서버 시간과 클라이언트 시간 불일치 (UTC vs KST)

- **문제**
  - `createdAt`이 실제 시간보다 9시간 이전으로 표시됨
- **원인**
  - AWS 서버가 UTC 기준으로 시간 저장
  - 백엔드 응답 형식 `"2026-05-20T00:44:10.26886"`에 `Z` suffix 없어 브라우저가 로컬 시간으로 잘못 해석
- **해결**
  - 날짜 문자열 뒤에 `Z`를 붙여 UTC 명시 후 KST로 변환하는 유틸 함수 구현

---

### 7. AI 답변 가독성 문제

- **문제**
  - AI 응답의 코드블록, 줄바꿈, 리스트 등이 마크다운 문자열 그대로 출력됨
- **해결**
  - `react-markdown`, `remark-gfm` 라이브러리 적용
  - AI 메시지에만 마크다운 렌더링 적용, 유저 메시지는 plain text 유지

---

### 8. 채팅방 파일 목록에 파일명 미표시

- **문제**
  - 채팅방 진입 시 공유 파일이 `파일 #1`, `파일 #2` 형태로만 표시됨
- **원인**
  - 팀 상세 조회 API 응답에 `conventionIds: number[]`만 포함되고 파일명 미포함
- **해결**
  - 백엔드에 응답 구조 변경 요청
```json
  // 변경 전
  "conventionIds": [1, 2, 3]

  // 변경 후
  "conventionResponses": [
    { "conventionId": 1, "conventionName": "온보딩가이드.pdf" }
  ]
```

---

### 9. Vercel 배포 시 환경변수 미반영

- **문제**
  - 로컬 `.env` 파일 수정 후 Vercel 재배포 시 환경변수 미반영
- **원인**
  - `.env`는 `.gitignore`에 등록되어 Git에 올라가지 않으므로 Vercel이 해당 값을 인식 불가
- **해결**
  - Vercel 대시보드 → Settings → Environment Variables에서 `VITE_API_BASE_URL` 직접 설정 후 재배포

<br />

## 개발 과정

* 요구사항 정의 -> 시스템 아키텍처 설계 -> 화면 디자인 -> UI구현 -> API연동 -> 배포
> **[프로토타입 디자인 link](https://www.figma.com/design/8CG24GgAmz8x5jYCjeCzEZ/ask-hub?node-id=0-1&t=dS8HS5JvzQI6eDhl-1)**
<br />
