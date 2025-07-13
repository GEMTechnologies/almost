import fetch from 'node-fetch';

// Real-time exchange rates and geo-location currency service
export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Rate from USD
  flag: string;
}

export interface GeoLocation {
  country: string;
  countryCode: string;
  currency: string;
  timezone: string;
  ip: string;
}

// Major currencies with real-time conversion support
export const supportedCurrencies: Record<string, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0, flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.85, flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.73, flag: '🇬🇧' },
  KES: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', rate: 129.5, flag: '🇰🇪' },
  UGX: { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling', rate: 3720, flag: '🇺🇬' },
  TZS: { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling', rate: 2340, flag: '🇹🇿' },
  RWF: { code: 'RWF', symbol: 'RWF', name: 'Rwandan Franc', rate: 1085, flag: '🇷🇼' },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', rate: 465, flag: '🇳🇬' },
  GHS: { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', rate: 6.2, flag: '🇬🇭' },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', rate: 18.5, flag: '🇿🇦' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.35, flag: '🇨🇦' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.52, flag: '🇦🇺' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.2, flag: '🇮🇳' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 149.8, flag: '🇯🇵' }
};

// Country to currency mapping
export const countryCurrencyMap: Record<string, string> = {
  'US': 'USD', 'CA': 'CAD', 'GB': 'GBP', 'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR',
  'KE': 'KES', 'UG': 'UGX', 'TZ': 'TZS', 'RW': 'RWF', 'NG': 'NGN', 'GH': 'GHS', 'ZA': 'ZAR',
  'IN': 'INR', 'JP': 'JPY', 'AU': 'AUD', 'NZ': 'AUD', 'SG': 'USD', 'HK': 'USD'
};

export class CurrencyService {
  private static instance: CurrencyService;
  private exchangeRates: Record<string, number> = {};
  private lastUpdate: Date | null = null;
  private readonly UPDATE_INTERVAL = 3600000; // 1 hour in milliseconds

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  async getGeoLocation(ip: string): Promise<GeoLocation | null> {
    try {
      // Use ipapi.co for free geo-location (up to 1000 requests/day)
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json() as any;

      if (data.error) {
        console.log('Geo-location API error:', data.reason);
        return null;
      }

      return {
        country: data.country_name,
        countryCode: data.country_code,
        currency: data.currency || this.getCurrencyByCountry(data.country_code),
        timezone: data.timezone,
        ip: ip
      };
    } catch (error) {
      console.error('Geo-location detection failed:', error);
      return null;
    }
  }

  getCurrencyByCountry(countryCode: string): string {
    return countryCurrencyMap[countryCode] || 'USD';
  }

  async updateExchangeRates(): Promise<void> {
    try {
      // Use exchangerate-api.com for free real-time rates (1500 requests/month free)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json() as any;

      if (data.rates) {
        this.exchangeRates = data.rates;
        this.lastUpdate = new Date();
        console.log('Exchange rates updated successfully');
      }
    } catch (error) {
      console.error('Failed to update exchange rates:', error);
      // Use fallback rates from supportedCurrencies
      this.exchangeRates = Object.fromEntries(
        Object.entries(supportedCurrencies).map(([code, info]) => [code, info.rate])
      );
    }
  }

  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    // Update rates if needed
    if (!this.lastUpdate || Date.now() - this.lastUpdate.getTime() > this.UPDATE_INTERVAL) {
      await this.updateExchangeRates();
    }

    if (fromCurrency === toCurrency) return 1;

    const fromRate = this.exchangeRates[fromCurrency] || supportedCurrencies[fromCurrency]?.rate || 1;
    const toRate = this.exchangeRates[toCurrency] || supportedCurrencies[toCurrency]?.rate || 1;

    // Convert from USD base
    if (fromCurrency === 'USD') {
      return toRate;
    } else if (toCurrency === 'USD') {
      return 1 / fromRate;
    } else {
      // Convert via USD
      return toRate / fromRate;
    }
  }

  convertPrice(amountUSD: number, targetCurrency: string): { amount: number; formatted: string } {
    const currency = supportedCurrencies[targetCurrency];
    if (!currency) {
      return { amount: amountUSD, formatted: `$${amountUSD.toFixed(2)}` };
    }

    const convertedAmount = amountUSD * currency.rate;
    
    // Format based on currency
    let formatted: string;
    if (targetCurrency === 'JPY' || targetCurrency === 'KRW') {
      // No decimals for Yen/Won
      formatted = `${currency.symbol}${Math.round(convertedAmount).toLocaleString()}`;
    } else if (['KES', 'UGX', 'TZS', 'RWF', 'NGN'].includes(targetCurrency)) {
      // African currencies - round to nearest whole number
      formatted = `${currency.symbol} ${Math.round(convertedAmount).toLocaleString()}`;
    } else {
      // Western currencies with decimals
      formatted = `${currency.symbol}${convertedAmount.toFixed(2)}`;
    }

    return { amount: convertedAmount, formatted };
  }

  getSupportedCurrencies(): CurrencyInfo[] {
    return Object.values(supportedCurrencies);
  }

  getCurrencyInfo(code: string): CurrencyInfo | null {
    return supportedCurrencies[code] || null;
  }

  // Get user's preferred currency based on geo-location
  async getPreferredCurrency(ip?: string, countryCode?: string): Promise<string> {
    if (countryCode) {
      return this.getCurrencyByCountry(countryCode);
    }

    if (ip) {
      const geoData = await this.getGeoLocation(ip);
      if (geoData) {
        return geoData.currency;
      }
    }

    return 'USD'; // Default fallback
  }
}

export const currencyService = CurrencyService.getInstance();