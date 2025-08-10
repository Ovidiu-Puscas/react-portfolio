import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  transformDataForRateProgression,
  getCurrencySymbol,
  formatTooltipValue,
} from '../../utils/chartDataTransformers';

const RateProgressionChart = ({
  customRate,
  usdToRonRate,
  ronToEurRate,
  microSrlTaxRate,
  nextYearDividendTaxRate,
  selectedYear,
  selectedCurrency,
  calculateIncome,
}) => {
  const [activeLines, setActiveLines] = useState({
    gross: true,
    companyNet: true,
    individualNet: true,
  });

  const data = transformDataForRateProgression(
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
      const visiblePayload = payload.filter((p) => activeLines[p.dataKey]);

      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">${label}/hr</p>
          <div className="space-y-1 text-sm">
            {visiblePayload.map((entry) => (
              <p key={entry.dataKey} style={{ color: entry.color }}>
                {entry.name}: {formatTooltipValue(entry.value, selectedCurrency)}
              </p>
            ))}
            {visiblePayload.length > 1 && (
              <div className="pt-2 mt-2 border-t border-gray-200">
                <p className="text-gray-600">
                  Tax Amount:{' '}
                  {formatTooltipValue(
                    visiblePayload[0].value - visiblePayload[visiblePayload.length - 1].value,
                    selectedCurrency
                  )}
                </p>
                <p className="text-gray-600">
                  Effective Rate:{' '}
                  {(
                    ((visiblePayload[0].value - visiblePayload[visiblePayload.length - 1].value) /
                      visiblePayload[0].value) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const handleLegendClick = (dataKey) => {
    setActiveLines((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  const CustomLegend = (props) => {
    const { payload } = props;

    return (
      <div className="flex justify-center gap-6 mt-4">
        {payload.map((entry) => (
          <button
            key={entry.value}
            onClick={() => handleLegendClick(entry.dataKey)}
            className={`flex items-center gap-2 px-3 py-1 rounded transition-all ${
              activeLines[entry.dataKey] ? 'opacity-100' : 'opacity-40 line-through'
            }`}
          >
            <span className="w-4 h-1" style={{ backgroundColor: entry.color }} />
            <span className="text-sm">{entry.value}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Income Progression by Rate - {selectedYear} ({selectedCurrency})
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="rate"
            tick={{ fill: '#4b5563' }}
            style={{ fontSize: '14px' }}
            label={{ value: 'Hourly Rate ($)', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            tick={{ fill: '#4b5563' }}
            style={{ fontSize: '14px' }}
            tickFormatter={(value) => `${currencySymbol}${(value / 1000).toFixed(0)}k`}
            label={{
              value: `Monthly Income (${selectedCurrency})`,
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />

          {customRate && customRate > 0 && (
            <ReferenceLine
              x={customRate}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label={{ value: `Custom: $${customRate}/hr`, position: 'top' }}
            />
          )}

          <Line
            type="monotone"
            dataKey="gross"
            stroke="#8b5cf6"
            name="Gross Income"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            hide={!activeLines.gross}
          />
          <Line
            type="monotone"
            dataKey="companyNet"
            stroke="#3b82f6"
            name="Company Net"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            hide={!activeLines.companyNet}
          />
          <Line
            type="monotone"
            dataKey="individualNet"
            stroke="#10b981"
            name="Individual Net"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            hide={!activeLines.individualNet}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 text-xs text-gray-500 text-center">
        Click on legend items to show/hide lines
      </div>
    </div>
  );
};

export default RateProgressionChart;
