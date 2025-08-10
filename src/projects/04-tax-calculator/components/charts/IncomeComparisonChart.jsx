import React, { useState } from 'react';
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
  transformDataForIncomeComparison,
  getCurrencySymbol,
  formatTooltipValue,
} from '../../utils/chartDataTransformers';

const IncomeComparisonChart = ({
  customRate,
  usdToRonRate,
  ronToEurRate,
  microSrlTaxRate,
  nextYearDividendTaxRate,
  selectedYear,
  selectedCurrency,
  calculateIncome,
  onRateClick,
}) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const fixedRates = [20, 25, 30, 35];

  const data = transformDataForIncomeComparison(
    fixedRates,
    customRate,
    calculateIncome,
    usdToRonRate,
    ronToEurRate,
    microSrlTaxRate,
    nextYearDividendTaxRate,
    selectedCurrency,
    selectedYear
  );

  const currencySymbol = getCurrencySymbol(selectedCurrency);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const gross = payload.find((p) => p.dataKey === 'gross')?.value || 0;
      const net = payload.find((p) => p.dataKey === 'net')?.value || 0;
      const difference = gross - net;
      const taxRate = gross > 0 ? ((difference / gross) * 100).toFixed(1) : 0;

      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-purple-600">Gross: {formatTooltipValue(gross, selectedCurrency)}</p>
            <p className="text-green-600">Net: {formatTooltipValue(net, selectedCurrency)}</p>
            <p className="text-red-500">
              Total Tax: {formatTooltipValue(difference, selectedCurrency)}
            </p>
            <p className="text-gray-600">Effective Tax Rate: {taxRate}%</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data) => {
    if (onRateClick) {
      const rate = parseFloat(data.rate.replace('$', '').replace('/hr', ''));
      onRateClick(rate);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-3 lg:p-4 mb-6">
      <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-4">
        Income Comparison - {selectedYear} ({selectedCurrency})
      </h3>
      <div className="overflow-x-auto">
        <ResponsiveContainer width="100%" height={350} minWidth={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 15, left: 15, bottom: 5 }}
            onClick={(e) => e && e.activePayload && handleBarClick(e.activePayload[0].payload)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="rate" tick={{ fill: '#4b5563' }} style={{ fontSize: '14px' }} />
            <YAxis
              tick={{ fill: '#4b5563' }}
              style={{ fontSize: '14px' }}
              tickFormatter={(value) => `${currencySymbol}${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="rect" />
            <Bar
              dataKey="gross"
              fill="#8b5cf6"
              name="Gross Income"
              radius={[8, 8, 0, 0]}
              onMouseEnter={(data, index) => setHoveredBar(`gross-${index}`)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`gross-${index}`}
                  fill={hoveredBar === `gross-${index}` ? '#7c3aed' : '#8b5cf6'}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Bar>
            <Bar
              dataKey="net"
              fill="#10b981"
              name="Net Income"
              radius={[8, 8, 0, 0]}
              onMouseEnter={(data, index) => setHoveredBar(`net-${index}`)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`net-${index}`}
                  fill={hoveredBar === `net-${index}` ? '#059669' : '#10b981'}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-xs text-gray-500 text-center">
        <span className="hidden sm:inline">
          Click on any bar to highlight the corresponding row in the table
        </span>
        <span className="sm:hidden">Tap any bar to highlight the corresponding row</span>
      </div>
    </div>
  );
};

export default IncomeComparisonChart;
