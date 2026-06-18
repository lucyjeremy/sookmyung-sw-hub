# 숙명 SW 비교과 Hub

숙명여자대학교 SW 전공 학생을 위한 비교과 활동 통합 큐레이션 서비스.  
교내·해외·산학협력 등 여러 사이트에 분산된 SW 관련 비교과 정보를 한 곳에 모아 탐색·관리·기록할 수 있습니다.

---

## 주요 기능

### 활동 탐색
- 활동 목록: WISE, 국제교류처, 현장실습지원센터에서 수집한 SW 비교과 활동을 카드 형태로 표시
- 다차원 필터·정렬: 활동 사이트·세부 분야(데이터 기반 동적)·신청 단위·학년·시기 다중 선택, 마감순/시작순/최신순 정렬
- 제목 검색: 키워드로 활동 검색
- 마감 임박 자동 표시: 신청 마감일 D-1 이하 활동에 자동 뱃지
- 캘린더 뷰: 날짜별 활동 표시. 활동 목록 페이지의 필터/검색이 그대로 적용됨

### 사용자 기능 (로그인 필요)
- 회원가입·로그인·정보 수정·탈퇴: localStorage 기반 데모 인증
- 북마크: 관심 활동 별 표시
- 신청 현황 관리: 신청완료 / 활동중 / 활동완료 상태 토글
- 후기 CRUD: 활동완료 상태에 한해 후기 작성/수정/삭제, 별점 평가
- 활동 제보: 누락된 활동 정보를 사용자가 직접 제보
- 회원 간 채팅: 1:1 채팅방 개설 및 메시지 송수신

### 마이페이지 (로그인 필요)
- 요약 카드: 북마크/신청완료/활동중/활동완료/후기 수
- 분야 비율 차트: 활동완료한 활동의 분야 분포 (파이 차트)
- 활동 히트맵: 월별 활동 분포
- 신청 현황: 상태별 활동 카드 분류
- 북마크 목록 / 후기 목록
- 활동 제보 결과 확인: 관리자 코멘트 표시

### 관리자 기능
- 활동 제보 검토: 사용자의 제보를 승인/반려, 코멘트 작성
- 제보 통계: 대기/승인/반려 건수

---

## 기술 스택

프론트엔드: React 18, Vite, JavaScript (JSX)
스타일: Tailwind CSS v4
라우팅: React Router v6
데이터 시각화: Recharts
캘린더: react-calendar
CSV 파싱: papaparse
데이터 저장: Google Sheets (외부 데이터) + localStorage (사용자 데이터)
버전 관리: Git, GitHub
개발 도구: VS Code, Node.js
AI 도구: Claude (개발 보조, 디버깅, 코드 리뷰)

---

## 실행 방법

### 사전 요구사항
- Node.js v18 이상
- npm

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

## 폴더 구조
sookmyung-sw-hub/

├── public/                 # 정적 파일

├── src/

│   ├── api/

│   │   └── activities.js   # Google Sheets에서 활동 데이터 fetch (papaparse)

│   ├── components/

│   │   ├── ActivityCard.jsx    # 활동 카드 (북마크/상태/후기 통합)

│   │   ├── FilterBar.jsx       # 다차원 필터·정렬 (field 옵션은 데이터 기반 동적)

│   │   ├── Navbar.jsx          # 상단 네비게이션 (관리자 메뉴 조건부 표시)

│   │   ├── ProfileEditor.jsx   # 회원정보 수정·탈퇴 폼

│   │   ├── ReviewForm.jsx      # 후기 작성·수정 폼

│   │   ├── ReviewItem.jsx      # 후기 표시

│   │   ├── SearchBar.jsx       # 제목 검색창

│   │   └── SiteLinks.jsx       # 외부 학교 사이트 바로가기

│   ├── pages/

│   │   ├── AdminPage.jsx       # 관리자 페이지 (제보 검토)

│   │   ├── CalendarPage.jsx    # 캘린더 (필터 메인과 공유)

│   │   ├── ChatPage.jsx        # 1:1 채팅

│   │   ├── LoginPage.jsx

│   │   ├── MyPage.jsx          # 마이페이지 (통계, 북마크, 후기, 제보 결과)

│   │   ├── ReportPage.jsx      # 활동 제보

│   │   └── SignupPage.jsx

│   ├── utils/                  # 비즈니스 로직

│   │   ├── application.js      # 신청 상태 관리

│   │   ├── auth.js             # 인증 + 관리자 권한

