import React from 'react';

const GameStats = ({
  stats = [],
  buttons = [],
  className = '',
  layout = 'horizontal', // 'horizontal' or 'vertical'
}) => {
  const layoutClasses =
    layout === 'vertical' ? 'flex flex-col space-y-4' : 'flex flex-wrap items-center gap-4';

  return (
    <div className={`game-stats ${layoutClasses} ${className}`}>
      {/* Stats Display */}
      {stats.length > 0 && (
        <div className="stats-container flex flex-wrap items-center gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-item"
              data-testid={
                stat.label.toLowerCase() === 'time' ? 'timer' : `stat-${stat.label.toLowerCase()}`
              }
            >
              <span className="stat-label font-medium text-gray-700">{stat.label}:</span>
              <span className="stat-value ml-2 font-bold text-blue-600">{stat.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      {buttons.length > 0 && (
        <div className="buttons-container flex flex-wrap gap-2">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              disabled={button.disabled}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${
                  button.variant === 'primary'
                    ? 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-300'
                    : button.variant === 'secondary'
                      ? 'bg-gray-500 hover:bg-gray-600 text-white disabled:bg-gray-300'
                      : button.variant === 'success'
                        ? 'bg-green-500 hover:bg-green-600 text-white disabled:bg-green-300'
                        : button.variant === 'warning'
                          ? 'bg-orange-500 hover:bg-orange-600 text-white disabled:bg-orange-300'
                          : button.variant === 'danger'
                            ? 'bg-red-500 hover:bg-red-600 text-white disabled:bg-red-300'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:bg-gray-100'
                }
                ${button.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
                ${button.className || ''}
              `}
            >
              {button.icon && <span className="mr-2">{button.icon}</span>}
              {button.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameStats;
