import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.gray[800]};
  color: ${({ theme }) => theme.colors.white};
  padding: 4rem 2rem 2rem;
  margin-top: auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 1.5rem;
  letter-spacing: -0.01em;
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.gray[400]};
  text-decoration: none;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  transition: color 0.2s ease;
  font-weight: 400;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const FooterText = styled.p`
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-weight: 400;
`;

const LogoSection = styled.div`
  margin-bottom: 1.5rem;
`;

const BrandName = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.white};
  margin: 0 0 1rem 0;
  letter-spacing: -0.01em;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${({ theme }) => theme.colors.gray[600]};
  margin: 3rem 0 2rem;
`;

const BottomSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[500]};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  color: ${({ theme }) => theme.colors.gray[500]};
  background: ${({ theme }) => theme.colors.gray[700]};
  border-radius: 8px;
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    background: ${({ theme }) => theme.colors.gray[600]};
    transform: translateY(-1px);
  }
`;

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  
  // Debug logging
  console.log('Footer - Current language:', i18n.language);
  console.log('Footer - Router locale:', router.locale);
  console.log('Footer - Test translation:', t('footer.services.title'));

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <LogoSection>
            <BrandName>Dogether</BrandName>
          </LogoSection>
          <FooterText>
            {t('footer.description')}
          </FooterText>
        </FooterSection>

        <FooterSection>
          <SectionTitle>{t('footer.services.title')}</SectionTitle>
          <FooterLink href="#features">{t('footer.services.features')}</FooterLink>
          <FooterLink href="#download">{t('footer.services.download')}</FooterLink>
          <FooterLink href="#safety">{t('footer.services.safety')}</FooterLink>
          <FooterLink href="#community">{t('footer.services.community')}</FooterLink>
        </FooterSection>

        <FooterSection>
          <SectionTitle>{t('footer.support.title')}</SectionTitle>
          <FooterLink href="#help">{t('footer.support.help')}</FooterLink>
          <FooterLink href="#contact">{t('footer.support.contact')}</FooterLink>
          <FooterLink href="#faq">{t('footer.support.faq')}</FooterLink>
          <FooterLink href="#report">{t('footer.support.report')}</FooterLink>
        </FooterSection>

        <FooterSection>
          <SectionTitle>{t('footer.company.title')}</SectionTitle>
          <FooterLink href="#about">{t('footer.company.about')}</FooterLink>
          <FooterLink href="#careers">{t('footer.company.careers')}</FooterLink>
          <FooterLink href="#press">{t('footer.company.press')}</FooterLink>
          <FooterLink href="#terms">{t('footer.company.terms')}</FooterLink>
          <FooterLink href="#privacy">{t('footer.company.privacy')}</FooterLink>
        </FooterSection>
      </FooterContent>

      <Divider />

      <BottomSection>
        <div>
          {t('footer.copyright')}
        </div>
        <SocialLinks>
          <SocialLink href="#instagram" aria-label="Instagram">
            📷
          </SocialLink>
          <SocialLink href="#facebook" aria-label="Facebook">
            📘
          </SocialLink>
          <SocialLink href="#twitter" aria-label="Twitter">
            🐦
          </SocialLink>
          <SocialLink href="#youtube" aria-label="YouTube">
            📺
          </SocialLink>
        </SocialLinks>
      </BottomSection>
    </FooterContainer>
  );
};

export default Footer; 