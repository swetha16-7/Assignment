import React from 'react';
import { ProposalFormData, LineItem } from '@/lib/types';
import { DollarSign, Plus, Trash2, Percent, Calculator } from 'lucide-react';
import { calculateTotals, formatCurrency, CURRENCY_OPTIONS } from '@/lib/calculations';

interface Step4Props {
  data: ProposalFormData;
  updateData: (fields: Partial<ProposalFormData>) => void;
}

export default function Step4Pricing({ data, updateData }: Step4Props) {
  // Line items manipulation
  const addLineItem = () => {
    const newItem: LineItem = {
      description: 'New Billable Workstream or Service',
      quantity: 1,
      unit_price: 100,
      total: 100,
    };
    const updatedItems = [...data.line_items, newItem];
    const calc = calculateTotals(updatedItems, data.discount_percentage, data.tax_percentage);
    updateData({
      line_items: calc.items,
      subtotal: calc.subtotal,
      discount_amount: calc.discount_amount,
      tax_amount: calc.tax_amount,
      grand_total: calc.grand_total,
    });
  };

  const updateLineItem = (index: number, field: keyof LineItem, val: any) => {
    const updated = [...data.line_items];
    updated[index] = { ...updated[index], [field]: val };
    const calc = calculateTotals(updated, data.discount_percentage, data.tax_percentage);
    updateData({
      line_items: calc.items,
      subtotal: calc.subtotal,
      discount_amount: calc.discount_amount,
      tax_amount: calc.tax_amount,
      grand_total: calc.grand_total,
    });
  };

  const removeLineItem = (index: number) => {
    const updated = data.line_items.filter((_, i) => i !== index);
    const calc = calculateTotals(updated, data.discount_percentage, data.tax_percentage);
    updateData({
      line_items: calc.items,
      subtotal: calc.subtotal,
      discount_amount: calc.discount_amount,
      tax_amount: calc.tax_amount,
      grand_total: calc.grand_total,
    });
  };

  const handleDiscountChange = (pct: number) => {
    const valid = Math.min(100, Math.max(0, pct));
    const calc = calculateTotals(data.line_items, valid, data.tax_percentage);
    updateData({
      discount_percentage: valid,
      discount_amount: calc.discount_amount,
      tax_amount: calc.tax_amount,
      grand_total: calc.grand_total,
    });
  };

  const handleTaxChange = (pct: number) => {
    const valid = Math.max(0, pct);
    const calc = calculateTotals(data.line_items, data.discount_percentage, valid);
    updateData({
      tax_percentage: valid,
      tax_amount: calc.tax_amount,
      grand_total: calc.grand_total,
    });
  };

  const handleCurrencyChange = (currCode: string) => {
    const found = CURRENCY_OPTIONS.find((c) => c.code === currCode);
    updateData({
      currency: currCode,
      currency_symbol: found?.symbol || '$',
    });
  };

  const calc = calculateTotals(data.line_items, data.discount_percentage, data.tax_percentage);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
            <DollarSign className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-slate-900">Pricing & Cost Breakdown</h2>
        </div>
        <p className="text-sm text-slate-500">
          Add transparent pricing line items with automatic subtotal, discount, and tax calculations.
        </p>
      </div>

      {/* Currency Selector Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Commercial Currency
          </span>
        </div>
        <div className="w-full sm:w-64">
          <select
            value={data.currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 font-medium text-xs sm:text-sm text-slate-900 focus:border-blue-500 outline-none"
          >
            {CURRENCY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Billable Deliverables & Line Items</h3>
          <button
            type="button"
            onClick={addLineItem}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Line Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4 w-1/2">Description</th>
                <th className="py-3 px-3 w-24 text-right">Quantity</th>
                <th className="py-3 px-3 w-32 text-right">Unit Price ({data.currency_symbol})</th>
                <th className="py-3 px-4 w-32 text-right">Total ({data.currency_symbol})</th>
                <th className="py-3 px-2 w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.line_items.map((item, idx) => {
                const lineTotal = Math.round((item.quantity || 0) * (item.unit_price || 0) * 100) / 100;
                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition">
                    <td className="py-2.5 px-4">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateLineItem(idx, 'description', e.target.value)}
                        placeholder="Work item description..."
                        className="w-full px-2.5 py-1.5 rounded border border-slate-200 focus:border-blue-500 outline-none text-slate-900"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(idx, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 rounded border border-slate-200 focus:border-blue-500 outline-none text-right font-medium text-slate-900"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => updateLineItem(idx, 'unit_price', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 rounded border border-slate-200 focus:border-blue-500 outline-none text-right font-medium text-slate-900"
                      />
                    </td>
                    <td className="py-2.5 px-4 text-right font-semibold text-slate-900">
                      {formatCurrency(lineTotal, data.currency_symbol)}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeLineItem(idx)}
                        disabled={data.line_items.length <= 1}
                        className="text-slate-400 hover:text-red-600 disabled:opacity-30 disabled:hover:text-slate-400 p-1 transition"
                        title="Delete line"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals & Discounts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Discount & Tax Controls */}
        <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm space-y-4">
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Discounts & Taxes
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Discount Percentage (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={data.discount_percentage}
                  onChange={(e) => handleDiscountChange(parseFloat(e.target.value) || 0)}
                  className="w-full pl-3 pr-8 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm font-medium text-slate-900"
                />
                <Percent className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Tax / VAT Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.25"
                  value={data.tax_percentage}
                  onChange={(e) => handleTaxChange(parseFloat(e.target.value) || 0)}
                  className="w-full pl-3 pr-8 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm font-medium text-slate-900"
                />
                <Percent className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary Card */}
        <div className="border border-slate-200 rounded-xl p-5 bg-slate-900 text-white shadow-lg space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            Investment Summary
          </h4>
          <div className="flex justify-between text-sm text-slate-300">
            <span>Subtotal:</span>
            <span className="font-mono">{formatCurrency(calc.subtotal, data.currency_symbol)}</span>
          </div>

          {calc.discount_percentage > 0 && (
            <div className="flex justify-between text-sm text-emerald-400">
              <span>Discount ({calc.discount_percentage}%):</span>
              <span className="font-mono">-{formatCurrency(calc.discount_amount, data.currency_symbol)}</span>
            </div>
          )}

          {calc.tax_percentage > 0 && (
            <div className="flex justify-between text-sm text-slate-300">
              <span>Estimated Tax ({calc.tax_percentage}%):</span>
              <span className="font-mono">+{formatCurrency(calc.tax_amount, data.currency_symbol)}</span>
            </div>
          )}

          <div className="border-t border-slate-700 pt-3 flex justify-between items-baseline text-lg font-bold text-white">
            <span>Grand Total:</span>
            <span className="text-2xl text-blue-400 font-mono">
              {formatCurrency(calc.grand_total, data.currency_symbol)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
