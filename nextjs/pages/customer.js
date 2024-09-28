import Head from 'next/head';
import { Box } from '@mui/material';
import CustomerForm from '@/components/CustomerForm';
import CustomerTable from '@/components/CustomerTable';

export default function Customer() {
  return (
    <>
      <Head>
        <title>Customer Dashboard</title>
      </Head>
      <Box className="tab-content active" sx={{ display: 'flex', backgroundColor: '#355364', height: '93.1vh' }}>
        <CustomerForm />
        <CustomerTable />
      </Box>
    </>
  );
}
