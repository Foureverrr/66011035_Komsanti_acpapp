import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Drawer, IconButton } from '@mui/material';
import useBearStore from '@/store/useBearStore';
import dayjs from 'dayjs';
import axios from 'axios';
import { styled } from '@mui/material/styles';

// Styled components for the drawer and button
const DrawerButton = styled(IconButton)({
  position: 'fixed',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 999,
});

export default function Report() {
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [brandCount, setBrandCount] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);

  // Mechanics drawer state
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [tel, setTel] = useState('');
  const mechanics = useBearStore((state) => state.mechanics); // Mechanics from Zustand
  const addMechanic = useBearStore((state) => state.addMechanic); // Add mechanic to Zustand state
  const setMechanics = useBearStore((state) => state.setMechanics); // Set mechanic state
  const fetchCustomers = useBearStore((state) => state.fetchCustomers); // Fetch customers from Zustand
  const customers = useBearStore((state) => state.customers); // Customers from Zustand

  // Load mechanics from local storage when the component mounts
  useEffect(() => {
    const savedMechanics = localStorage.getItem('mechanics');
    if (savedMechanics) {
      const parsedMechanics = JSON.parse(savedMechanics);
      if (Array.isArray(parsedMechanics) && parsedMechanics.every(m => m.name && m.surname)) {
        setMechanics(parsedMechanics); // Set mechanics in Zustand state
      }
    }
    fetchCustomers(); // Fetch customers from backend when component mounts
  }, [fetchCustomers, setMechanics]);

  // Save mechanics to local storage when they are updated
  useEffect(() => {
    localStorage.setItem('mechanics', JSON.stringify(mechanics));
  }, [mechanics]);

  // Function to handle report generation
  const handleGenerateReport = () => {
    if (!startDateTime || !endDateTime) {
      alert('Please select both start and end date and time');
      return;
    }

    const filtered = customers.filter((customer) => {
      const customerDate = dayjs(customer.timestamp);
      return customerDate.isAfter(dayjs(startDateTime)) && customerDate.isBefore(dayjs(endDateTime));
    });
    setFilteredCustomers(filtered);

    const income = filtered.reduce((sum, customer) => sum + parseFloat(customer.cost || 0), 0);
    setTotalIncome(income);

    const brandCountMap = {};
    filtered.forEach((customer) => {
      const brand = customer.brand || customer.car.split()[0] || 'Unknown';
      brandCountMap[brand] = (brandCountMap[brand] || 0) + 1;
    });
    setBrandCount(brandCountMap);
  };

  // Add mechanic function
  const handleAddMechanic = async () => {
    if (!name || !surname || !tel) {
      alert('Please provide valid mechanic details');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/add_mechanic', { name, surname, tel });
      const newMechanic = response.data.mechanic;

      if (newMechanic && newMechanic.name && newMechanic.surname) {
        addMechanic(newMechanic); // Update Zustand state
        setName(''); setSurname(''); setTel('');
        alert('Mechanic added successfully');
      } else {
        throw new Error('Invalid mechanic data returned from the server');
      }
    } catch (error) {
      console.error('Error adding mechanic:', error);
      alert('Failed to add mechanic');
    }
  };

  // Delete mechanic function
  const deleteMechanic = async (mechanicId) => {
    try {
      await axios.delete(`http://localhost:8000/api/delete_mechanic/${mechanicId}`);
      const updatedMechanics = mechanics.filter((mechanic) => mechanic.id !== mechanicId);
      setMechanics(updatedMechanics); // Update Zustand state
      alert('Mechanic deleted successfully');
    } catch (error) {
      console.error('Failed to delete mechanic:', error);
      alert('Failed to delete mechanic');
    }
  };

  return (
    <>
      <Head>
        <title>Customer Dashboard - Report</title>
      </Head>
      <Box className="tab-content active" sx={{ backgroundColor: '#355364', height: '93.1vh', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '30px' }}>
        {/* Left side (Inputs, Report Summary) */}
        <Box component="form" sx={{ width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '20px' }}>
          <TextField
            type="datetime-local"
            label="Start Date and Time"
            InputLabelProps={{ shrink: true }}
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            sx={{ marginBottom: '20px', backgroundColor: 'white' }}
            required
          />
          <TextField
            type="datetime-local"
            label="End Date and Time"
            InputLabelProps={{ shrink: true }}
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            sx={{ marginBottom: '20px', backgroundColor: 'white' }}
            required
          />
          <Button variant="contained" onClick={handleGenerateReport} sx={{ backgroundColor: '#182b3b', color: '#ffffff', marginBottom: '20px' }}>
            Generate Report
          </Button>

          <Typography variant="h4" sx={{ color: '#ffffff', marginBottom: '10px' }}>
            Total Cars: {filteredCustomers.length} cars
          </Typography>

          <Typography variant="h4" sx={{ color: '#ffffff', marginBottom: '20px' }}>
            Total Income: {totalIncome.toLocaleString()} $
          </Typography>

          {/* Car Brands Percentages */}
          <TableContainer component={Box} sx={{ width: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.2rem' }}>Brand</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.2rem' }}>Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(brandCount).length > 0 ? (
                  Object.entries(brandCount).map(([brand, count], index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: '#ffffff', fontSize: '1.1rem' }}>{brand}</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontSize: '1.1rem' }}>{((count / filteredCustomers.length) * 100).toFixed(2)}%</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} sx={{ color: '#ffffff', textAlign: 'center', fontStyle: 'italic' }}>No Data Available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Right side (Filtered Customer Table) */}
        <Box sx={{ width: '70%', paddingLeft: '20px' }}>
          <TableContainer component={Box} sx={{ width: '100%' }}>
            <Table sx={{ tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Customer Name</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Tel</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>License Plate</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Car</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Symptoms</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Cost</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Mechanic</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: '#ffffff' }}>
                        {customer.timestamp ? dayjs(customer.timestamp).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}
                      </TableCell>
                      <TableCell sx={{ color: '#ffffff' }}>{customer.customer_name}</TableCell>
                      <TableCell sx={{ color: '#ffffff' }}>{customer.tel}</TableCell>
                      <TableCell sx={{ color: '#ffffff' }}>{customer.license_plate || 'N/A'}</TableCell>
                      <TableCell sx={{ color: '#ffffff' }}>{`${customer.brand || customer.car} ${customer.model || ''}`}</TableCell>
                      <TableCell sx={{ color: '#ffffff' }}>{customer.symptoms}</TableCell>
                      <TableCell sx={{ color: '#ffffff' }}>{customer.cost}</TableCell>
                      <TableCell sx={{ color: '#ffffff' }}>{customer.mechanic}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ color: '#ffffff', textAlign: 'center', fontStyle: 'italic' }}>No Data Available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Drawer Button */}
      <DrawerButton onClick={() => setOpen(true)}>
        <Typography variant="h6" sx={{ color: '#ffffff' }}>▶</Typography>
      </DrawerButton>

      {/* Drawer Content */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: '250px', padding: '20px', backgroundColor: '#355364', height: '100%' }}>
          <Typography variant="h5" sx={{ color: '#ffffff', marginBottom: '20px' }}>Add Mechanic</Typography>

          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ marginBottom: '10px', backgroundColor: 'white' }}
          />
          <TextField
            label="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            fullWidth
            sx={{ marginBottom: '10px', backgroundColor: 'white' }}
          />
          <TextField
            label="Tel"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            fullWidth
            sx={{ marginBottom: '10px', backgroundColor: 'white' }}
          />
          <Button variant="contained" onClick={handleAddMechanic} sx={{ backgroundColor: '#182b3b', color: '#ffffff' }}>
            Add
          </Button>

          <Typography variant="h6" sx={{ color: '#ffffff', marginTop: '20px' }}>Mechanics</Typography>
          {mechanics.map((mechanic, index) => (
            <Box key={index} sx={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ color: '#ffffff' }}>{mechanic.name && mechanic.surname ? `${mechanic.name} ${mechanic.surname}` : 'Unnamed Mechanic'}</Typography>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#b30000', color: '#ffffff' }}
                onClick={() => deleteMechanic(mechanic.id)}
              >
                Delete
              </Button>
            </Box>
          ))}
        </Box>
      </Drawer>
    </>
  );
}
