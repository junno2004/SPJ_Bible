# 준노의 Bible

깔끔하고 현대적인 웹 기반 성경 애플리케이션입니다. Next.js와 Tailwind CSS로 제작되었습니다.

## 주요 기능

### 1. 성경 읽기
- 구약과 신약 66권 전체를 자유롭게 읽을 수 있습니다.
- 상단 고정 네비게이션을 통해 책과 장을 쉽고 빠르게 선택할 수 있습니다.
- 이전/다음 장 버튼으로 끊김 없이 이어서 읽을 수 있습니다.

### 2. 성경 검색
- 원하는 단어나 구절을 빠르게 검색할 수 있습니다.
- 검색 결과에서 검색어가 강조 표시됩니다.

### 3. 마음에 새긴 말씀 (형광펜)
- 말씀을 읽다가 마음에 드는 구절을 클릭하면 내 서재에 저장됩니다.
- 저장된 말씀은 언제든 다시 모아볼 수 있습니다.

### 4. 성경 1독 도전
- 90일, 6개월, 1년 단위로 성경 1독 계획을 세울 수 있습니다.
- 매일 읽어야 할 분량을 자동으로 계산하여 알려줍니다.
- 말씀을 읽고 '완료' 버튼을 누르면 진행률이 자동으로 기록됩니다.

## 기술 스택

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Deployment**: Cloudflare Pages (Static Export)
- **State Management**: React Hooks & LocalStorage

## 배포

이 프로젝트는 Cloudflare Pages를 통해 정적 웹사이트로 배포됩니다.

- **배포 URL**: [https://spj-bible.pages.dev](https://spj-bible.pages.dev)

`npm run build` 명령어를 통해 `out` 디렉토리에 정적 파일이 생성됩니다.
