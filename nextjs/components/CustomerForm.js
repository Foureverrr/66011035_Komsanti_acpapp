import React, { useEffect } from 'react';
import { Box, TextField, Button, Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import useBearStore from '@/store/useBearStore'; // Import the Zustand store

// Styled components to maintain the existing UI design
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
  const mechanics = useBearStore((state) => state.mechanics); // Get mechanics from Zustand state
  const fetchMechanics = useBearStore((state) => state.setMechanics); // Fetch mechanics to set state

  // Fetch mechanics from local storage on component mount or server response
  useEffect(() => {
    const savedMechanics = localStorage.getItem('mechanics');
    if (savedMechanics) {
      fetchMechanics(JSON.parse(savedMechanics)); // Set the fetched mechanics to Zustand state
    }
  }, [fetchMechanics]);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const customerData = Object.fromEntries(formData.entries());

    // Combine name and surname into customer_name for the backend
    customerData.customer_name = `${customerData.name} ${customerData.surname}`;

    try {
      const response = await axios.post('http://localhost:8000/api/add_customer', customerData);
      console.log('Customer data added successfully:', response.data);

      // Update Zustand state with the new customer data including the timestamp
      addCustomer({
        ...response.data.customer, // Use the returned customer data from the backend
        timestamp: new Date().toISOString()
      });
      alert('Customer data added successfully');
    } catch (error) {
      console.error('Error adding customer data:', error);
      alert('Failed to add customer data');
    }

    // Reset the form after successful submission
    event.target.reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="form-container" sx={{ width: '22%', padding: '40px' }}>
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
      <WhiteTextField label="Cost" name="cost" required fullWidth margin="dense" variant="outlined" />

      <FormControl fullWidth margin="dense" variant="outlined">
        <InputLabel style={{ color: '#ffffff' }}>Mechanic</InputLabel>
        <WhiteSelect name="mechanic" required>
          {mechanics.length > 0 ? (
            mechanics.map((mechanic, index) => (
              <MenuItem key={index} value={`${mechanic.name} ${mechanic.surname}`}>
                {`${mechanic.name} ${mechanic.surname}`}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="None">None</MenuItem>
          )}
        </WhiteSelect>
      </FormControl>

      <Button type="submit" variant="contained" sx={{ backgroundColor: '#182b3b', color: '#ffffff', marginTop: '20px' }}>
        ADD
      </Button>
    </Box>
  );
}