│   │   ├── bookmark.js         # 북마크 토글·조회

│   │   ├── chat.js             # 채팅방·메시지

│   │   ├── date.js             # 날짜 계산 (D-day 등)

│   │   ├── filter.js           # 필터링·정렬·검색 로직

│   │   ├── report.js           # 활동 제보 CRUD + 관리자 처리

│   │   └── review.js           # 후기 CRUD

│   ├── App.jsx                 # 최상위 + 라우팅 + 필터 상태 공유

│   ├── config.js               # 외부 데이터 URL

│   ├── index.css               # Tailwind + 전역 스타일

│   └── main.jsx

├── index.html

├── package.json

├── vite.config.js

└── README.md

---

## 데이터 구조

### Google Sheets (활동 데이터, 15컬럼)

자동 추출 12개 + 수동 분류 3개:

| 컬럼 | 의미 | 출처 |
|---|---|---|
| id | 활동 고유번호 (WISE: 글번호, 외부: prefix) | 자동 |
| title | 활동 제목 | 자동 |
| organization | 주관 기관 | 자동 |
| activity | 활동 종류 (특강/워크숍 등) | 자동 |
| grade | 모집 학년 | 자동 |
| capacity | 모집 정원 | 자동 |
| startDate, endDate | 활동 기간 | 자동 |
| applyStart, applyEnd | 신청 기간 | 자동 |
| image | 포스터 이미지 URL | 자동 |
| applyLink | 신청 페이지 URL | 자동 |
| source | 출처 (WISE/국제/현장실습) | 수동 |
| field | 세부 분야 (AI/보안 등) | 수동 |
| team | 개인/팀 | 수동 |

WISE 활동은 콘솔 기반 스크래핑 스크립트로 자동 추출, 그 외 사이트는 수동 입력.

### localStorage (사용자별 데이터)

`current_user`, `registered_users`: 인증 정보
`bookmarked_activities`: 북마크 활동 id 배열
`application_status`: 활동별 신청 상태
`activity_reviews`: 후기 객체 배열
`activity_reports`: 사용자 제보 (작성자/상태/코멘트 포함)
`chat_rooms`, `chat_messages`: 채팅방·메시지

---

## 설계 특징

### 컴포넌트·유틸 분리
모든 UI는 작은 컴포넌트로 쪼개 재사용성을 확보. 비즈니스 로직은 `utils/`로 분리하여 컴포넌트는 순수 표현 책임만 가짐.

### 상태 끌어올리기 (State Lifting)
필터·검색 상태를 `App.jsx`에서 관리. `HomePage`와 `CalendarPage`가 같은 상태를 공유하여 페이지 간 필터 유지.

### 데이터 기반 동적 필터
세부 분야(field) 옵션을 시트 데이터에서 실시간 추출. 새 분야가 추가되면 필터 옵션도 자동 갱신.

### 권한별 UI 분기
- 비로그인: 마이페이지·채팅·신청 상태·후기 작성 차단
- 일반 사용자: 자기 데이터만 조회
- 관리자: 모든 제보 검토 권한, 네비에 "관리자" 메뉴 노출

### useMemo 최적화
필터링·정렬 결과를 캐싱하여 불필요한 재계산 방지.

### 조건부 렌더링
로딩 / 에러 / 빈 상태 / 정상 상태마다 다른 UI 제공.

---

## 📝 주의사항

- 데모용 인증: 비밀번호가 평문으로 localStorage에 저장되므로 실제 서비스 환경엔 사용 금지.
- 사용자 데이터는 브라우저 단위: 같은 브라우저에서만 데이터 공유. 다른 기기/브라우저에선 별도 저장.
- 포스터 이미지: 학교 사이트에서 외부 접근 차단되는 경우 카드에 폴백 UI(책 아이콘 + 제목) 표시.

---

## AI 활용

본 프로젝트는 Claude(Anthropic)를 페어 프로그래밍 파트너로 활용했습니다:

- 환경 세팅 단계별 가이드
- 컴포넌트 설계 및 React 패턴 학습
- WISE HTML 구조 분석 및 셀렉터 진단 코드 작성
- 디버깅 (Vite 빌드 에러, 타입 에러, 변수 중복 선언 등)
- Tailwind CSS 클래스 추천
- 코드 리뷰 및 리팩토링

---

## 링크

- GitHub: https://github.com/lucyjeremy/sookmyung-sw-hub
- 시연 영상: (제출 시 추가)

---

## 작성자

숙명여대 컴퓨터과학전공 2515930 김준영