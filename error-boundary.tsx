import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="bg-gray-900 border-gray-700 border-red-500/50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-semibold text-white">Something went wrong</h3>
            </div>
            <p className="text-gray-400 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button 
              onClick={this.handleRetry}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;