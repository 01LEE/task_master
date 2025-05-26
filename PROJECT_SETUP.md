# DoGether 프로젝트 설정 가이드

## 📋 프로젝트 구조
```
DoGether/
├── back/                    # 백엔드 (Express.js + PostgreSQL)
│   ├── src/
│   │   ├── index.js        # 서버 진입점
│   │   ├── lib/db.js       # 데이터베이스 연결 및 쿼리
│   │   ├── routes/auth.js  # 인증 관련 API
│   │   └── services/       # 이메일 등 서비스
│   ├── package.json
│   └── requirements.txt    # 백엔드 의존성 목록
├── front/                  # 프론트엔드 (Next.js + React)
│   ├── src/
│   │   ├── pages/         # Next.js 페이지
│   │   └── components/    # React 컴포넌트
│   ├── package.json
│   └── requirements.txt   # 프론트엔드 의존성 목록
└── PROJECT_SETUP.md       # 이 파일
```

## 🚀 빠른 시작

### 1. 사전 요구사항
- Node.js 18+ 설치
- PostgreSQL 설치 및 실행
- Git 설치

### 2. 프로젝트 클론 및 설정
```bash
git clone <repository-url>
cd DoGether
```

### 3. 백엔드 설정
```bash
cd back

# 의존성 설치
npm install

# 환경변수 설정 (.env 파일 생성)
echo "DATABASE_URL=postgresql://postgres:your_password@localhost:5432/taskDB" > .env
echo "JWT_SECRET=your_super_secret_jwt_key_here" >> .env
echo "EMAIL_USER=your_email@gmail.com" >> .env
echo "EMAIL_PASS=your_gmail_app_password" >> .env
echo "DISABLE_EMAIL=true" >> .env

# 서버 시작
npm start
```

### 4. 프론트엔드 설정
```bash
cd ../front

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

## 🗄️ 데이터베이스 설정

### PostgreSQL 설치 및 설정
1. PostgreSQL 설치 (Windows: pgAdmin4 포함)
2. 데이터베이스 생성:
```sql
CREATE DATABASE taskDB;
```

3. 사용자 테이블 생성:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token TEXT,
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    provider VARCHAR(50) DEFAULT 'local',
    provider_id VARCHAR(255),
    locale VARCHAR(10) DEFAULT 'ko',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 환경변수 설정

### 백엔드 (.env)
```env
# 데이터베이스
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/taskDB

# JWT 보안
JWT_SECRET=your_super_secret_jwt_key_here

# 이메일 서비스 (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# 개발 환경 설정
DISABLE_EMAIL=true
NODE_ENV=development
```

### Gmail 앱 비밀번호 설정
1. Google 계정 → 보안 → 2단계 인증 활성화
2. 앱 비밀번호 생성
3. 생성된 16자리 비밀번호를 EMAIL_PASS에 설정

## 📦 의존성 관리

### 백엔드 주요 패키지
- **express**: 웹 프레임워크
- **pg**: PostgreSQL 클라이언트
- **bcryptjs**: 비밀번호 해싱
- **jsonwebtoken**: JWT 토큰 관리
- **nodemailer**: 이메일 발송
- **cors, helmet, morgan**: 보안 및 로깅

### 프론트엔드 주요 패키지
- **next**: Next.js 프레임워크
- **react**: React 라이브러리
- **styled-components**: CSS-in-JS
- **next-i18next**: 국제화
- **typescript**: 타입스크립트

## 🔄 개발 워크플로우

### 백엔드 개발
```bash
cd back
npm run dev    # nodemon으로 자동 재시작
```

### 프론트엔드 개발
```bash
cd front
npm run dev    # Next.js 개발 서버
```

### API 테스트
- 백엔드: http://localhost:5000
- 프론트엔드: http://localhost:3000
- 헬스체크: http://localhost:5000/health

## 🧪 주요 API 엔드포인트

### 인증 API
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/verify-email` - 이메일 인증
- `POST /api/auth/login` - 로그인
- `GET /health` - 서버 상태 확인

## 🚨 문제 해결

### 일반적인 문제들
1. **데이터베이스 연결 실패**
   - PostgreSQL 서비스 실행 확인
   - DATABASE_URL 환경변수 확인

2. **이메일 발송 실패**
   - DISABLE_EMAIL=true로 설정 (개발 환경)
   - Gmail 앱 비밀번호 확인

3. **포트 충돌**
   - 백엔드: 5000번 포트
   - 프론트엔드: 3000번 포트

## 📝 추가 정보

### 완료된 기능
- ✅ PostgreSQL 데이터베이스 연동
- ✅ 사용자 회원가입/로그인
- ✅ 이메일 인증 시스템
- ✅ JWT 토큰 기반 인증
- ✅ 비밀번호 해싱 (bcrypt)
- ✅ CORS 및 보안 설정

### 다음 단계
- 소셜 로그인 (Google, Kakao, Naver)
- 비밀번호 재설정
- 사용자 프로필 관리
- 반려동물 정보 관리

---
**마지막 업데이트**: 2025-01-26
**개발 환경**: Node.js 18+, PostgreSQL 16+, Next.js 15+ 