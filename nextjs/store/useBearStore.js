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
      const customers = response.data;
      set({ customers, carCount: customers.filter((c) => !c.checked).length });
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  },

  addCustomer: (customer) => set((state) => {
    const newCustomers = [...state.customers, { ...customer, checked: false }];
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
}));

export default useBearStore;
