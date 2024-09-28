// CustomerForm.js
import React from 'react';
import { Box, TextField, Button, Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import useBearStore from '@/store/useBearStore';

const WhiteTextField = styled(TextField)({
  '& label': {
    color: '#ffffff',
  },
  '& input': {
    color: '#ffffff',
  },
  '& label.Mui-focused': {
    color: '#ffffff',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ffffff',
    },
    '&:hover fieldset': {
      borderColor: '#ffffff',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ffffff',
    },
  },
});

const WhiteSelect = styled(Select)({
  '& .MuiInputBase-input': {
    color: '#ffffff',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ffffff',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ffffff',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ffffff',
  },
});

export default function CustomerForm() {
  const addCustomer = useBearStore((state) => state.addCustomer);
  const fetchCustomers = useBearStore((state) => state.fetchCustomers);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const customerData = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post('http://localhost:8000/api/add_customer', customerData);
      console.log('Customer data added successfully:', response.data);
      alert('Customer data added successfully');
      
      // Update state and fetch latest customers from the backend
      addCustomer(customerData);
      fetchCustomers();
    } catch (error) {
      console.error('Error adding customer data:', error);
      alert('Failed to add customer data');
    }

    event.target.reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="form-container" sx={{ width: '30%', padding: '50px' }}>
      <Typography variant="h5" style={{ color: '#ffffff' }}>Customer Info</Typography>
      <WhiteTextField label="Name" name="name" required fullWidth margin="dense" variant="outlined" />
      <WhiteTextField label="Surname" name="surname" required fullWidth margin="dense" variant="outlined" />
      <WhiteTextField label="Tel" name="tel" required fullWidth margin="dense" variant="outlined" />

      <Typography variant="h5" style={{ color: '#ffffff' }}>Car Info</Typography>
      <WhiteTextField label="License Plate" name="licensePlate" required fullWidth margin="dense" variant="outlined" />
      <WhiteTextField label="Brand" name="brand" required fullWidth margin="dense" variant="outlined" />
      <WhiteTextField label="Model" name="model" required fullWidth margin="dense" variant="outlined" />

      <FormControl fullWidth margin="dense" variant="outlined">
        <InputLabel style={{ color: '#ffffff' }}>Symptoms</InputLabel>
        <WhiteSelect name="symptoms" required>
          <MenuItem value="Air conditioner">Air conditioner</MenuItem>
          <MenuItem value="Brake System">Brake System</MenuItem>
          <MenuItem value="Tyre Changing">Tyre Changing</MenuItem>
        </WhiteSelect>
      </FormControl>

      <Typography variant="h5" style={{ color: '#ffffff' }}>Maintenance Info</Typography>
      <WhiteTextField label="Cost" name="nextCheckup" required fullWidth margin="dense" variant="outlined" />

      <FormControl fullWidth margin="dense" variant="outlined">
        <InputLabel style={{ color: '#ffffff' }}>Mechanic</InputLabel>
        <WhiteSelect name="mechanic" required>
          <MenuItem value="Nuttawut K.">Nuttawut K.</MenuItem>
          <MenuItem value="Phurint B.">Phurint B.</MenuItem>
          <MenuItem value="Pantapat I.">Pantapat I.</MenuItem>
          <MenuItem value="Norraphat K.">Norraphat K.</MenuItem>
        </WhiteSelect>
      </FormControl>

      <Button type="submit" variant="contained" sx={{ backgroundColor: '#182b3b', color: '#ffffff', marginTop: '20px' }}>
        ADD
      </Button>
    </Box>
  );
}
