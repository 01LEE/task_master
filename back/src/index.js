const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const { testConnection } = require('./lib/db');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(helmet()); // 보안 헤더
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
})); // CORS 설정
app.use(morgan('combined')); // 로깅
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩

// 라우트
app.use('/api/auth', authRoutes);

// 헬스체크
app.get('/health', async (req, res) => {
  try {
    // 데이터베이스 연결 상태 확인
    const dbConnected = await testConnection();
    
    res.json({ 
      status: 'OK', 
      message: 'DoGether Backend is running!',
      database: dbConnected ? 'Connected' : 'Disconnected',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Health check failed',
      database: 'Error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 404 에러 핸들링
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// 전역 에러 핸들링
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 서버 시작 함수
async function startServer() {
  try {
    // PostgreSQL 연결 테스트
    console.log('🔄 PostgreSQL 데이터베이스 연결 확인 중...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ PostgreSQL 연결 실패. 서버를 시작할 수 없습니다.');
      console.error('💡 .env 파일의 데이터베이스 설정을 확인해주세요.');
      process.exit(1);
    }

    // 서버 시작
    app.listen(PORT, () => {
      console.log('='.repeat(60));
      console.log(`🚀 DoGether Backend Server Started!`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log(`🗄️  Database: PostgreSQL (Connected)`);
      console.log(`📧 Email Service: ${process.env.EMAIL_PROVIDER || 'not configured'}`);
      console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('='.repeat(60));
      console.log('');
      console.log('📋 Available Endpoints:');
      console.log('  POST /api/auth/signup - 회원가입');
      console.log('  POST /api/auth/login - 로그인');
      console.log('  POST /api/auth/verify-email - 이메일 인증');
      console.log('  POST /api/auth/send-verification - 인증 이메일 발송');
      console.log('  GET  /health - 헬스체크');
      console.log('='.repeat(60));
    });

  } catch (error) {
    console.error('❌ 서버 시작 중 오류 발생:', error);
    process.exit(1);
  }
}

// 서버 시작
startServer(); 