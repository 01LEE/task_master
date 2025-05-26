const express = require('express');
const router = express.Router();

const emailService = require('../services/emailService');
const authService = require('../services/authService');
const { userQueries } = require('../lib/db');

// 이메일 인증 발송
router.post('/send-verification', async (req, res) => {
  try {
    const { email } = req.body;

    // 이메일 유효성 검사
    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        error: 'Valid email is required' 
      });
    }

    // 토큰 생성
    const token = authService.generateEmailVerificationToken(email);

    // 이메일 발송
    await emailService.sendVerificationEmail(email, token);

    // 성공 로그
    console.log(`🎉 이메일 인증 발송 성공! 📧 ${email} → 인증 이메일이 발송되었습니다.`);

    res.json({ 
      success: true, 
      message: 'Verification email sent successfully' 
    });

  } catch (error) {
    console.error('Send verification error:', error);
    res.status(500).json({ 
      error: 'Failed to send verification email' 
    });
  }
});

// 이메일 인증 확인
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        error: 'Token is required' 
      });
    }

    // 토큰 검증 (JWT 유효성 확인)
    const decoded = authService.verifyEmailVerificationToken(token);

    // 데이터베이스에서 토큰으로 사용자 찾기 및 인증 처리
    const result = await userQueries.verifyEmail(token);

    if (result.rows.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid or expired token' 
      });
    }

    const verifiedUser = result.rows[0];
    const verifiedAt = new Date().toLocaleString('ko-KR');
    console.log(`✅ 이메일 인증 완료! 🎊 ${verifiedUser.email} (ID: ${verifiedUser.id}) → ${verifiedAt}에 성공적으로 인증되었습니다.`);

    res.json({ 
      success: true, 
      message: 'Email verified successfully',
      user: {
        id: verifiedUser.id,
        email: verifiedUser.email,
        name: verifiedUser.name
      }
    });

  } catch (error) {
    console.error('Verify email error:', error);
    
    if (error.message.includes('expired') || error.message.includes('Invalid')) {
      return res.status(400).json({ 
        error: 'Invalid or expired token' 
      });
    }

    res.status(500).json({ 
      error: 'Email verification failed' 
    });
  }
});

// 회원가입
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, locale = 'ko' } = req.body;

    // 기본 유효성 검사
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // 이메일 형식 검사
    if (!email.includes('@')) {
      return res.status(400).json({ 
        error: 'Valid email format is required' 
      });
    }

    // 비밀번호 길이 검사
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // 이메일 중복 확인
    const existingUser = await userQueries.findByEmail(email);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        error: 'Email already exists' 
      });
    }

    // 비밀번호 해싱
    const hashedPassword = await authService.hashPassword(password);

    // 데이터베이스에 사용자 저장
    const result = await userQueries.createUser({
      email,
      password_hash: hashedPassword,
      name: name || null,
      locale
    });

    const newUser = result.rows[0];
    console.log(`🎉 새 사용자 등록 성공! 👤 ${newUser.email} (ID: ${newUser.id})`);

    // 이메일 인증 토큰 생성 및 저장
    const verificationToken = authService.generateEmailVerificationToken(email);
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24시간 후 만료

    await userQueries.updateVerificationToken(newUser.id, verificationToken, tokenExpires);

    // 인증 이메일 발송
    await emailService.sendVerificationEmail(email, verificationToken);

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully. Please check your email for verification.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        locale: newUser.locale,
        created_at: newUser.created_at
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    // 데이터베이스 제약 조건 위반 (이메일 중복 등)
    if (error.code === '23505') {
      return res.status(409).json({ 
        error: 'Email already exists' 
      });
    }

    res.status(500).json({ 
      error: 'Registration failed' 
    });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // 데이터베이스에서 사용자 조회
    const userResult = await userQueries.findByEmail(email);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    const user = userResult.rows[0];

    // 이메일 인증 확인
    if (!user.email_verified) {
      return res.status(403).json({ 
        error: 'Please verify your email before logging in' 
      });
    }

    // 비밀번호 검증
    const isValidPassword = await authService.verifyPassword(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // JWT 토큰 생성 (로그인 토큰)
    const loginToken = authService.generateAccessToken(user.id, user.email);

    console.log(`🔐 로그인 성공! 👤 ${user.email} (ID: ${user.id})`);

    res.json({ 
      success: true, 
      message: 'Login successful',
      token: loginToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        locale: user.locale,
        email_verified: user.email_verified
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed' 
    });
  }
});

module.exports = router; 