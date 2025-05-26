import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: ${({ theme }) => theme.colors.background};
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px; /* Header height compensation */
  
  @media (max-width: 768px) {
    padding-top: 70px;
  }
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        {children}
      </MainContent>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout; 