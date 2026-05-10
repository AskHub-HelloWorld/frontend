export const mockUser = {
  id: 1,
  name: "백가람",
  email: "garam@company.com",
  department: "프론트엔드",
  company: "database Labs",
  joinedAt: "2026-03-15",
  points: 1250,
  avatar: null, // Will use initials if null
};

export const mockChatRooms = [
  { id: "1", title: "ask hub 프로젝트", createdAt: "2026-05-01", lastMessage: "안녕하세요, ask hub의 프로젝트 마감일은..." },
  { id: "2", title: "신입 온보딩 2026-1", createdAt: "2026-05-02", lastMessage: "남은 연차는 사내 시스템의..." },
  { id: "3", title: "사내 포털 재보수", createdAt: "2026-05-03", lastMessage: "" },
];

export const mockMessages = {
  "1": [
    { id: 1, role: "user", content: "프로젝트 마감일이 언제인가요?", time: "10:30" },
    { id: 2, role: "ai", content: "안녕하세요, ask hub의 프로젝트 마감일은 5월 25일 11:29까지입니다. 제출물은 발표자료 및 시연가능한 코드입니다.", source: "데이터베이스_2026.pdf", time: "10:31" },
  ],
  "2": [
    { id: 1, role: "user", content: "올해 남은 연차 확인은 어디서 하나요?", time: "14:20" },
    { id: 2, role: "ai", content: "남은 연차는 사내 시스템의 '인사 및 근태' 메뉴에서 확인하실 수 있습니다.", source: "근태관리규정.pdf", time: "14:21" },
  ]
};

export const mockPosts = [
  { 
    id: 1, 
    title: "React 코드 컨벤션 어떻게 정하셨나요?", 
    author: "익명", 
    department: "프론트엔드", 
    isAnonymous: true, 
    content: "팀이 늘어나는데 컨벤션이 제각각이라 고민입니다. 다들 어떤 가이드를 따르시나요?", 
    comments: 12, 
    createdAt: "2025-05-01T10:00:00", 
    isResolved: true,
    isMy: true
  },
  { 
    id: 2, 
    title: "사내 헬스장 이용 시간 문의", 
    author: "박상준", 
    department: "인사/총무", 
    isAnonymous: false, 
    content: "7층 헬스장 점심 시간에도 운영하나요?", 
    comments: 3, 
    createdAt: "2025-05-02T09:15:00", 
    isResolved: false,
    isMy: false
  },
  { 
    id: 3, 
    title: "Vite 빌드 속도가 너무 느립니다..", 
    author: "최원석", 
    department: "백엔드", 
    isAnonymous: false, 
    content: "캐시를 지워도 속도가 안 나오는데 팁이 있을까요?", 
    comments: 8, 
    createdAt: "2025-05-03T11:45:00", 
    isResolved: false,
    isMy: false
  }
];

export const mockComments = {
  1: [
    { id: 101, author: "이민우", department: "프론트엔드", content: "저희는 기본적으로 Airbnb 스타일 가이드를 따르고, 훅 사용 규칙만 자체적으로 추가했습니다.", createdAt: "2025-05-01T11:00:00", isAdopted: true, isMy: false },
    { id: 102, author: "정예지", department: "DevOps", content: "Prettier랑 ESLint 설정을 아예 라이브러리화해서 배포해 사용하고 있어요.", createdAt: "2025-05-01T11:20:00", isAdopted: false, isMy: false }
  ],
  2: [
    { id: 201, author: "백가람", department: "프론트엔드", content: "네, 점심시간(12:00~13:00)에도 운영하며, 샤워실도 이용 가능합니다.", createdAt: "2025-05-02T10:00:00", isAdopted: false, isMy: true }
  ]
};

export const mockProducts = [
  { id: 1, name: "신세계 상품권 1만원권", price: 2000, image: "/mock/giftcard.png", category: "상품권" },
  { id: 2, name: "구글 gift card 1만원권", price: 1000, image: "/mock/googlefitcard.png", category: "상품권" },
  { id: 3, name: "사내 카페 이용권 (5,000원)", price: 5000, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400", category: "복지" },
  { id: 4, name: "사내 헬스장 1개월 이용권", price: 5000, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400", category: "복지" },
  { id: 5, name: "티빙 1개월 구독권", price: 3500, image: "/mock/tving_membership.jpg", category: "구독권" },
  { id: 6, name: "밀리의 서재 12개월 구독권", price: 80000, image: "/mock/milly_membership.jpg", category: "구독권" },
];

export const mockAllUsers = [
  { id: 1, name: "백가람", dept: "프론트엔드", role: "사원" },
  { id: 2, name: "박상준", dept: "인사/총무", role: "과장" },
  { id: 3, name: "최원석", dept: "백엔드", role: "대리" },
  { id: 4, name: "이수호", dept: "디자인", role: "팀장" },
  { id: 5, name: "정예지", dept: "DevOps", role: "대리" },
  { id: 6, name: "김민수", dept: "마케팅", role: "과장" },
  { id: 7, name: "박지연", dept: "IT개발", role: "대리" },
  { id: 8, name: "최현우", dept: "영업", role: "사원" },
  { id: 9, name: "윤서아", dept: "기획", role: "팀장" },
  { id: 10, name: "한민우", dept: "프론트엔드", role: "대리" },
  { id: 11, name: "서유진", dept: "백엔드", role: "사원" },
  { id: 12, name: "강동원", dept: "QA", role: "과장" },
];