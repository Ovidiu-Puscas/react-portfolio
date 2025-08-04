import './App.css';
import AppLibraryLiquid from './projects/AppLibraryLiquid';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorFallback';
import { logError } from './utils/errorLogger';

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
      onError={(error, errorInfo) => {
        logError(error, errorInfo, { component: 'App' });
      }}
    >
      <div className="App">
        <AppLibraryLiquid />
      </div>
    </ErrorBoundary>
  );
}

export default App;
