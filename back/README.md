# DoGether Backend

Express.js 기반 백엔드 API 서버입니다.

## 🚀 설정 및 실행

### 1. 환경변수 설정

`back` 폴더에 `.env` 파일을 만들고 다음 내용을 추가하세요:

```env
# 서버 설정
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# 이메일 설정 (front/.env와 동일하게 설정)
EMAIL_PROVIDER=nodemailer
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# JWT 설정 (front/.env와 동일하게 설정)
JWT_SECRET=your-super-secret-jwt-key-here

# 기타 설정
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**⚠️ 중요:** front 폴더의 `.env` 파일에 있는 값들과 동일하게 설정해야 합니다!

### 2. 의존성 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 또는 프로덕션 실행
npm start
```

### 3. 서버 확인

브라우저에서 http://localhost:5000/health 에 접속하여 서버가 정상 작동하는지 확인하세요.

## 📁 프로젝트 구조

```
back/
├── src/
│   ├── routes/          # API 라우트
│   │   └── auth.js      # 인증 관련 라우트
│   ├── services/        # 비즈니스 로직
│   │   ├── emailService.js   # 이메일 발송 서비스
│   │   └── authService.js    # JWT 인증 서비스
│   ├── middleware/      # 미들웨어
│   ├── utils/          # 유틸리티 함수
│   └── index.js        # 메인 서버 파일
├── package.json
└── README.md
```

## 🔗 API 엔드포인트

### 인증 관련
- `POST /api/auth/send-verification` - 이메일 인증 발송
- `POST /api/auth/verify-email` - 이메일 인증 확인
- `POST /api/auth/signup` - 회원가입 (추후 확장)
- `POST /api/auth/login` - 로그인 (추후 확장)

### 기타
- `GET /health` - 서버 상태 확인

## 🛠️ 주요 기능

### 이메일 서비스
- Nodemailer를 사용한 Gmail SMTP
- HTML 템플릿 이메일
- 향후 SendGrid 등 다른 서비스로 확장 가능

### JWT 인증
- 24시간 유효한 이메일 인증 토큰
- 보안 목적별 토큰 분리 (access, refresh, verification)
- bcrypt를 사용한 비밀번호 해싱

### 보안
- Helmet.js로 보안 헤더 설정
- CORS 설정으로 프론트엔드만 접근 허용
- 입력값 검증 및 에러 핸들링

## 🔄 프론트엔드와 연동

프론트엔드에서 백엔드 API를 호출하도록 수정됨:
- `front/src/pages/signup.tsx` - 회원가입 시 백엔드 API 호출
- `front/src/pages/verify-email.tsx` - 이메일 인증 시 백엔드 API 호출

## 📝 다음 단계

1. 데이터베이스 연동 (MongoDB, PostgreSQL 등)
2. 사용자 관리 시스템 완성
3. 로그인/로그아웃 기능
4. 소셜 로그인 (Google, Kakao, Naver)
5. API 문서 작성 (Swagger) 