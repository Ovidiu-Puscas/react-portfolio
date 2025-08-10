import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  transformDataForYearComparison,
  getCurrencySymbol,
  formatTooltipValue,
} from '../../utils/chartDataTransformers';

const YearComparisonChart = ({
  customRate,
  usdToRonRate,
  ronToEurRate,
  microSrlTaxRate,
  nextYearDividendTaxRate,
  selectedCurrency,
  calculateIncome,
}) => {
  const fixedRates = [20, 25, 30, 35];

  const data = transformDataForYearComparison(
    fixedRates,
    customRate,
    calculateIncome,
    usdToRonRate,
    ronToEurRate,
    microSrlTaxRate,
    nextYearDividendTaxRate,
    selectedCurrency
  );

  const currencySymbol = getCurrencySymbol(selectedCurrency);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value2025 = payload.find((p) => p.dataKey === '2025')?.value || 0;
      const value2026 = payload.find((p) => p.dataKey === '2026')?.value || 0;
      const difference = value2026 - value2025;
      const percentChange = value2025 > 0 ? ((difference / value2025) * 100).toFixed(1) : 0;

      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">2025: {formatTooltipValue(value2025, selectedCurrency)}</p>
            <p className="text-purple-600">
              2026: {formatTooltipValue(value2026, selectedCurrency)}
            </p>
            <div className="pt-2 mt-2 border-t border-gray-200">
              <p className={`font-semibold ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {difference >= 0 ? '↑' : '↓'}{' '}
                {formatTooltipValue(Math.abs(difference), selectedCurrency)}
              </p>
              <p className="text-gray-600 text-xs">
                {difference >= 0 ? 'Increase' : 'Decrease'}: {Math.abs(percentChange)}%
              </p>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
            Tax Rates:
            <br />
            2025 Dividend: 10%
            <br />
            2026 Dividend: {nextYearDividendTaxRate}%
          </div>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (entry, year) => {
    if (year === '2025') return '#3b82f6';
    if (year === '2026') {
      return entry.difference >= 0 ? '#10b981' : '#ef4444';
    }
    return '#8b5cf6';
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Year-over-Year Comparison ({selectedCurrency})
      </h3>
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          Comparing net income between 2025 (10% dividend tax) and 2026 ({nextYearDividendTaxRate}%
          dividend tax)
        </p>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="rate" tick={{ fill: '#4b5563' }} style={{ fontSize: '14px' }} />
          <YAxis
            tick={{ fill: '#4b5563' }}
            style={{ fontSize: '14px' }}
            tickFormatter={(value) => `${currencySymbol}${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="rect" />
          <Bar dataKey="2025" fill="#3b82f6" name="2025 Net Income" radius={[8, 8, 0, 0]} />
          <Bar dataKey="2026" name="2026 Net Income" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry, '2026')} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {data.map((item) => {
          const percentChange =
            item['2025'] > 0 ? ((item.difference / item['2025']) * 100).toFixed(1) : 0;
          const isPositive = item.difference >= 0;

          return (
            <div key={item.rate} className="text-center p-2 bg-gray-50 rounded">
              <p className="text-xs text-gray-600 mb-1">{item.rate}</p>
              <p
                className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}
              >
                {isPositive ? '+' : ''}
                {percentChange}%
              </p>
              <p className="text-xs text-gray-500">
                {isPositive ? '↑' : '↓'}{' '}
                {formatTooltipValue(Math.abs(item.difference), selectedCurrency)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YearComparisonChart;
