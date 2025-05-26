import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Image from 'next/image';
import styled, { keyframes } from 'styled-components';
import { Layout, Button, Card, CardContent } from '@/components';
import { useState, useEffect } from 'react';

const slideUp = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-100%); }
`;

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 2rem;
  position: relative;
  background: linear-gradient(180deg, ${({ theme }) => theme.colors.gray[50]} 0%, ${({ theme }) => theme.colors.background} 100%);
`;

const HeroContent = styled.div`
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 4rem;
    text-align: center;
  }
`;

const TextContent = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: 2;
  }
`;

const VisualContent = styled.div`
  position: relative;
  height: 500px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: 1;
    height: 400px;
  }
`;

const BrandName = styled.h1`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 1.5rem 0;
  line-height: 1.1;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 3rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2.5rem;
  }
`;

const Tagline = styled.p`
  font-size: 1.5rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 2rem;
  line-height: 1.5;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.25rem;
  }
`;

const ValueStatement = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 3rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.75rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.5rem;
  }
`;

const CTASection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
  }
`;

const PrimaryButton = styled(Button)`
  background: ${({ theme }) => theme.colors.primary.main};
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.white};
  transition: all 0.2s ease;
  min-width: 160px;

  &:hover {
    background: ${({ theme }) => theme.colors.primary.dark};
    transform: translateY(-1px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: all 0.2s ease;
  min-width: 160px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray[400]};
    background: ${({ theme }) => theme.colors.gray[50]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const MetricsContainer = styled.div`
  display: flex;
  gap: 3rem;
  margin-top: 4rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 2rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    justify-content: center;
  }
`;

const MetricItem = styled.div`
  text-align: left;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    text-align: center;
  }
`;

const MetricNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.75rem;
  }
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
`;

const Section = styled.section`
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 4rem 2rem;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
  letter-spacing: -0.01em;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  padding: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: 12px;
  transition: all 0.2s ease;
  background: ${({ theme }) => theme.colors.surface};

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray[300]};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: 12px;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.75rem;
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  font-size: 0.9375rem;
`;

const ProcessSection = styled(Section)`
  background: ${({ theme }) => theme.colors.gray[50]};
  margin-top: 6rem;
  border-radius: 24px;
`;

const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ProcessStep = styled.div`
  text-align: center;
`;

const StepNumber = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 auto 1.5rem auto;
`;

const StepTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.75rem;
`;

const StepDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
  font-size: 0.9375rem;
`;

const TestimonialSection = styled(Section)`
  overflow: hidden;
`;

const TestimonialSlider = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: 400px;
  overflow: hidden;
  position: relative;
`;

const TestimonialTrack = styled.div<{ isAnimating: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: ${({ isAnimating }) => isAnimating ? slideUp : 'none'} 20s linear infinite;
`;

const TestimonialCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: 2rem;
  border-radius: 12px;
  min-height: 180px;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray[300]};
    transform: translateY(-1px);
  }
`;

const TestimonialText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1.5rem;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AuthorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.9375rem;
`;

const AuthorRole = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 0.125rem;
`;

const FooterCTA = styled.section`
  padding: 4rem 2rem;
  background: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
`;

const FooterCTATitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.white};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.75rem;
  }
`;

const FooterCTASubtitle = styled.p`
  font-size: 1.125rem;
  opacity: 0.8;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  color: ${({ theme }) => theme.colors.white};
`;

