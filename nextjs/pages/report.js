// pages/report.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import useBearStore from '@/store/useBearStore';
import axios from 'axios';
import dayjs from 'dayjs';

export default function Report() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState({ carBrands: [], totalIncome: 0 });

  // Function to handle report generation
  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    console.log('Generating report with dates:', { startDate, endDate });

    try {
      const response = await axios.get('http://localhost:8000/api/get_report', {
        params: { start_date: startDate, end_date: endDate },
      });
      console.log('Report data received:', response.data);
      setReportData(response.data);
    } catch (error) {
      console.error('Failed to generate report:', error.response ? error.response.data : error.message);
      alert(`Failed to generate report: ${error.response ? error.response.data.detail : error.message}`);
    }
  };

  return (
    <>
      <Head>
        <title>Customer Dashboard - Report</title>
      </Head>
      <Box className="tab-content" sx={{ backgroundColor: '#355364', height: '93.1vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
        {/* Date Range Form and Total Income */}
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
          <TextField
            type="date"
            label="Start Date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            sx={{ marginBottom: '20px', backgroundColor: 'white' }}
          />
          <TextField
            type="date"
            label="End Date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            sx={{ marginBottom: '20px', backgroundColor: 'white' }}
          />
          <Button variant="contained" onClick={handleGenerateReport} sx={{ backgroundColor: '#182b3b', color: '#ffffff', marginBottom: '20px' }}>
            Generate Report
          </Button>
          {/* Total Income and Total Cars Display */}
          <Typography variant="h4" sx={{ color: '#ffffff', marginBottom: '10px' }}>
            Total Income: {reportData.totalIncome.toLocaleString()} $
          </Typography>
          <Typography variant="h4" sx={{ color: '#ffffff', marginBottom: '20px' }}>
            Total Cars: {reportData.carBrands.reduce((acc, brand) => acc + (brand.count || 0), 0)} cars
          </Typography>
        </Box>

        {/* Car Brands Table */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '80%' }}>
          <TableContainer component={Box} sx={{ width: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.2rem' }}>Brand</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.2rem' }}>Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.carBrands.length > 0 ? (
                  reportData.carBrands.map((brand, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: '#ffffff', fontSize: '1.1rem' }}>{brand.name}</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontSize: '1.1rem' }}>{brand.percentage}%</TableCell>
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
    </>
  );
}