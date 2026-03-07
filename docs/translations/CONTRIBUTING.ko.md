<div align="center">

# 🎵 ScrollSoul Music Sync에 기여하기

### 환영합니다, Star Seed 창조자! 🌟

[![Contributors](https://img.shields.io/github/contributors/chaishillomnitech1/scrollsoul-music-sync?style=for-the-badge&color=brightgreen)](https://github.com/chaishillomnitech1/scrollsoul-music-sync/graphs/contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-환영합니다-brightgreen.svg?style=for-the-badge)](https://makeapullrequest.com)
[![Discussions](https://img.shields.io/github/discussions/chaishillomnitech1/scrollsoul-music-sync?style=for-the-badge&color=purple)](https://github.com/chaishillomnitech1/scrollsoul-music-sync/discussions)

**[🇺🇸 English](../../CONTRIBUTING.md)** • **[🇪🇸 Español](CONTRIBUTING.es.md)** • **[🇫🇷 Français](CONTRIBUTING.fr.md)** • **[🇩🇪 Deutsch](CONTRIBUTING.de.md)** • **[🇯🇵 日本語](CONTRIBUTING.ja.md)** • **🇰🇷 한국어** • **[🇨🇳 中文](CONTRIBUTING.zh.md)** • **[🇧🇷 Português](CONTRIBUTING.pt.md)**

</div>

---

## 🚀 빠른 시작

### 필수 조건

- **Node.js** `>= 14.x`
- **npm** `>= 7.x`
- **Git** (최신 버전)

### 로컬 설정

```bash
# 1. 리포지토리 포크

# 2. 포크 클론
git clone https://github.com/사용자명/scrollsoul-music-sync.git
cd scrollsoul-music-sync

# 3. 업스트림 리모트 추가
git remote add upstream https://github.com/chaishillomnitech1/scrollsoul-music-sync.git

# 4. 의존성 설치
npm install

# 5. 환경 템플릿 복사
cp .env.example .env

# 6. 개발 모드로 시작
npm run dev

# 7. 모든 것이 작동하는지 확인
npm test
```

---

## 🎯 기여 방법

### 1. 브랜치 생성

```bash
git checkout main
git pull upstream main
git checkout -b feature/기능-이름
```

### 2. 변경 사항 만들기

- 변경 사항을 **집중적으로** — PR당 하나의 기능 또는 수정
- 기존 코드 패턴 따르기
- 모든 변경 사항에 대한 **테스트** 추가 또는 업데이트

### 3. 변경 사항 확인

```bash
npm test       # 모든 테스트 실행
npm run lint   # 코드 스타일 확인
npm run build  # 프로젝트 빌드
```

### 4. Pull Request 제출

1. 브랜치 푸시: `git push origin feature/기능-이름`
2. `main` 브랜치에 대한 PR 열기
3. PR 템플릿 완전히 작성
4. 리뷰 요청

---

## 📝 커밋 메시지 표준

**Conventional Commits**를 따릅니다:

```
feat(라이선스): 지역 기반 로열티 계산 추가
fix(api): ISRC 유효성 검사 정규식 패턴 수정
docs(readme): 다국어 기여 가이드 업데이트
```

---

<div align="center">

## 💜 감사합니다!

당신은 이 주권 생태계의 중요한 일부입니다. 🌌

</div>
