import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const LockScreenContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#355364',
  color: 'white',
});

const LockScreen = ({ onUnlock }) => {
  const [password, setPassword] = useState('');

  const unlock = () => {
    if (password === '12345678') {
      // Store the lock state in localStorage
      localStorage.setItem('isLocked', 'false');
      onUnlock();
    } else {
      alert('Incorrect password!');
    }
  };

  return (
    <LockScreenContainer>
      <Typography variant="h4">Enter Password</Typography>
      <TextField
        type="password"
        variant="outlined"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ marginTop: '50px', marginBottom: '100px', width: '20%' }}
      />
      <Button variant="contained" onClick={unlock} sx={{ backgroundColor: '#182b3b', color: 'white' }}>
        Unlock
      </Button>
    </LockScreenContainer>
  );
};

export default LockScreen;
