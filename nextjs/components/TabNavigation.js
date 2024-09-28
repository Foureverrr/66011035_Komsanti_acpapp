import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useRouter } from 'next/router';

const TabNavigation = ({ onLock }) => {
  const router = useRouter();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#182b3b' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
          <Button color="inherit" onClick={() => router.push('/')}>Dashboard</Button>
          <Button color="inherit" onClick={() => router.push('/customer')}>Customer</Button>
          <Button color="inherit" onClick={() => router.push('/report')}>Report</Button>
          <Button color="inherit" onClick={onLock}>Lock</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TabNavigation;
