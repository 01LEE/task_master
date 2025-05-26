import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import styled from 'styled-components';
import { useState } from 'react';
import { Layout, Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components';
import { useForm } from '@/hooks/useForm';
import PasswordStrength from '@/components/ui/PasswordStrength';

interface SignUpFormData extends Record<string, string> {
  email: string;
  password: string;
  passwordConfirm: string;
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(180deg, ${({ theme }) => theme.colors.gray[50]} 0%, ${({ theme }) => theme.colors.background} 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const FormHeader = styled.div`
  text-align: center;
  padding: 3rem 2rem 2rem 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const FormTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.01em;
`;

const FormSubtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

const FormContent = styled.div`
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.surface};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.light}40;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const ErrorMessage = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.error};
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary.main};
  border: none;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  margin-top: 0.5rem;

  &:hover {
    background: ${({ theme }) => theme.colors.primary.dark};
    transform: translateY(-1px);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[400]};
    cursor: not-allowed;
    transform: none;
  }
`;

const DividerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
`;

const Divider = styled.hr`
  flex: 1;
  border: none;
  height: 1px;
  background: ${({ theme }) => theme.colors.gray[300]};
`;

const DividerText = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
`;

const SocialButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  padding: 0.875rem 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray[400]};
    background: ${({ theme }) => theme.colors.gray[50]};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SocialIcon = styled.span`
  font-size: 1.125rem;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const LoginLinkButton = styled.button`
  color: ${({ theme }) => theme.colors.text.primary};
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

export default function SignUp() {
  const { t } = useTranslation('common');
  const [showSocialOptions, setShowSocialOptions] = useState(false);

  const {
    values,
    errors,
    getFieldProps,
    validateForm,
    isSubmitting,
    setIsSubmitting,
    reset,
  } = useForm<SignUpFormData>({
    initialValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
    validationRules: {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        custom: (value) => {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return t('signup.errors.invalidEmail');
          }
          return null;
        },
      },
      password: {
        required: true,
        minLength: 8,
        custom: (value) => {
          if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            return t('signup.errors.weakPassword');
          }
          return null;
        },
      },
      passwordConfirm: {
        required: true,
        custom: (value) => {
          if (value !== values.password) {
            return t('signup.errors.passwordMismatch');
          }
          return null;
        },
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 백엔드 API로 회원가입 요청
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          name: values.email.split('@')[0], // 이메일에서 이름 추출 (임시)
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(t('signup.messages.verificationEmailSent'));
        // 폼을 초기화하지 않고 사용자에게 이메일 확인 안내
      } else {
        const errorMessage = data.error || data.message || '회원가입에 실패했습니다.';
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Sign up failed:', error);
      alert(t('signup.messages.signupError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignUp = (provider: string) => {
    // TODO: Implement social sign up
    console.log(`Sign up with ${provider}`);
    alert(`${provider} ${t('signup.messages.socialSignupPending')}`);
  };

  return (
    <Layout>
      <Head>
        <title>{t('signup.title')}</title>
        <meta name="description" content={t('signup.description')} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <Container>
        <FormCard>
          <FormHeader>
            <FormTitle>{t('signup.formTitle')}</FormTitle>
            <FormSubtitle>{t('signup.formSubtitle')}</FormSubtitle>
          </FormHeader>

          <FormContent>
            <Form onSubmit={handleSubmit}>
              <FormField>
                <Label htmlFor="email">{t('signup.email')}</Label>
                <StyledInput
                  id="email"
                  type="email"
                  placeholder={t('signup.emailPlaceholder')}
                  value={values.email}
                  onChange={(e) => getFieldProps('email').onChange(e)}
                  onBlur={getFieldProps('email').onBlur}
                  disabled={isSubmitting}
                  autoComplete="email"
                />
                {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
              </FormField>

              <FormField>
                <Label htmlFor="password">{t('signup.password')}</Label>
                <StyledInput
                  id="password"
                  type="password"
                  placeholder={t('signup.passwordPlaceholder')}
                  value={values.password}
                  onChange={(e) => getFieldProps('password').onChange(e)}
                  onBlur={getFieldProps('password').onBlur}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
                {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                <PasswordStrength password={values.password} />
              </FormField>

              <FormField>
                <Label htmlFor="passwordConfirm">{t('signup.passwordConfirm')}</Label>
                <StyledInput
                  id="passwordConfirm"
                  type="password"
                  placeholder={t('signup.passwordConfirmPlaceholder')}
                  value={values.passwordConfirm}
                  onChange={(e) => getFieldProps('passwordConfirm').onChange(e)}
                  onBlur={getFieldProps('passwordConfirm').onBlur}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
                {errors.passwordConfirm && <ErrorMessage>{errors.passwordConfirm}</ErrorMessage>}
              </FormField>

              <SubmitButton
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('signup.submitting') : t('signup.submitButton')}
              </SubmitButton>
            </Form>

            <DividerContainer>
              <Divider />
              <DividerText>{t('signup.divider')}</DividerText>
              <Divider />
            </DividerContainer>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <SocialButton
                onClick={() => handleSocialSignUp('Google')}
                disabled={isSubmitting}
              >
                <SocialIcon>🔍</SocialIcon>
                {t('signup.googleSignup')}
              </SocialButton>

              <SocialButton
                onClick={() => handleSocialSignUp('Kakao')}
                disabled={isSubmitting}
              >
                <SocialIcon>💬</SocialIcon>
                {t('signup.kakaoSignup')}
              </SocialButton>

              <SocialButton
                onClick={() => handleSocialSignUp('Naver')}
                disabled={isSubmitting}
              >
                <SocialIcon>🟢</SocialIcon>
                {t('signup.naverSignup')}
              </SocialButton>
            </div>

            <LoginLink>
              {t('signup.loginPrompt')}{' '}
              <LoginLinkButton type="button">
                {t('signup.loginLink')}
              </LoginLinkButton>
            </LoginLink>
          </FormContent>
        </FormCard>
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
    },
  };
}; 