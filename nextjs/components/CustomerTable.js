import React, { useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button } from '@mui/material';
import useBearStore from '@/store/useBearStore';
import { styled } from '@mui/material/styles';
import axios from 'axios';

// Styling for table cells and checkboxes
const StyledTableCell = styled(TableCell)({
  color: '#ffffff',
  fontSize: '1.1rem',
  textAlign: 'center',
  width: '10%',
});

const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  '&.Mui-checked': {
    color: '#00FF00',
  },
  '& .MuiSvgIcon-root': {
    border: '2px solid white',
    borderRadius: '4px',
  },
}));

export default function CustomerTable() {
  // Zustand store functions
  const customers = useBearStore((state) => state.customers);
  const fetchCustomers = useBearStore((state) => state.fetchCustomers);
  const deleteCustomer = useBearStore((state) => state.deleteCustomer);
  const toggleCustomerStatus = useBearStore((state) => state.toggleCustomerStatus);

  useEffect(() => {
    fetchCustomers(); // Fetch customer data when the component mounts
  }, [fetchCustomers]);

  // Function to handle deleting a customer from both the frontend and database
  const handleDelete = async (customerId, index) => {
    try {
      // Step 1: Log initial values to confirm the function is being called
      console.log(`Delete button clicked! Attempting to delete customer with ID: ${customerId} at index: ${index}`);
      
      // Step 2: Log the entire customer object to verify the structure
      console.log(`Customer object: `, customers[index]);

      // Step 3: Check if customerId is undefined
      if (customerId === undefined) {
        console.error(`Customer ID is undefined. This is likely an issue with the data structure.`);
        alert("Failed to delete: Customer ID is missing.");
        return;
      }

      // Step 4: Send a DELETE request to the backend to delete the customer from the database using main.id
      console.log(`Sending DELETE request to backend for Customer ID: ${customerId}`);
      await axios.delete(`http://localhost:8000/api/delete_customer/${customerId}`);

      // Step 5: Remove the customer from Zustand state using the index
      console.log(`Deleting customer from frontend state at index: ${index}`);
      deleteCustomer(index);
      
      // Step 6: Success message
      alert(`Customer with ID ${customerId} deleted successfully`);
    } catch (error) {
      // Step 7: Log any errors that occurred during the deletion process
      console.error('Failed to delete customer:', error);
      alert(`Failed to delete customer with ID: ${customerId}`);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <TableContainer component={Box} className="table-container" sx={{ width: '100%', padding: '35px' }}>
        <Table sx={{ tableLayout: 'fixed' }}> {/* Set tableLayout to fixed */}
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ textAlign: 'left', width: '3%' }}>Status</StyledTableCell>
              <StyledTableCell sx={{ textAlign: 'center', width: '5%' }}>Date</StyledTableCell>
              <StyledTableCell sx={{ textAlign: 'center', width: '8%' }}>Customer Name</StyledTableCell>
              <StyledTableCell sx={{ textAlign: 'center', width: '6%' }}>Tel</StyledTableCell>
              <StyledTableCell sx={{ textAlign: 'center', width: '10%' }}>License Plate</StyledTableCell>
              <StyledTableCell sx={{ textAlign: 'center', width: '5%' }}>Car</StyledTableCell>
              <StyledTableCell sx={{ textAlign: 'center', width: '5%' }}>Symptoms</StyledTableCell>
              <StyledTableCell sx={{ textAlign: 'center', width: '5%' }}>Cost</StyledTableCell>
              <StyledTableCell sx={{ textAlign: 'center', width: '5%' }}>Mechanic</StyledTableCell>
              <StyledTableCell sx={{ textAlign: 'center', width: '5%' }}>Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {customers.length > 0 ? (
    customers.map((customer, index) => {
      console.log(`Customer object at index ${index}: `, customer); // Log the customer object to inspect its structure

      return (
        <TableRow key={index}>
          <TableCell style={{ width: '10%' }}>
            <CustomCheckbox
              checked={customer.checked}
              onChange={() => toggleCustomerStatus(index)}
              sx={{ textAlign: 'center', width: '120%' ,color: 'white' }}
            />
          </TableCell>
          <TableCell style={{ color: '#ffffff', textAlign: 'center', width: '10%' }}>
            {customer.timestamp ? new Date(customer.timestamp).toLocaleString() : 'N/A'}
          </TableCell>
          <TableCell style={{ fontSize: '1.0rem', color: '#ffffff', textAlign: 'center', width: '10%' }}>{`${customer.name} ${customer.surname}`}</TableCell>
          <TableCell style={{ fontSize: '1.0rem', color: '#ffffff', textAlign: 'center', width: '10%' }}>{customer.tel}</TableCell>
          <TableCell style={{ fontSize: '1.0rem', color: '#ffffff', textAlign: 'center', width: '10%' }}>{customer.licensePlate}</TableCell>
          <TableCell style={{ fontSize: '1.0rem', color: '#ffffff', textAlign: 'center', width: '10%' }}>{`${customer.brand} ${customer.model}`}</TableCell>
          <TableCell style={{ fontSize: '1.0rem', color: '#ffffff', textAlign: 'center', width: '10%' }}>{customer.symptoms}</TableCell>
          <TableCell style={{ fontSize: '1.0rem', color: '#ffffff', textAlign: 'center', width: '10%' }}>{customer.cost}</TableCell>
          <TableCell style={{ fontSize: '1.0rem', color: '#ffffff', textAlign: 'center', width: '10%' }}>{customer.mechanic}</TableCell>
          <TableCell style={{ width: '10%' }}>
            <Button
              onClick={() => handleDelete(customer.id, index)} // Pass customer ID and index to handleDelete function
              variant="contained"
              sx={{ backgroundColor: '#182b3b', color: '#ffffff' }}
            >
              Delete
            </Button>
          </TableCell>
        </TableRow>
      );
    })
  ) : (
    <TableRow>
      <TableCell colSpan={10} style={{ color: '#ffffff', textAlign: 'center', fontStyle: 'italic' }}>
        No Data Available
      </TableCell>
    </TableRow>
  )}
</TableBody>

        </Table>
      </TableContainer>
    </Box>
  );
}
