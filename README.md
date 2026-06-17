# 🎓 숙명 SW 비교과 Hub

숙명여자대학교 SW 전공 학생들을 위한 비교과 활동 통합 큐레이션 서비스.  
교내·해외·산학협력 등 여러 사이트에 분산된 SW 관련 비교과 정보를 한 곳에 모아 탐색·관리할 수 있습니다.

> 2026년 1학기 웹시스템설계(001) 기말 프로젝트 — 2515930 김준영

---

## 📌 주요 기능

- **활동 목록**: WISE, 국제교류처, 현장실습지원센터에서 수집한 SW 비교과 활동을 카드 형태로 표시
- **다차원 필터·정렬**: 활동 사이트·세부 분야·신청 단위 다중 선택, 마감순/시작순/최신순 정렬
- **제목 검색**: 키워드로 활동 검색
- **마감 임박 자동 표시**: 신청 마감일 D-1 이하 활동에 자동 뱃지
- **북마크**: 관심 활동 별 표시 (localStorage 기반)
- **후기 CRUD**: 활동별 후기 작성·수정·삭제, 별점 평가
- **신청 현황 관리**: 신청완료 / 활동중 / 활동완료 상태 토글
- **마이페이지 통계**: 활동완료 분야 비율 차트(Pie), 월별 활동 히트맵
- **캘린더**: 날짜별 활동 표시 (시작일·종료일·신청 마감일)
- **활동 제보**: 누락된 활동 정보를 사용자가 직접 제보
- **회원가입·로그인**: localStorage 기반 데모 인증
- **반응형 UI**: 모바일·태블릿·데스크톱 모든 환경 대응

---

## 🛠 기술 스택

| 구분 | 기술 |
|---|---|
| 프론트엔드 | React 18, Vite, JavaScript (JSX) |
| 스타일 | Tailwind CSS v4 |
| 라우팅 | React Router v6 |
| 데이터 시각화 | Recharts |
| 캘린더 | react-calendar |
| CSV 파싱 | papaparse |
| 데이터 저장 | Google Sheets (외부 데이터) + localStorage (사용자 데이터) |
| 버전 관리 | Git, GitHub |
| 개발 도구 | VS Code, Node.js |
| AI 도구 | Claude (개발 보조, 디버깅, 코드 리뷰) |

---

## 🚀 실행 방법

### 사전 요구사항
- **Node.js** v18 이상
- **npm** (Node.js 설치 시 같이 설치됨)

### 1. 저장소 클론
```bash
git clone https://github.com/lucyjeremy/sookmyung-sw-hub.git
cd sookmyung-sw-hub
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173/` 접속.

### 4. 프로덕션 빌드 (선택)
```bash
npm run build
```

`dist/` 폴더에 정적 파일 생성됨.

---

## 📁 폴더 구조
sookmyung-sw-hub/

├── public/                 # 정적 파일

├── src/

│   ├── api/                # 외부 데이터 API

│   │   └── activities.js   # Google Sheets에서 활동 데이터 fetch

│   ├── components/         # 재사용 컴포넌트

│   │   ├── ActivityCard.jsx    # 활동 카드 (북마크/상태/후기 포함)

│   │   ├── FilterBar.jsx       # 다차원 필터·정렬 영역

│   │   ├── Navbar.jsx          # 상단 네비게이션

│   │   ├── ReviewForm.jsx      # 후기 작성·수정 폼

│   │   ├── ReviewItem.jsx      # 후기 표시 컴포넌트

│   │   ├── SearchBar.jsx       # 제목 검색창

│   │   └── SiteLinks.jsx       # 활동 사이트 바로가기

│   ├── pages/              # 라우트 페이지

│   │   ├── CalendarPage.jsx    # 캘린더 페이지

│   │   ├── LoginPage.jsx       # 로그인 페이지
│   │   ├── MyPage.jsx          # 마이페이지 (통계, 북마크, 후기)

