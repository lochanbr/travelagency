export interface TripPlan {
  overview: string
  budgetBreakdown: {
    flights: number
    accommodation: number
    food: number
    activities: number
    transport: number
    contingency: number
  }
  itinerary: Array<{
    day: number
    theme: string
    morning: string
    afternoon: string
    evening: string
    highlight: string
  }>
  foodRecommendations: Array<{
    name: string
    type: string
    description: string
    priceRange: string
  }>
  topAttractions: Array<{
    name: string
    category: string
    description: string
    bestTime: string
    tip: string
  }>
  packingList: {
    essentials: string[]
    clothing: string[]
    electronics: string[]
    healthSafety: string[]
    activitySpecific: string[]
  }
  quickTips: string[]
}

export interface TripFormData {
  destination: string
  days: number
  budget: number
  currency: string
  interests: string[]
}

export const CURRENCIES = [
  // Major World Currencies
  { value: 'USD', label: 'USD ($) - US Dollar' },
  { value: 'EUR', label: 'EUR (€) - Euro' },
  { value: 'GBP', label: 'GBP (£) - British Pound' },
  { value: 'JPY', label: 'JPY (¥) - Japanese Yen' },
  { value: 'CNY', label: 'CNY (¥) - Chinese Yuan' },
  { value: 'CHF', label: 'CHF (Fr) - Swiss Franc' },
  
  // North America
  { value: 'CAD', label: 'CAD (C$) - Canadian Dollar' },
  { value: 'MXN', label: 'MXN ($) - Mexican Peso' },
  
  // South America
  { value: 'BRL', label: 'BRL (R$) - Brazilian Real' },
  { value: 'ARS', label: 'ARS ($) - Argentine Peso' },
  { value: 'CLP', label: 'CLP ($) - Chilean Peso' },
  { value: 'COP', label: 'COP ($) - Colombian Peso' },
  { value: 'PEN', label: 'PEN (S/) - Peruvian Sol' },
  
  // Europe
  { value: 'SEK', label: 'SEK (kr) - Swedish Krona' },
  { value: 'NOK', label: 'NOK (kr) - Norwegian Krone' },
  { value: 'DKK', label: 'DKK (kr) - Danish Krone' },
  { value: 'PLN', label: 'PLN (zł) - Polish Zloty' },
  { value: 'CZK', label: 'CZK (Kč) - Czech Koruna' },
  { value: 'HUF', label: 'HUF (Ft) - Hungarian Forint' },
  { value: 'RON', label: 'RON (lei) - Romanian Leu' },
  { value: 'BGN', label: 'BGN (лв) - Bulgarian Lev' },
  { value: 'HRK', label: 'HRK (kn) - Croatian Kuna' },
  { value: 'RUB', label: 'RUB (₽) - Russian Ruble' },
  { value: 'UAH', label: 'UAH (₴) - Ukrainian Hryvnia' },
  { value: 'TRY', label: 'TRY (₺) - Turkish Lira' },
  
  // Asia Pacific
  { value: 'INR', label: 'INR (₹) - Indian Rupee' },
  { value: 'AUD', label: 'AUD (A$) - Australian Dollar' },
  { value: 'NZD', label: 'NZD (NZ$) - New Zealand Dollar' },
  { value: 'KRW', label: 'KRW (₩) - South Korean Won' },
  { value: 'SGD', label: 'SGD (S$) - Singapore Dollar' },
  { value: 'HKD', label: 'HKD (HK$) - Hong Kong Dollar' },
  { value: 'TWD', label: 'TWD (NT$) - Taiwan Dollar' },
  { value: 'THB', label: 'THB (฿) - Thai Baht' },
  { value: 'MYR', label: 'MYR (RM) - Malaysian Ringgit' },
  { value: 'IDR', label: 'IDR (Rp) - Indonesian Rupiah' },
  { value: 'PHP', label: 'PHP (₱) - Philippine Peso' },
  { value: 'VND', label: 'VND (₫) - Vietnamese Dong' },
  { value: 'PKR', label: 'PKR (₨) - Pakistani Rupee' },
  { value: 'BDT', label: 'BDT (৳) - Bangladeshi Taka' },
  { value: 'LKR', label: 'LKR (Rs) - Sri Lankan Rupee' },
  { value: 'NPR', label: 'NPR (रू) - Nepalese Rupee' },
  
  // Middle East
  { value: 'AED', label: 'AED (د.إ) - UAE Dirham' },
  { value: 'SAR', label: 'SAR (﷼) - Saudi Riyal' },
  { value: 'QAR', label: 'QAR (﷼) - Qatari Riyal' },
  { value: 'KWD', label: 'KWD (د.ك) - Kuwaiti Dinar' },
  { value: 'BHD', label: 'BHD (د.ب) - Bahraini Dinar' },
  { value: 'OMR', label: 'OMR (﷼) - Omani Rial' },
  { value: 'JOD', label: 'JOD (د.ا) - Jordanian Dinar' },
  { value: 'ILS', label: 'ILS (₪) - Israeli Shekel' },
  { value: 'EGP', label: 'EGP (£) - Egyptian Pound' },
  
  // Africa
  { value: 'ZAR', label: 'ZAR (R) - South African Rand' },
  { value: 'NGN', label: 'NGN (₦) - Nigerian Naira' },
  { value: 'KES', label: 'KES (KSh) - Kenyan Shilling' },
  { value: 'GHS', label: 'GHS (₵) - Ghanaian Cedi' },
  { value: 'MAD', label: 'MAD (د.م.) - Moroccan Dirham' },
  { value: 'TND', label: 'TND (د.ت) - Tunisian Dinar' },
  
  // Caribbean
  { value: 'JMD', label: 'JMD (J$) - Jamaican Dollar' },
  { value: 'TTD', label: 'TTD (TT$) - Trinidad Dollar' },
  { value: 'BBD', label: 'BBD (Bds$) - Barbadian Dollar' },
  
  // Crypto
  { value: 'BTC', label: 'BTC (₿) - Bitcoin' },
]

export const INTERESTS = [
  { id: 'adventure', label: 'Adventure', emoji: '🧗' },
  { id: 'food', label: 'Food', emoji: '🍜' },
  { id: 'culture', label: 'Culture', emoji: '🏛️' },
  { id: 'relaxation', label: 'Relaxation', emoji: '🧘' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
]
