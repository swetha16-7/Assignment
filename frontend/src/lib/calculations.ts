import { LineItem } from './types';

export function calculateTotals(
  items: LineItem[],
  discountPct: number = 0,
  taxPct: number = 0
) {
  let subtotal = 0;
  const processedItems = items.map((item) => {
    const qty = Math.max(0, Number(item.quantity) || 0);
    const unitPrice = Math.max(0, Number(item.unit_price) || 0);
    const total = Math.round(qty * unitPrice * 100) / 100;
    subtotal += total;
    return {
      ...item,
      quantity: qty,
      unit_price: unitPrice,
      total,
    };
  });

  subtotal = Math.round(subtotal * 100) / 100;

  const validDiscPct = Math.min(100, Math.max(0, Number(discountPct) || 0));
  const discountAmount = Math.round(subtotal * (validDiscPct / 100) * 100) / 100;

  const taxableAmount = Math.max(0, subtotal - discountAmount);

  const validTaxPct = Math.max(0, Number(taxPct) || 0);
  const taxAmount = Math.round(taxableAmount * (validTaxPct / 100) * 100) / 100;

  const grandTotal = Math.round((taxableAmount + taxAmount) * 100) / 100;

  return {
    items: processedItems,
    subtotal,
    discount_percentage: validDiscPct,
    discount_amount: discountAmount,
    tax_percentage: validTaxPct,
    tax_amount: taxAmount,
    grand_total: grandTotal,
  };
}

export function formatCurrency(amount: number | undefined, symbol: string = '$'): string {
  if (amount === undefined || isNaN(amount)) return `${symbol}0.00`;
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export const CURRENCY_OPTIONS = [
  { code: 'USD', symbol: '$', label: 'USD ($) - US Dollar' },
  { code: 'EUR', symbol: '€', label: 'EUR (€) - Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP (£) - British Pound' },
  { code: 'INR', symbol: '₹', label: 'INR (₹) - Indian Rupee' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD ($) - Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'AUD ($) - Australian Dollar' },
  { code: 'SGD', symbol: 'S$', label: 'SGD ($) - Singapore Dollar' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥) - Japanese Yen' },
];
