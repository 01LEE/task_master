import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import GlobalStyle from '@/styles/GlobalStyle';
import { theme, darkTheme } from '@/styles/theme';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

function AppContent(props: AppProps) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? darkTheme : theme;
  const { Component, pageProps } = props;

  return (
    <StyledThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </StyledThemeProvider>
  );
}

function MyApp(props: AppProps) {
  return (
    <ThemeProvider>
      <AppContent {...props} />
    </ThemeProvider>
  );
}

export default appWithTranslation(MyApp); 