const isDevelopment = process.env.NODE_ENV === 'development';

class ErrorLogger {
  constructor() {
    this.errors = [];
    this.maxErrors = 50;
  }

  logError(error, errorInfo, context = {}) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      errorInfo,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.errors.push(errorLog);

    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    if (isDevelopment) {
      console.group('🔴 Error Logger');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Context:', context);
      console.groupEnd();
    }

    if (process.env.REACT_APP_SENTRY_DSN) {
      this.sendToSentry(errorLog);
    }

    localStorage.setItem('errorLogs', JSON.stringify(this.errors));
  }

  sendToSentry(errorLog) {
    console.log('Sending error to monitoring service:', errorLog);
  }

  getErrors() {
    try {
      const stored = localStorage.getItem('errorLogs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  clearErrors() {
    this.errors = [];
    localStorage.removeItem('errorLogs');
  }

  getLatestErrors(count = 10) {
    return this.errors.slice(-count);
  }
}

export const errorLogger = new ErrorLogger();

export const logError = (error, errorInfo, context) => {
  errorLogger.logError(error, errorInfo, context);
};
