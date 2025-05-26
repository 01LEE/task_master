import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useTheme } from '@/contexts/ThemeContext';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #f1f5f9;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  body.dark-theme & {
    background: rgba(15, 23, 42, 0.95);
    border-bottom: 1px solid #334155;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const BrandName = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.01em;

  body.dark-theme & {
    color: #ffffff;
  }

  @media (max-width: 768px) {
    font-size: 1.375rem;
  }
`;

const NavigationSection = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

const ControlButton = styled.button<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 8px;
  background: ${({ isActive }) => 
    isActive ? '#0f172a' : '#f8fafc'};
  color: ${({ isActive }) => 
    isActive ? '#ffffff' : '#64748b'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;

  &:hover {
    background: ${({ isActive }) => 
      isActive ? '#334155' : '#f1f5f9'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  body.dark-theme & {
    background: ${({ isActive }) => 
      isActive ? '#ffffff' : '#334155'};
    color: ${({ isActive }) => 
      isActive ? '#0f172a' : '#cbd5e1'};

    &:hover {
      background: ${({ isActive }) => 
        isActive ? '#f1f5f9' : '#475569'};
    }
  }
`;

const LanguageDropdown = styled.div`
  position: relative;
`;

const DropdownContent = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 0.5rem;
  min-width: 140px;
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;

  body.dark-theme & {
    background: #1e293b;
    border-color: #334155;
  }
`;

const LanguageOption = styled.button<{ isActive: boolean }>`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  background: ${({ isActive }) => 
    isActive ? '#f8fafc' : 'transparent'};
  color: ${({ isActive }) => 
    isActive ? '#0f172a' : '#64748b'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  &:hover {
    background: #f8fafc;
    color: #0f172a;
  }

  body.dark-theme & {
    background: ${({ isActive }) => 
      isActive ? '#334155' : 'transparent'};
    color: ${({ isActive }) => 
      isActive ? '#ffffff' : '#cbd5e1'};

    &:hover {
      background: #334155;
      color: #ffffff;
    }
  }
`;

const SignUpButton = styled.button`
  background: #0f172a;
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  &:hover {
    background: #334155;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  body.dark-theme & {
    background: #ffffff;
    color: #0f172a;

    &:hover {
      background: #f1f5f9;
    }
  }

  @media (max-width: 768px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.8125rem;
  }
`;

const Header: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const languages = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ];

  const currentLanguage = languages.find(lang => lang.code === router.locale) || languages[0];

  const handleLanguageChange = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale });
    setIsLanguageOpen(false);
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <HeaderContainer>
      <LogoSection onClick={() => router.push('/')}>
        <BrandName>Dogether</BrandName>
      </LogoSection>

      <NavigationSection>
        {/* Dark Mode Toggle */}
        <ControlButton 
          isActive={isDarkMode}
          onClick={toggleDarkMode}
          title={t('darkMode')}
        >
          {isDarkMode ? '🌙' : '☀️'}
        </ControlButton>

        {/* Language Selector */}
        <LanguageDropdown>
          <ControlButton 
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            title={t('language')}
          >
            {currentLanguage.flag}
          </ControlButton>
          <DropdownContent isOpen={isLanguageOpen}>
            {languages.map((language) => (
              <LanguageOption
                key={language.code}
                isActive={language.code === router.locale}
                onClick={() => handleLanguageChange(language.code)}
              >
                {language.flag} {language.name}
              </LanguageOption>
            ))}
          </DropdownContent>
        </LanguageDropdown>

        {/* Sign Up Button */}
        <SignUpButton onClick={handleSignUp}>
          {t('signUp')}
        </SignUpButton>
      </NavigationSection>
    </HeaderContainer>
  );
};

export default Header; 