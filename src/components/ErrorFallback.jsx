import React from 'react';
import { LiquidGlassCard, LiquidGlassButton } from './LiquidGlass';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <LiquidGlassCard className="max-w-2xl w-full p-8 text-center">
        <div className="space-y-6">
          <div className="text-6xl">⚠️</div>
          
          <h1 className="text-4xl font-bold text-white">
            Oops! Something went wrong
          </h1>
          
          <p className="text-xl text-gray-300">
            We encountered an unexpected error. Don't worry, your data is safe.
          </p>
          
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-6">
            <p className="text-red-300 font-mono text-sm break-all">
              {error.message}
            </p>
          </div>
          
          <div className="flex gap-4 justify-center mt-8">
            <LiquidGlassButton 
              onClick={resetErrorBoundary}
              className="px-8 py-3"
            >
              Try Again
            </LiquidGlassButton>
            
            <LiquidGlassButton 
              onClick={() => window.location.href = '/'}
              className="px-8 py-3"
              variant="secondary"
            >
              Go Home
            </LiquidGlassButton>
          </div>
          
          <p className="text-sm text-gray-400 mt-8">
            If this problem persists, please refresh the page or contact support.
          </p>
        </div>
      </LiquidGlassCard>
    </div>
  );
};

export default ErrorFallback;