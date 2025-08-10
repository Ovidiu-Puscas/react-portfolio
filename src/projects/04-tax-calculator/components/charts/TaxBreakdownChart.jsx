import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import {
  transformDataForTaxBreakdown,
  formatTooltipValue,
} from '../../utils/chartDataTransformers';

const TaxBreakdownChart = ({
  hourlyRate,
  usdToRonRate,
  ronToEurRate,
  microSrlTaxRate,
  nextYearDividendTaxRate,
  selectedYear,
  selectedCurrency,
  calculateIncome,
}) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const data = transformDataForTaxBreakdown(
    hourlyRate || 0,
    calculateIncome,
    usdToRonRate,
    ronToEurRate,
    microSrlTaxRate,
    nextYearDividendTaxRate,
    selectedCurrency,
    selectedYear
  );

  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  const renderCenterLabel = () => {
    const displayData =
      selectedIndex !== null
        ? data[selectedIndex]
        : activeIndex !== null
          ? data[activeIndex]
          : null;

    return (
      <text
        x="50%"
        y="48%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="transition-all duration-300"
      >
        <tspan
          x="50%"
          dy={displayData ? '-1.2em' : '-0.3em'}
          className="text-lg font-bold"
          fill={displayData ? displayData.fill : '#4b5563'}
        >
          {displayData ? displayData.name : 'Total'}
        </tspan>
        <tspan
          x="50%"
          dy={displayData ? '1.4em' : '1.2em'}
          className="text-base font-semibold"
          fill={displayData ? displayData.fill : '#4b5563'}
        >
          {formatTooltipValue(displayData ? displayData.value : total, selectedCurrency)}
        </tspan>
        {displayData && (
          <tspan x="50%" dy="1.2em" className="text-sm" fill="#6b7280">
            {((displayData.value / total) * 100).toFixed(1)}%
          </tspan>
        )}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const percentage = ((value / total) * 100).toFixed(1);

      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-sm" style={{ color: payload[0].payload.fill }}>
            {formatTooltipValue(value, selectedCurrency)}
          </p>
          <p className="text-xs text-gray-600">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  const RADIAN = Math.PI / 180;

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
    value,
    fill,
    index,
  }) => {
    if (percent < 0.03) return null;

    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 35) * cos;
    const my = cy + (outerRadius + 35) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 25;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    // Get the actual segment color from data
    const segmentColor = data[index]?.fill || fill;

    // Shorten text on mobile
    const shortName = window.innerWidth < 640 ? name.split(' ')[0] : name;

    return (
      <g key={`label-${index}`} style={{ pointerEvents: 'none' }}>
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={segmentColor}
          fill="none"
          strokeWidth="1"
        />
        <circle cx={ex} cy={ey} r={2} fill={segmentColor} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 5 : -5)}
          y={ey}
          textAnchor={textAnchor}
          fill={segmentColor}
          fontSize="14px"
          fontWeight="bold"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <text
          x={ex + (cos >= 0 ? 5 : -5)}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#6b7280"
          fontSize="11px"
        >
          {shortName}
        </text>
      </g>
    );
  };

  if (!hourlyRate || hourlyRate <= 0) {
    return (
      <div className="text-center text-slate-500 py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-sm font-medium">Enter hourly rate</p>
        <p className="text-xs text-slate-400 mt-1">to see tax breakdown</p>
      </div>
    );
  }

  return (
    <div
      className="w-full focus:outline-none"
      style={{
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
      }}
    >
      <div className="text-center mb-4">
        <div className="text-2xl font-bold text-slate-800">${hourlyRate}/hr</div>
        <div className="text-sm text-slate-600">
          {selectedYear} • {selectedCurrency}
        </div>
      </div>
      <div
        className="relative overflow-visible focus:outline-none"
        style={{
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
      >
        <ResponsiveContainer width="100%" height={isMobile ? 300 : 320} minWidth={280}>
          <PieChart
            margin={
              isMobile
                ? { top: 5, right: 10, bottom: 5, left: 10 }
                : { top: 10, right: 80, bottom: 10, left: 80 }
            }
          >
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={!isMobile ? renderCustomLabel : false}
              outerRadius={isMobile ? 120 : 85}
              innerRadius={isMobile ? 75 : 50}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={300}
              isAnimationActive={false}
              onMouseEnter={(data, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => {
                const isSelected = selectedIndex === index;
                const isHovered = activeIndex === index;
                const isActive = isSelected || isHovered;

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    style={{
                      cursor: 'pointer',
                      filter: isActive ? 'brightness(1.15)' : 'brightness(1)',
                      opacity:
                        selectedIndex === null
                          ? isHovered
                            ? 1
                            : activeIndex === null
                              ? 1
                              : 0.8
                          : isSelected
                            ? 1
                            : 0.6,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isActive ? 'scale(1.08)' : 'scale(1)',
                      transformOrigin: 'center',
                      outline: 'none',
                      stroke: 'none',
                      border: 'none',
                    }}
                    onClick={(e) => {
                      e?.stopPropagation?.();
                      e?.preventDefault?.();

                      // Only handle click if it's not a touch device or if touch events aren't supported
                      if (!('ontouchstart' in window)) {
                        if (selectedIndex === index) {
                          setSelectedIndex(null);
                        } else {
                          setSelectedIndex(index);
                        }
                      }
                    }}
                    onTouchStart={(e) => {
                      e?.stopPropagation?.();
                      e?.preventDefault?.();

                      // Handle touch interaction
                      if (selectedIndex === index) {
                        setSelectedIndex(null);
                      } else {
                        setSelectedIndex(index);
                      }
                    }}
                  />
                );
              })}
            </Pie>
            {renderCenterLabel()}
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>
                  {value}: {formatTooltipValue(entry.payload.value, selectedCurrency)}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 space-y-3">
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">Total Income</span>
            <span className="font-bold text-slate-800">
              {formatTooltipValue(total, selectedCurrency)}
            </span>
          </div>
        </div>
        <div className="bg-red-50 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-red-600">Total Tax</span>
            <span className="font-bold text-red-700">
              {formatTooltipValue(data[0].value + data[1].value, selectedCurrency)}
            </span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-orange-600">Effective Rate</span>
            <span className="font-bold text-orange-700 text-xl">
              {(((data[0].value + data[1].value) / total) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxBreakdownChart;
