import * as React from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Head from 'next/head';
import LockScreen from '@/components/LockScreen';
import TabNavigation from '@/components/TabNavigation';

const theme = createTheme({
  palette: {
    primary: {
      main: '#182b3b',
    },
    secondary: {
      main: '#ff5e15',
    },
  },
});

export default function MyApp({ Component, pageProps }) {
  const [isLocked, setIsLocked] = React.useState(true);

  const unlock = () => {
    setIsLocked(false);
  };

  const lock = () => {
    setIsLocked(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>Customer Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {isLocked ? (
        <LockScreen onUnlock={unlock} />
      ) : (
        <>
          <TabNavigation onLock={lock} />
          <Component {...pageProps} />
        </>
      )}
    </ThemeProvider>
  );
}
