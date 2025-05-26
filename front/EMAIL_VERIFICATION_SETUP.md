# 📧 이메일 인증 시스템 설정 가이드

DoGether 프로젝트에 구현된 이메일 인증 시스템 설정 및 사용 방법을 안내합니다.

## 🏗️ 시스템 구조

### 1. API 엔드포인트
- `/api/auth/send-verification` - 인증 이메일 발송
- `/api/auth/verify-email` - 이메일 인증 토큰 검증

### 2. 페이지
- `/signup` - 회원가입 (이메일 인증 포함)
- `/verify-email` - 이메일 인증 결과 페이지

### 3. 라이브러리
- `src/lib/auth.ts` - JWT 토큰 생성/검증
- `src/lib/email.ts` - 이메일 서비스 (Nodemailer/SendGrid)

## ⚙️ 설정 방법

### 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

\`\`\`env
# 이메일 서비스 설정
EMAIL_PROVIDER=nodemailer
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password

# JWT 설정
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Next.js 설정
NEXT_PUBLIC_BASE_URL=http://localhost:3000
\`\`\`

### 2. Gmail 앱 비밀번호 생성

1. Google 계정에서 **2단계 인증**을 활성화
2. Google 계정 보안 설정 → **앱 비밀번호** 생성
3. "기타(사용자 지정 이름)" 선택 후 "DoGether" 입력
4. 생성된 16자리 비밀번호를 `EMAIL_PASSWORD`에 설정

### 3. JWT Secret 생성

강력한 랜덤 문자열을 생성하여 `JWT_SECRET`에 설정:

\`\`\`bash
# Node.js에서 생성
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 또는 온라인 도구 사용
# https://generate-secret.vercel.app/64
\`\`\`

## 🚀 사용 방법

### 1. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

### 2. 회원가입 테스트

1. `http://localhost:3000/signup` 접속
2. 이메일과 비밀번호 입력
3. "회원가입" 버튼 클릭
4. 이메일함에서 인증 이메일 확인
5. "이메일 인증하기" 버튼 클릭
6. 인증 완료 후 홈페이지로 자동 이동

## 🔄 SendGrid로 교체하기

나중에 프로덕션에서 SendGrid를 사용하려면:

### 1. SendGrid 패키지 설치

\`\`\`bash
npm install @sendgrid/mail
\`\`\`

### 2. 환경 변수 변경

\`\`\`env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
\`\`\`

### 3. SendGrid 서비스 구현

`src/lib/email.ts`의 `SendGridService` 클래스를 완성하면 자동으로 교체됩니다.

## 🛠️ 기능 특징

### 1. 추상화 설계
- `EmailService` 인터페이스로 이메일 제공업체 쉽게 교체 가능
- Nodemailer → SendGrid 전환 시 코드 변경 최소화

### 2. 보안
- JWT 토큰으로 안전한 이메일 인증
- 24시간 토큰 만료 시간
- 토큰 목적 검증 ('email_verification')

### 3. 사용자 경험
- 반응형 인증 페이지
- 로딩/성공/실패/만료 상태별 UI
- 자동 리다이렉트 및 재발송 기능
- 다국어 지원 (한/영/일)

### 4. 이메일 템플릿
- HTML 이메일 템플릿
- DoGether 브랜딩
- 모바일 친화적 디자인
- 대체 링크 제공

## 🔍 디버깅

### 이메일이 발송되지 않는 경우

1. **환경 변수 확인**
   \`\`\`bash
   echo $EMAIL_USER
   echo $EMAIL_PASSWORD
   \`\`\`

2. **Gmail 설정 확인**
   - 2단계 인증 활성화 여부
   - 앱 비밀번호 정확성
   - "보안 수준이 낮은 앱" 설정 (필요시)

3. **콘솔 로그 확인**
   - 브라우저 개발자 도구
   - 서버 콘솔 출력

### JWT 토큰 오류

1. **Secret 키 확인**
   - `.env` 파일의 `JWT_SECRET` 존재 여부
   - 특수문자나 공백 포함 여부

2. **토큰 만료 확인**
   - 24시간 이내 토큰인지 확인
   - 재발송 기능 이용

## 📱 프로덕션 배포

### 1. 환경 변수 설정
- `NEXT_PUBLIC_BASE_URL`을 실제 도메인으로 변경
- 강력한 `JWT_SECRET` 사용
- SendGrid API 키 설정 (권장)

### 2. 이메일 도메인 인증
- SendGrid에서 도메인 인증 설정
- SPF, DKIM 레코드 추가

### 3. 모니터링
- 이메일 발송 성공률 추적
- 에러 로그 모니터링
- 사용자 인증 완료율 분석

## 🤝 기여하기

이메일 인증 시스템 개선 제안이나 버그 발견 시:

1. 이슈 생성
2. 개선사항 제안
3. 풀 리퀘스트 생성

## 📚 추가 자료

- [Nodemailer 공식 문서](https://nodemailer.com/)
- [SendGrid Node.js 가이드](https://docs.sendgrid.com/for-developers/sending-email/v3-nodejs-code-example)
- [JWT 공식 사이트](https://jwt.io/)
- [Gmail 앱 비밀번호 생성 가이드](https://support.google.com/accounts/answer/185833) 