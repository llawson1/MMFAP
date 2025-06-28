// Global error handler for unhandled promise rejections and runtime errors
export class GlobalErrorHandler {
  private static isInitialized = false;
  private static errorLog: Array<{
    type: 'unhandledrejection' | 'error' | 'navigation';
    message: string;
    timestamp: Date;
    stack?: string;
  }> = [];

  static initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.warn('Unhandled promise rejection:', event.reason);
      
      this.errorLog.push({
        type: 'unhandledrejection',
        message: event.reason?.message || String(event.reason),
        timestamp: new Date(),
        stack: event.reason?.stack
      });

      // Prevent the default error handling
      event.preventDefault();
    });

    // Handle general runtime errors
    window.addEventListener('error', (event) => {
      console.warn('Runtime error:', event.message);
      
      this.errorLog.push({
        type: 'error',
        message: event.message,
        timestamp: new Date(),
        stack: event.error?.stack
      });
    });

    this.isInitialized = true;
    console.log('Global error handler initialized');
  }

  static getErrorLog() {
    return this.errorLog;
  }

  static clearErrorLog() {
    this.errorLog = [];
  }

  // Safe async wrapper
  static async safeAsync<T>(
    asyncFn: () => Promise<T>,
    fallback?: T,
    errorContext?: string
  ): Promise<T | undefined> {
    try {
      return await asyncFn();
    } catch (error) {
      console.warn(`Safe async error ${errorContext ? `in ${errorContext}` : ''}:`, error);
      
      this.errorLog.push({
        type: 'error',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
        stack: error instanceof Error ? error.stack : undefined
      });

      return fallback;
    }
  }

  // Safe navigation wrapper
  static safeNavigate(url: string, fallbackUrl?: string) {
    try {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', url);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    } catch (error) {
      console.warn('Navigation error:', error);
      
      this.errorLog.push({
        type: 'navigation',
        message: `Navigation failed to ${url}: ${error}`,
        timestamp: new Date()
      });

      // Fallback navigation
      if (fallbackUrl && typeof window !== 'undefined') {
        window.location.href = fallbackUrl;
      }
    }
  }
}

// Initialize on module load
if (typeof window !== 'undefined') {
  GlobalErrorHandler.initialize();
}