import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Currency = 'USD' | 'INR'

interface CurrencyState {
  currency: Currency
  exchangeRate: number // USD to INR rate
  setCurrency: (currency: Currency) => void
  setExchangeRate: (rate: number) => void
  convertAmount: (amount: number, fromCurrency?: Currency) => number
  formatAmount: (amount: number, currency?: Currency) => string
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: 'USD', // Default to USD for forex trading
      exchangeRate: 83.50, // Default USD to INR rate (will be updated from API)

      setCurrency: (currency) => set({ currency }),

      setExchangeRate: (exchangeRate) => set({ exchangeRate }),

      convertAmount: (amount, fromCurrency = 'USD') => {
        const state = get()
        if (fromCurrency === state.currency) return amount
        
        // Convert from USD to INR
        if (fromCurrency === 'USD' && state.currency === 'INR') {
          return amount * state.exchangeRate
        }
        
        // Convert from INR to USD
        if (fromCurrency === 'INR' && state.currency === 'USD') {
          return amount / state.exchangeRate
        }
        
        return amount
      },

      formatAmount: (amount, currency) => {
        const state = get()
        const targetCurrency = currency || state.currency
        const convertedAmount = currency === 'USD' ? amount : state.convertAmount(amount)
        
        if (targetCurrency === 'INR') {
          // Indian number formatting: ₹1,00,000
          return `₹${Math.abs(convertedAmount).toLocaleString('en-IN')}`
        } else {
          // USD formatting: $100,000
          return `$${Math.abs(convertedAmount).toLocaleString('en-US')}`
        }
      },
    }),
    {
      name: 'currency-storage',
    }
  )
)
