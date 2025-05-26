const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL 연결 풀 생성
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: parseInt(process.env.DB_MAX_CONNECTIONS || '20'), // 최대 연결 수
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'), // 유휴 연결 타임아웃
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'), // 연결 타임아웃
});

// 연결 테스트 함수
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ PostgreSQL 데이터베이스 연결 성공:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL 데이터베이스 연결 실패:', error.message);
    return false;
  }
};

// 쿼리 실행 헬퍼 함수
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('🔍 쿼리 실행:', { text, duration: `${duration}ms`, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('❌ 쿼리 실행 오류:', { text, error: error.message });
    throw error;
  }
};

// 트랜잭션 헬퍼 함수
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// 사용자 관련 쿼리 함수들
const userQueries = {
  // 사용자 생성
  createUser: async (userData) => {
    const { email, password_hash, name, locale = 'ko' } = userData;
    const text = `
      INSERT INTO users (email, password_hash, name, locale, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, email, name, locale, created_at
    `;
    return await query(text, [email, password_hash, name, locale]);
  },

  // 이메일로 사용자 찾기
  findByEmail: async (email) => {
    const text = 'SELECT * FROM users WHERE email = $1';
    return await query(text, [email]);
  },

  // ID로 사용자 찾기
  findById: async (id) => {
    const text = 'SELECT * FROM users WHERE id = $1';
    return await query(text, [id]);
  },

  // 이메일 인증 토큰 업데이트
  updateVerificationToken: async (userId, token, expires) => {
    const text = `
      UPDATE users 
      SET email_verification_token = $1, email_verification_expires = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING id
    `;
    return await query(text, [token, expires, userId]);
  },

  // 이메일 인증 완료
  verifyEmail: async (token) => {
    const text = `
      UPDATE users 
      SET email_verified = true, email_verification_token = NULL, email_verification_expires = NULL, updated_at = NOW()
      WHERE email_verification_token = $1 AND email_verification_expires > NOW()
      RETURNING id, email, name
    `;
    return await query(text, [token]);
  },

  // 인증 토큰으로 사용자 찾기
  findByVerificationToken: async (token) => {
    const text = `
      SELECT * FROM users 
      WHERE email_verification_token = $1 AND email_verification_expires > NOW()
    `;
    return await query(text, [token]);
  }
};

// 애플리케이션 종료 시 연결 풀 정리
process.on('SIGINT', () => {
  console.log('🔄 PostgreSQL 연결 풀을 정리하는 중...');
  pool.end(() => {
    console.log('✅ PostgreSQL 연결 풀이 정리되었습니다.');
    process.exit(0);
  });
});

module.exports = {
  pool,
  query,
  transaction,
  testConnection,
  userQueries
}; 