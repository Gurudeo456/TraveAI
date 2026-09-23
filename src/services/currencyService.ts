import { Currency, CurrencyRate } from '../types/travel';

export const CURRENCY_RATES: Record<Currency, CurrencyRate> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    rateToINR: 1,
    label: 'INR ₹',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    rateToINR: 86.8, // 1 USD = 86.8 INR
    label: 'USD $',
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    rateToINR: 23.63, // 1 AED = 23.63 INR
    label: 'AED د.إ',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    rateToINR: 91.5, // 1 EUR = 91.5 INR
    label: 'EUR €',
  },
};

export function convertFromINR(amountInINR: number, targetCurrency: Currency): number {
  if (targetCurrency === 'INR') return amountInINR;
  const rate = CURRENCY_RATES[targetCurrency]?.rateToINR || 1;
  return Math.round(amountInINR / rate);
}

export function formatCurrency(amountInINR: number, currency: Currency): string {
  const converted = convertFromINR(amountInINR, currency);
  const symbol = CURRENCY_RATES[currency]?.symbol || '₹';

  if (currency === 'INR') {
    return `${symbol}${converted.toLocaleString('en-IN')}`;
  } else if (currency === 'AED') {
    return `${symbol} ${converted.toLocaleString('en-US')}`;
  } else {
    return `${symbol}${converted.toLocaleString('en-US')}`;
  }
}
