import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const Dashboard = () => {
  const [carCount, setCarCount] = useState(0);

  useEffect(() => {
    // Logic to update car count
  }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', color: '#ffffff' }}>
      <Typography variant="h1">{carCount}</Typography>
    </Box>
  );
};

export default Dashboard;
