import { create } from 'zustand';
import axios from 'axios';

const useBearStore = create((set) => ({
  appName: 'Customer Dashboard',
  carCount: 0,
  customers: [],

  setAppName: (appName) => set({ appName }),

  // Function to fetch customers from the database and update state
  fetchCustomers: async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/get_customers');
      console.log("Fetched customers from backend:", response.data); // Log the response data to verify structure

      // Ensure that each customer has an id field
      const customers = response.data.map(customer => ({
        ...customer,
        id: customer.id // Make sure the ID is correctly set from the backend
      }));
      
      set({ customers, carCount: customers.filter((c) => !c.checked).length });
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  },

  addCustomer: (customer) => set((state) => {
    const newCustomers = [...state.customers, { ...customer, id: customer.id || state.customers.length + 1, checked: false }];
    return { customers: newCustomers, carCount: newCustomers.filter((c) => !c.checked).length };
  }),

  deleteCustomer: (index) => set((state) => {
    const newCustomers = state.customers.filter((_, i) => i !== index);
    return { customers: newCustomers, carCount: newCustomers.filter((c) => !c.checked).length };
  }),

  toggleCustomerStatus: (index) => set((state) => {
    const newCustomers = state.customers.map((customer, i) =>
      i === index ? { ...customer, checked: !customer.checked } : customer
    );
    return { customers: newCustomers, carCount: newCustomers.filter((c) => !c.checked).length };
  }),

  setCustomers: (newCustomers) => set(() => ({
    customers: newCustomers,
    carCount: newCustomers.filter((c) => !c.checked).length,
  })),
}));

export default useBearStore;