│   │   ├── ReportPage.jsx      # 활동 제보 페이지

│   │   └── SignupPage.jsx      # 회원가입 페이지

│   ├── utils/              # 비즈니스 로직·유틸 함수

│   │   ├── application.js      # 신청 상태 관리

│   │   ├── auth.js             # 인증 (로그인/회원가입)

│   │   ├── bookmark.js         # 북마크 토글·조회

│   │   ├── date.js             # 날짜 계산 (D-day 등)

│   │   ├── filter.js           # 필터링·정렬 로직

│   │   ├── report.js           # 활동 제보 관리

│   │   └── review.js           # 후기 CRUD

│   ├── App.jsx             # 최상위 컴포넌트 + 라우팅

│   ├── config.js           # 외부 데이터 URL 등 설정

│   ├── index.css           # Tailwind 진입점 + 전역 스타일

│   └── main.jsx            # React 진입점

├── index.html              # HTML 진입점

├── package.json            # 의존성 목록

├── vite.config.js          # Vite 설정

└── README.md

---

## 🗃 데이터 구조

### Google Sheets (활동 데이터)

총 14컬럼, 자동 추출 11개 + 수동 분류 3개:

| 컬럼 | 의미 | 출처 |
|---|---|---|
| id | 활동 고유번호 | 자동 |
| title | 활동 제목 | 자동 |
| organization | 주관 기관 | 자동 |
| activity | 활동 종류 (특강/워크숍 등) | 자동 |
| capacity | 모집 정원 | 자동 |
| startDate, endDate | 활동 기간 | 자동 |
| applyStart, applyEnd | 신청 기간 | 자동 |
| image | 포스터 이미지 URL | 자동 |
| applyLink | 신청 페이지 URL | 자동 |
| source | 출처 (WISE/국제/현장실습) | 수동 |
| field | 세부 분야 (AI/보안 등) | 수동 |
| team | 개인/팀 | 수동 |

WISE 활동은 콘솔 기반 스크래핑 스크립트로 자동 추출, 그 외 사이트는 수동 입력.

### localStorage (사용자 데이터)

| 키 | 내용 |
|---|---|
| `bookmarked_activities` | 북마크한 활동 id 배열 |
| `activity_reviews` | 작성한 후기 객체 배열 |
| `application_status` | 활동별 신청 상태 객체 |
| `activity_reports` | 사용자가 제보한 활동 |
| `current_user`, `registered_users` | 인증 정보 (데모용) |

---

## 🎨 디자인 / UX

- **컴포넌트 기반 설계**: 모든 UI 부품을 작은 컴포넌트로 쪼개 재사용성 확보
- **상태 끌어올리기(state lifting)**: 필터 상태를 부모 컴포넌트에서 관리하여 여러 자식이 공유
- **useMemo 최적화**: 필터링·정렬 결과 캐싱으로 불필요한 재계산 방지
- **조건부 렌더링**: 로딩 / 에러 / 빈 상태 / 정상 상태별로 다른 UI
- **반응형 그리드**: Tailwind의 `sm:`, `lg:` 접두사로 화면 크기별 컬럼 수 자동 조정

---

## 📝 주의사항

- 로그인 기능은 **데모용**입니다. 비밀번호가 평문으로 localStorage에 저장되므로 실제 서비스 환경엔 사용 금지.
- 사용자 데이터(북마크, 후기, 신청 상태 등)는 브라우저 localStorage에 저장되므로 다른 기기/브라우저에선 공유되지 않습니다.
- 학교 사이트의 포스터 이미지가 외부 도메인에서 차단되는 경우, 카드에는 폴백 UI(책 아이콘 + 제목)가 표시됩니다.

---

## 🔗 링크

- **GitHub**: https://github.com/lucyjeremy/sookmyung-sw-hub
- **시연 영상**: (제출 시 추가)

---

## 👤 작성자

- **2515930 김준영**
- 숙명여자대학교 컴퓨터과학전공