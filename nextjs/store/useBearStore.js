// store/useBearStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useBearStore = create(
  persist(
    (set) => ({
      appName: 'Customer Dashboard',
      carCount: 0,
      customers: [],
      mechanics: [], // State to store the mechanics list

      setAppName: (appName) => set({ appName }),

      // Function to fetch customers from the database and update state
      fetchCustomers: async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/get_customers');
          console.log("Fetched customers from backend:", response.data);

          // Update Zustand state with fetched data
          set({ customers: response.data, carCount: response.data.filter((c) => !c.checked).length });
        } catch (error) {
          console.error('Failed to fetch customers:', error);
        }
      },

      // Add customer to the Zustand state
      addCustomer: (customer) =>
        set((state) => {
          const newCustomers = [...state.customers, { ...customer, id: customer.id || state.customers.length + 1, checked: false }];
          return { customers: newCustomers, carCount: newCustomers.filter((c) => !c.checked).length };
        }),

      // Delete customer from the Zustand state
      deleteCustomer: (index) =>
        set((state) => {
          const newCustomers = state.customers.filter((_, i) => i !== index);
          return { customers: newCustomers, carCount: newCustomers.filter((c) => !c.checked).length };
        }),

      // Toggle customer status (checked or not)
      toggleCustomerStatus: (index) =>
        set((state) => {
          const newCustomers = state.customers.map((customer, i) =>
            i === index ? { ...customer, checked: !customer.checked } : customer
          );
          return { customers: newCustomers, carCount: newCustomers.filter((c) => !c.checked).length };
        }),

      // Set new customer list
      setCustomers: (newCustomers) =>
        set(() => ({
          customers: newCustomers,
          carCount: newCustomers.filter((c) => !c.checked).length,
        })),

      // Add a mechanic to the mechanics list
      addMechanic: (mechanic) => set((state) => ({
        mechanics: [...state.mechanics, mechanic],
      })),

      // Set mechanics (for loading from backend or local storage)
      setMechanics: (mechanics) => set({ mechanics }),
    }),
    {
      name: 'customer-store', // Name of the storage item
      getStorage: () => localStorage, // Use localStorage as the storage mechanism
    }
  )
);

export default useBearStore;
