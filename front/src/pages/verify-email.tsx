import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

interface VerificationState {
  status: 'loading' | 'success' | 'error' | 'expired';
  message: string;
  email?: string;
}

const VerifyEmailPage: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [verificationState, setVerificationState] = useState<VerificationState>({
    status: 'loading',
    message: ''
  });

  useEffect(() => {
    const verifyEmail = async () => {
      const { token } = router.query;

      if (!token) {
        setVerificationState({
          status: 'error',
          message: '인증 토큰이 없습니다.'
        });
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.success) {
          setVerificationState({
            status: 'success',
            message: data.message,
            email: data.email
          });
          
          // 3초 후 홈페이지로 리다이렉트
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } else {
          // API 응답에서 message가 없을 경우를 대비한 안전한 처리
          const message = data.message || data.error || '인증에 실패했습니다.';
          setVerificationState({
            status: message.includes('expired') ? 'expired' : 'error',
            message: message
          });
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationState({
          status: 'error',
          message: '인증 중 오류가 발생했습니다.'
        });
      }
    };

    if (router.query.token) {
      verifyEmail();
    }
  }, [router.query.token]);

  const handleResendEmail = async () => {
    if (verificationState.email) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/send-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: verificationState.email }),
        });

        if (response.ok) {
          alert('새로운 인증 이메일이 발송되었습니다.');
        } else {
          alert('이메일 재발송에 실패했습니다.');
        }
      } catch (error) {
        console.error('Resend email error:', error);
        alert('이메일 재발송 중 오류가 발생했습니다.');
      }
    }
  };

  const renderContent = () => {
    switch (verificationState.status) {
      case 'loading':
        return (
          <ContentContainer>
            <IconContainer>⏳</IconContainer>
            <Title>이메일 인증 중...</Title>
            <Message>잠시만 기다려주세요.</Message>
          </ContentContainer>
        );

      case 'success':
        return (
          <ContentContainer>
            <IconContainer success>✅</IconContainer>
            <Title>이메일 인증 완료!</Title>
            <Message>{verificationState.message}</Message>
            {verificationState.email && (
              <EmailInfo>인증된 이메일: {verificationState.email}</EmailInfo>
            )}
            <RedirectMessage>3초 후 홈페이지로 이동합니다...</RedirectMessage>
          </ContentContainer>
        );

      case 'expired':
        return (
          <ContentContainer>
            <IconContainer error>⏰</IconContainer>
            <Title>인증 링크 만료</Title>
            <Message>인증 링크가 만료되었습니다. (24시간 유효)</Message>
            <ActionButton onClick={handleResendEmail}>
              새 인증 이메일 받기
            </ActionButton>
            <BackButton onClick={() => router.push('/signup')}>
              회원가입 페이지로 돌아가기
            </BackButton>
          </ContentContainer>
        );

      case 'error':
      default:
        return (
          <ContentContainer>
            <IconContainer error>❌</IconContainer>
            <Title>인증 실패</Title>
            <Message>{verificationState.message}</Message>
            <ActionButton onClick={() => router.push('/signup')}>
              회원가입 다시 하기
            </ActionButton>
          </ContentContainer>
        );
    }
  };

  return (
    <>
      <Head>
        <title>이메일 인증 - DoGether</title>
        <meta name="description" content="DoGether 이메일 인증 페이지" />
      </Head>
      <Container>
        <Card>
          <LogoContainer>
            <Logo>🐕 DoGether</Logo>
          </LogoContainer>
          {renderContent()}
        </Card>
      </Container>
    </>
  );
};

// 스타일 컴포넌트들
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const LogoContainer = styled.div`
  margin-bottom: 30px;
`;

const Logo = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconContainer = styled.div<{ success?: boolean; error?: boolean }>`
  font-size: 4rem;
  margin-bottom: 20px;
  
  ${props => props.success && `
    animation: bounce 0.6s ease-in-out;
  `}
  
  ${props => props.error && `
    animation: shake 0.5s ease-in-out;
  `}
  
  @keyframes bounce {
    0%, 20%, 60%, 100% { transform: translateY(0); }
    40% { transform: translateY(-20px); }
    80% { transform: translateY(-10px); }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin: 0 0 15px 0;
  color: #333;
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin: 0 0 20px 0;
  line-height: 1.5;
`;

const EmailInfo = styled.p`
  font-size: 0.9rem;
  color: #888;
  background: #f8f9fa;
  padding: 10px 15px;
  border-radius: 8px;
  margin: 10px 0;
  border-left: 4px solid #667eea;
`;

const RedirectMessage = styled.p`
  font-size: 0.9rem;
  color: #999;
  margin-top: 20px;
  font-style: italic;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin: 10px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const BackButton = styled.button`
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  margin: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: #667eea;
    color: white;
  }
`;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
    },
  };
};

export default VerifyEmailPage; 