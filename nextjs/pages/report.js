import Head from 'next/head';
import { Box, Typography } from '@mui/material';

export default function Report() {
  return (
    <>
      <Head>
        <title>Customer Dashboard</title>
      </Head>
      <Box className="tab-content" sx={{ backgroundColor: '#355364', height: '93.1vh' }}>
        <Typography variant="h1" sx={{ color: '#ffffff' }}>Report Page</Typography>
      </Box>
    </>
  );
}
