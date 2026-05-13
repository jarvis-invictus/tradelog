import { useCurrencyStore } from '@/store/currency'

// Exchange rate API service
export class ExchangeRateService {
  private static readonly API_URL = 'https://api.exchangerate-api.com/v4/latest/USD'
  private static readonly CACHE_KEY = 'exchange-rates'
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

  static async fetchRates(): Promise<{ USD_INR: number; lastUpdated: number }> {
    try {
      // Check cache first
      const cached = this.getCachedRates()
      if (cached && Date.now() - cached.lastUpdated < this.CACHE_DURATION) {
        return cached
      }

      // Fetch from API
      const response = await fetch(this.API_URL)
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates')
      }

      const data = await response.json()
      const usdToInr = data.rates.INR

      if (!usdToInr) {
        throw new Error('INR rate not found in response')
      }

      const rates = {
        USD_INR: usdToInr,
        lastUpdated: Date.now()
      }

      // Cache the rates
      this.cacheRates(rates)
      
      return rates
    } catch (error) {
      console.error('Error fetching exchange rates:', error)
      
      // Return cached rates if available, even if expired
      const cached = this.getCachedRates()
      if (cached) {
        return cached
      }
      
      // Return default rate as fallback
      return {
        USD_INR: 83.50,
        lastUpdated: Date.now()
      }
    }
  }

  private static getCachedRates(): { USD_INR: number; lastUpdated: number } | null {
    if (typeof window === 'undefined') return null
    
    try {
      const cached = localStorage.getItem(this.CACHE_KEY)
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  }

  private static cacheRates(rates: { USD_INR: number; lastUpdated: number }): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(rates))
    } catch (error) {
      console.error('Error caching exchange rates:', error)
    }
  }

  static async updateStoreRates(): Promise<void> {
    const rates = await this.fetchRates()
    const { setExchangeRate } = useCurrencyStore.getState()
    setExchangeRate(rates.USD_INR)
  }
}

// Hook for automatic exchange rate updates
export function useExchangeRates() {
  const { exchangeRate, setExchangeRate } = useCurrencyStore()

  const updateRates = async () => {
    try {
      const rates = await ExchangeRateService.fetchRates()
      setExchangeRate(rates.USD_INR)
      return rates
    } catch (error) {
      console.error('Failed to update exchange rates:', error)
      return null
    }
  }

  return {
    currentRate: exchangeRate,
    updateRates,
    isStale: (lastUpdated: number) => Date.now() - lastUpdated > ExchangeRateService['CACHE_DURATION']
  }
}
