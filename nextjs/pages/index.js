import Head from 'next/head';
import { Box, Typography } from '@mui/material';
import TabNavigation from '@/components/TabNavigation';
import useBearStore from '@/store/useBearStore';

export default function Home() {
  const carCount = useBearStore((state) => state.carCount);

  return (
    <>
      <Head>
        <title>Customer Dashboard</title>
      </Head>
      {/* <TabNavigation /> */}
      <Box className="dashboard-container" sx={{ backgroundColor: '#355364', height: '93.1vh' }}>
        <Typography variant="h1" sx={{ color: '#ffffff' }}id="carCount">{carCount}</Typography>
      </Box>
    </>
  );
}