const FooterCTAButton = styled(Button)`
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary.main};
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    transform: translateY(-1px);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

// SVG Icons
const BrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
    <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
    <path d="M6 18a4 4 0 0 1-1.967-.516"/>
    <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const BarChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" x2="12" y1="20" y2="10"/>
    <line x1="18" x2="18" y1="20" y2="4"/>
    <line x1="6" x2="6" y1="20" y2="16"/>
  </svg>
);

const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55.47.98.97 1.21C12.04 18.75 13 20.24 13 22"/>
    <path d="M14 14.66V17c0 .55-.47.98-.97 1.21C11.96 18.75 11 20.24 11 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);

const MessageCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
  </svg>
);

export default function Home() {
  const { t, ready, i18n } = useTranslation('common');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // Debug logging
  console.log('Translation ready:', ready);
  console.log('Current language:', i18n.language);
  console.log('Test translation (home.tagline):', t('home.tagline'));
  console.log('Test translation (home.getStarted):', t('home.getStarted'));

  // Show loading state if translations are not ready
  if (!ready) {
    return <div>Loading translations...</div>;
  }

  const testimonials = [
    {
      text: t('testimonials.review1.text'),
      author: t('testimonials.review1.author'),
      role: t('testimonials.review1.role'),
      avatar: t('testimonials.review1.avatar')
    },
    {
      text: t('testimonials.review2.text'),
      author: t('testimonials.review2.author'),
      role: t('testimonials.review2.role'),
      avatar: t('testimonials.review2.avatar')
    },
    {
      text: t('testimonials.review3.text'),
      author: t('testimonials.review3.author'),
      role: t('testimonials.review3.role'),
      avatar: t('testimonials.review3.avatar')
    },
    {
      text: t('testimonials.review4.text'),
      author: t('testimonials.review4.author'),
      role: t('testimonials.review4.role'),
      avatar: t('testimonials.review4.avatar')
    },
    {
      text: t('testimonials.review5.text'),
      author: t('testimonials.review5.author'),
      role: t('testimonials.review5.role'),
      avatar: t('testimonials.review5.avatar')
    }
  ];

  // Create doubled array for continuous scrolling
  const doubledTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 16000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleAppStoreDownload = (store: 'android' | 'ios') => {
    const urls = {
      android: 'https://play.google.com/store/apps',
      ios: 'https://apps.apple.com/',
    };
    
    console.log(`Downloading from ${store}`);
    // window.open(urls[store], '_blank');
  };

  return (
    <Layout>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <Container>
        <HeroSection>
          <HeroContent>
            <TextContent>
              <BrandName>Dogether</BrandName>
              <Tagline>{t('home.tagline') || '반려견과 함께하는 새로운 산책 경험'}</Tagline>
              <ValueStatement 
                dangerouslySetInnerHTML={{ 
                  __html: (t('home.valueStatement') || 'AI 매칭으로 찾는\n완벽한 산책 파트너').replace(/\n/g, '<br />') 
                }}
              />
              
              <CTASection>
                <PrimaryButton 
                  size="lg" 
                  onClick={() => handleAppStoreDownload('android')}
                >
                  {t('home.getStarted')}
                </PrimaryButton>
                <SecondaryButton size="lg">
                  {t('home.learnMore')}
                </SecondaryButton>
              </CTASection>

              <MetricsContainer>
                <MetricItem>
                  <MetricNumber>10K+</MetricNumber>
                  <MetricLabel>{t('home.activeUsers')}</MetricLabel>
                </MetricItem>
                <MetricItem>
                  <MetricNumber>50K+</MetricNumber>
                  <MetricLabel>{t('home.matchingSuccess')}</MetricLabel>
                </MetricItem>
                <MetricItem>
                  <MetricNumber>4.9</MetricNumber>
                  <MetricLabel>{t('home.userRating')}</MetricLabel>
                </MetricItem>
              </MetricsContainer>
            </TextContent>
            
            <VisualContent>
              <ImageContainer>
                <Image
                  src="https://images.unsplash.com/photo-1544568100-847a948585b9?w=500&h=500&fit=crop&crop=center"
                  alt={t('home.altText')}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </ImageContainer>
            </VisualContent>
          </HeroContent>
        </HeroSection>

        <ProcessSection>
          <SectionHeader>
            <SectionTitle>{t('process.title')}</SectionTitle>
            <SectionSubtitle>
              {t('process.subtitle')}
            </SectionSubtitle>
          </SectionHeader>
          
          <ProcessGrid>
            <ProcessStep>
              <StepNumber>1</StepNumber>
              <StepTitle>{t('process.step1.title')}</StepTitle>
              <StepDescription>
                {t('process.step1.description')}
              </StepDescription>
            </ProcessStep>
            
            <ProcessStep>
              <StepNumber>2</StepNumber>
              <StepTitle>{t('process.step2.title')}</StepTitle>
              <StepDescription>
                {t('process.step2.description')}
              </StepDescription>
            </ProcessStep>
            
            <ProcessStep>
              <StepNumber>3</StepNumber>
              <StepTitle>{t('process.step3.title')}</StepTitle>
              <StepDescription>
                {t('process.step3.description')}
              </StepDescription>
            </ProcessStep>
          </ProcessGrid>
        </ProcessSection>

        <Section>
          <SectionHeader>
            <SectionTitle>{t('features.title')}</SectionTitle>
            <SectionSubtitle>
              {t('features.subtitle')}
            </SectionSubtitle>
          </SectionHeader>
          
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <BrainIcon />
              </FeatureIcon>
              <FeatureTitle>{t('features.aiMatching.title')}</FeatureTitle>
              <FeatureDescription>
                {t('features.aiMatching.description')}
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <ShieldIcon />
              </FeatureIcon>
              <FeatureTitle>{t('features.safety.title')}</FeatureTitle>
              <FeatureDescription>
                {t('features.safety.description')}
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <MapPinIcon />
              </FeatureIcon>
              <FeatureTitle>{t('features.routing.title')}</FeatureTitle>
              <FeatureDescription>
                {t('features.routing.description')}
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <BarChartIcon />
              </FeatureIcon>
              <FeatureTitle>{t('features.health.title')}</FeatureTitle>
              <FeatureDescription>
                {t('features.health.description')}
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <TrophyIcon />
              </FeatureIcon>
              <FeatureTitle>{t('features.rewards.title')}</FeatureTitle>
              <FeatureDescription>
                {t('features.rewards.description')}
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <MessageCircleIcon />
              </FeatureIcon>
              <FeatureTitle>{t('features.community.title')}</FeatureTitle>
              <FeatureDescription>
                {t('features.community.description')}
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </Section>

        <TestimonialSection>
          <SectionHeader>
            <SectionTitle>{t('testimonials.title')}</SectionTitle>
            <SectionSubtitle>
              {t('testimonials.subtitle')}
            </SectionSubtitle>
          </SectionHeader>
          
          <TestimonialSlider>
            <TestimonialTrack isAnimating={true}>
              {doubledTestimonials.map((testimonial, index) => (
                <TestimonialCard key={index}>
                  <TestimonialText>
                    "{testimonial.text}"
                  </TestimonialText>
                  <TestimonialAuthor>
                    <AuthorAvatar>{testimonial.avatar}</AuthorAvatar>
                    <AuthorInfo>
                      <AuthorName>{testimonial.author}</AuthorName>
                      <AuthorRole>{testimonial.role}</AuthorRole>
                    </AuthorInfo>
                  </TestimonialAuthor>
                </TestimonialCard>
              ))}
            </TestimonialTrack>
          </TestimonialSlider>
        </TestimonialSection>

        <FooterCTA>
          <FooterCTATitle>{t('cta.title')}</FooterCTATitle>
          <FooterCTASubtitle>
            {t('cta.subtitle')}
          </FooterCTASubtitle>
          <FooterCTAButton 
            size="lg" 
            onClick={() => handleAppStoreDownload('android')}
          >
            {t('cta.button')}
          </FooterCTAButton>
        </FooterCTA>
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common'], null, ['ko', 'en', 'ja'])),
    },
  };
}; 