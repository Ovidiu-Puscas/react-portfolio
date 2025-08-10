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
} from 'recharts';
import { transformDataForCurrencyComparison } from '../../utils/chartDataTransformers';

const CurrencyComparisonChart = ({
  hourlyRate,
  usdToRonRate,
  ronToEurRate,
  microSrlTaxRate,
  nextYearDividendTaxRate,
  selectedYear,
  calculateIncome,
}) => {
  if (!hourlyRate || hourlyRate <= 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Currency Comparison - {selectedYear}
        </h3>
        <div className="text-center text-gray-500 py-8">
          Enter an hourly rate to see currency comparison
        </div>
      </div>
    );
  }

  const data = transformDataForCurrencyComparison(
    hourlyRate,
    calculateIncome,
    usdToRonRate,
    ronToEurRate,
    microSrlTaxRate,
    nextYearDividendTaxRate,
    selectedYear
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const gross = payload.find((p) => p.dataKey === 'gross')?.value || 0;
      const net = payload.find((p) => p.dataKey === 'net')?.value || 0;
      const difference = gross - net;
      const taxRate = gross > 0 ? ((difference / gross) * 100).toFixed(1) : 0;

      const formatValue = (value, currency) => {
        switch (currency) {
          case 'USD':
            return `$${value.toLocaleString()}`;
          case 'RON':
            return `RON ${value.toLocaleString()}`;
          case 'EUR':
            return `€${value.toLocaleString()}`;
          default:
            return value.toLocaleString();
        }
      };

      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-purple-600">Gross: {formatValue(gross, label)}</p>
            <p className="text-green-600">Net: {formatValue(net, label)}</p>
            <p className="text-red-500">Total Tax: {formatValue(difference, label)}</p>
            <p className="text-gray-600">Effective Tax Rate: {taxRate}%</p>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
            Exchange Rates:
            <br />
            USD to RON: {usdToRonRate.toFixed(2)}
            <br />
            EUR to RON: {ronToEurRate.toFixed(2)}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Currency Comparison for ${hourlyRate}/hr - {selectedYear}
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="currency" tick={{ fill: '#4b5563' }} style={{ fontSize: '14px' }} />
          <YAxis
            tick={{ fill: '#4b5563' }}
            style={{ fontSize: '14px' }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="rect" />
          <Bar dataKey="gross" fill="#8b5cf6" name="Gross Income" radius={[8, 8, 0, 0]} />
          <Bar dataKey="net" fill="#10b981" name="Net Income" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        {data.map(({ currency, gross, net }) => {
          const savings = ((net / gross) * 100).toFixed(1);
          return (
            <div key={currency} className="p-2 bg-gray-50 rounded">
              <p className="text-xs text-gray-600 mb-1">{currency} Net/Gross Ratio</p>
              <p className="text-lg font-semibold text-green-600">{savings}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CurrencyComparisonChart;
