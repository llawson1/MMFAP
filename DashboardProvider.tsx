
import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

interface DashboardData {
  totalTransfers: number;
  activeRumors: number;
  confirmedDeals: number;
  marketValue: number;
  lastUpdated: string;
  [key: string]: any; // Allow for additional properties
}

interface DashboardContextValue {
  data: DashboardData | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
}

async function fetchDashboardSummary(): Promise<DashboardData> {
  const response = await fetch('/api/dashboard-summary', {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery<DashboardData, Error>({
    queryKey: ['dashboard-summary'],
    queryFn: fetchDashboardSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error instanceof Error && error.message.includes('4')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    onError: (error) => {
      console.error('Dashboard data fetch error:', error);
    }
  });

  const contextValue: DashboardContextValue = {
    data,
    isLoading,
    error,
    refetch
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext(): DashboardContextValue {
  const context = useContext(DashboardContext);
  
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  
  return context;
}

// Export types for use in other components
export type { DashboardData, DashboardContextValue };
