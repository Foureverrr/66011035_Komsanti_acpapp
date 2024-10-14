import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import useBearStore from '@/store/useBearStore';
import dayjs from 'dayjs';

export default function Report() {
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('filteredCustomers');
      return storedData ? JSON.parse(storedData) : [];
    }
    return [];
  }); // For right-side table
  const [brandCount, setBrandCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('brandCount');
      return storedData ? JSON.parse(storedData) : {};
    }
    return {};
  });
  const [totalIncome, setTotalIncome] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('totalIncome');
      return storedData ? JSON.parse(storedData) : 0;
    }
    return 0;
  });

  const fetchCustomers = useBearStore((state) => state.fetchCustomers);
  const customers = useBearStore((state) => state.customers);

  useEffect(() => {
    // Fetch customers initially to have data for filtering
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    // Store filtered customers, brand count, and total income in localStorage
    if (filteredCustomers.length > 0) {
      localStorage.setItem('filteredCustomers', JSON.stringify(filteredCustomers));
      localStorage.setItem('brandCount', JSON.stringify(brandCount));
      localStorage.setItem('totalIncome', JSON.stringify(totalIncome));
    }
  }, [filteredCustomers, brandCount, totalIncome]);

  // Function to handle report generation
  const handleGenerateReport = () => {
    if (!startDateTime || !endDateTime) {
      alert('Please select both start and end date and time');
      return;
    }

    console.log('Generating report with date and time:', { startDateTime, endDateTime });

    // Filter the customer data based on the date and time range
    const filtered = customers.filter((customer) => {
      const customerDate = dayjs(customer.timestamp);
      return customerDate.isAfter(dayjs(startDateTime)) && customerDate.isBefore(dayjs(endDateTime));
    });
    setFilteredCustomers(filtered);

    // Calculate total income
    const income = filtered.reduce((sum, customer) => sum + parseFloat(customer.cost || 0), 0);
    setTotalIncome(income);

    // Calculate car brand count and percentage
    const brandCountMap = {};
    filtered.forEach((customer) => {
      const brand = customer.brand || customer.car.split()[0] || 'Unknown';
      brandCountMap[brand] = (brandCountMap[brand] || 0) + 1;
    });
    setBrandCount(brandCountMap);
  };

  return (
    <>
      <Head>
        <title>Customer Dashboard - Report</title>
      </Head>
      <Box className="tab-content active" sx={{ backgroundColor: '#355364', height: '93.1vh', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '30px' }}>
        {/* Left side (Inputs, Report Summary) */}
        <Box component="form" sx={{ width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '20px' }}>
          {/* Date and Time Inputs */}
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
          {/* Generate Report Button */}
          <Button variant="contained" onClick={handleGenerateReport} sx={{ backgroundColor: '#182b3b', color: '#ffffff', marginBottom: '20px' }}>
            Generate Report
          </Button>

          {/* Total Cars and Income */}
          <Typography variant="h4" sx={{ color: '#ffffff', marginBottom: '10px' }}>
            Total Cars: {filteredCustomers.length} cars
          </Typography>

          <Typography variant="h4" sx={{ color: '#ffffff', marginBottom: '20px' }}>
            Total Income: {totalIncome.toLocaleString()} $
          </Typography>

          {/* Car Brands Percentages */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
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
    </>
  );
}