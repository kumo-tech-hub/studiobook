import { create } from 'zustand'

export const useBookingStore = create((set) => ({
  selectedPackage: null,
  selectedAddOns: [],
  selectedDate: null,
  selectedSlot: null,
  customerInfo: {},

  setPackage: (pkg) => set({ selectedPackage: pkg }),
  setAddOns: (addOns) => set({ selectedAddOns: addOns }),
  setDate: (date) => set({ selectedDate: date }),
  setSlot: (slot) => set({ selectedSlot: slot }),
  setCustomerInfo: (info) => set({ customerInfo: info }),
  resetBooking: () => set({
    selectedPackage: null,
    selectedAddOns: [],
    selectedDate: null,
    selectedSlot: null,
    customerInfo: {},
  }),
}))