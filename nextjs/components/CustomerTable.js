import React, { useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button } from '@mui/material';
import useBearStore from '@/store/useBearStore';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)({
  color: '#ffffff',
  fontSize: '1.1rem',
  textAlign: 'center',
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
  const customers = useBearStore((state) => state.customers);
  const fetchCustomers = useBearStore((state) => state.fetchCustomers);
  const deleteCustomer = useBearStore((state) => state.deleteCustomer);
  const toggleCustomerStatus = useBearStore((state) => state.toggleCustomerStatus);

  useEffect(() => {
    fetchCustomers(); // Fetch customer data when the component mounts
  }, [fetchCustomers]);

  return (
    <TableContainer component={Box} className="table-container" sx={{ width: '100%', padding: '35px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Status</StyledTableCell>
            <StyledTableCell>Date</StyledTableCell> {/* Add Date column */}
            <StyledTableCell>Customer Name</StyledTableCell>
            <StyledTableCell>Tel</StyledTableCell>
            <StyledTableCell>License Plate</StyledTableCell>
            <StyledTableCell>Car</StyledTableCell>
            <StyledTableCell>Symptoms</StyledTableCell>
            <StyledTableCell>Cost</StyledTableCell>
            <StyledTableCell>Mechanic</StyledTableCell>
            <StyledTableCell>Delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer, index) => (
            <TableRow key={index}>
              <TableCell>
                <CustomCheckbox
                  checked={customer.checked}
                  onChange={() => toggleCustomerStatus(index)}
                  sx={{ color: 'white' }}
                />
              </TableCell>
              <TableCell style={{ color: '#ffffff', textAlign: 'center' }}>{customer.timestamp ? new Date(customer.timestamp).toLocaleString() : 'N/A'}</TableCell>
              <TableCell style={{ color: '#ffffff', textAlign: 'center' }}>{`${customer.name} ${customer.surname}`}</TableCell>
              <TableCell style={{ color: '#ffffff', textAlign: 'center' }}>{customer.tel}</TableCell>
              <TableCell style={{ color: '#ffffff', textAlign: 'center' }}>{customer.licensePlate}</TableCell>
              <TableCell style={{ color: '#ffffff', textAlign: 'center' }}>{`${customer.brand} ${customer.model}`}</TableCell>
              <TableCell style={{ color: '#ffffff', textAlign: 'center' }}>{customer.symptoms}</TableCell>
              <TableCell style={{ color: '#ffffff', textAlign: 'center' }}>{customer.cost}</TableCell>
              <TableCell style={{ color: '#ffffff', textAlign: 'center' }}>{customer.mechanic}</TableCell>
              <TableCell>
                <Button onClick={() => deleteCustomer(index)} variant="contained" sx={{ backgroundColor: '#182b3b', color: '#ffffff' }}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
