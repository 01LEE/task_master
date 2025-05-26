const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthService {
  // JWT 토큰 생성
  generateToken(payload, expiresIn = '24h') {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  }

  // JWT 토큰 검증
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // 이메일 인증 토큰 생성
  generateEmailVerificationToken(email) {
    return this.generateToken(
      { 
        email, 
        purpose: 'email_verification',
        timestamp: new Date().toISOString()
      },
      '24h'
    );
  }

  // 이메일 인증 토큰 검증
  verifyEmailVerificationToken(token) {
    try {
      const decoded = this.verifyToken(token);
      
      if (decoded.purpose !== 'email_verification') {
        throw new Error('Invalid token purpose');
      }
      
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired verification token');
    }
  }

  // 비밀번호 해싱
  async hashPassword(password) {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // 비밀번호 검증
  async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  // 액세스 토큰 생성 (로그인용)
  generateAccessToken(userId, email) {
    return this.generateToken(
      { 
        userId, 
        email, 
        purpose: 'access_token' 
      },
      '7d'
    );
  }

  // 리프레시 토큰 생성
  generateRefreshToken(userId) {
    return this.generateToken(
      { 
        userId, 
        purpose: 'refresh_token' 
      },
      '30d'
    );
  }
}

module.exports = new AuthService(); 