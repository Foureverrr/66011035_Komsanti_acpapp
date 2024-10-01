// index.js

import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import useBearStore from '@/store/useBearStore';
import Head from 'next/head';
import dayjs from 'dayjs'; // To handle date formatting

// Utility function to calculate the percentage
const calculatePercentage = (value, max) => {
  return Math.min((value / max) * 100, 100);
};

export default function Home() {
  const customers = useBearStore((state) => state.customers); // Zustand state for main table data
  const fetchCustomers = useBearStore((state) => state.fetchCustomers); // Zustand function to fetch data from main table

  const [totalIncome, setTotalIncome] = useState(0);
  const [availableMechanics, setAvailableMechanics] = useState(4); // Maximum number of mechanics
  const [fixingCars, setFixingCars] = useState(0);
  const [totalCars, setTotalCars] = useState(0); // State to track total cars

  useEffect(() => {
    // Fetch customer data from the main table when the component mounts
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    // Calculate the total income and the number of fixing cars based on the fetched main table data
    if (customers && customers.length > 0) {
      const income = customers.reduce((sum, customer) => sum + parseFloat(customer.cost || 0), 0);
      setTotalIncome(income);

      const fixingCarCount = customers.filter((customer) => !customer.checked).length;
      setFixingCars(fixingCarCount);

      // Total cars are simply the length of the customer list from the main table
      setTotalCars(customers.length);

      // Mechanic availability is calculated based on whether mechanics are assigned (checked status)
      const mechanicAvailability = 4 - fixingCarCount;
      setAvailableMechanics(mechanicAvailability);
    }
  }, [customers]);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Box sx={{ display: 'flex', flexDirection: 'row', backgroundColor: '#355364', height: '93.1vh', padding: '50px' }}>
        {/* Graphs Container */}
        <Box sx={{ width: '35%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {/* Fixing Car Graph */}
          <Box sx={{ textAlign: 'center', marginBottom: '30px' }}> {/* Increased marginBottom for more spacing */}
            <Typography variant="h4" sx={{ color: '#ffffff', marginBottom: '20px' }}> {/* Increased marginBottom for title spacing */}
              Fixing Car
            </Typography>
            <Box position="relative" display="inline-flex">
              <CircularProgress
                variant="determinate"
                value={calculatePercentage(fixingCars, 10)}
                size={150} // Maintained the original size
                thickness={5} // Maintained the original thickness
                sx={{
                  color: fixingCars > 10 ? 'red' : 'lightblue', // Turn red if more than 10 cars
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h4" component="div" color="white"> {/* Maintained font size */}
                  {fixingCars > 10 ? `${fixingCars}/10` : `${fixingCars}/10`}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Available Mechanics Graph */}
          <Box sx={{ textAlign: 'center', marginTop: '40px' }}> {/* Increased marginTop to create more space between graphs */}
            <Typography variant="h4" sx={{ color: '#ffffff', marginBottom: '20px' }}> {/* Increased marginBottom for title spacing */}
              Available Mechanics
            </Typography>
            <Box position="relative" display="inline-flex">
              <CircularProgress
                variant="determinate"
                value={calculatePercentage(availableMechanics, 4)}
                size={150} // Maintained the original size
                thickness={5} // Maintained the original thickness
                sx={{
                  color: 'lightblue',
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h4" component="div" color="white"> {/* Maintained font size */}
                  {`${availableMechanics}/4`}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Date, Total Cars, and Total Income Container */}
        <Box
          sx={{
            width: '65%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          {/* Date Display */}
          <Typography variant="h4" sx={{ color: '#ffffff', marginBottom: '20px' }}>
            {dayjs().format('dddd, D MMMM YYYY')}
          </Typography>

          {/* Total Cars */}
          <Typography variant="h1" sx={{ color: '#ffffff', marginBottom: '10px' }}>
            {totalCars}
          </Typography>
          <Typography variant="h5" sx={{ color: '#ffffff', marginBottom: '40px' }}>
            Total cars
          </Typography>

          {/* Total Income */}
          <Typography variant="h1" sx={{ color: '#ffffff', marginBottom: '10px' }}>
            {totalIncome.toLocaleString()} $
          </Typography>
          <Typography variant="h5" sx={{ color: '#ffffff' }}>
            Total income
          </Typography>
        </Box>
      </Box>
    </>
  );
}

// This code can connect with database and show basic result in dashboard


