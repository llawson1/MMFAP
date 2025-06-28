import { 
  Search, 
  Database, 
  Users, 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  Shield,
  AlertCircle,
  RefreshCw,
  Plus,
  Filter,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

function EmptyState({ title, description, icon: Icon, action, className = "" }: EmptyStateProps) {
  return (
    <Card className={`border-dashed ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        {Icon && (
          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
            <Icon className="h-8 w-8 text-gray-400" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
          {description}
        </p>
        {action && (
          <Button onClick={action.onClick} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Specialized empty states for different contexts
function NoTeamsFound({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="No teams found"
      description="No teams match your current search criteria. Try adjusting your filters or search terms."
      action={onReset ? { label: "Reset filters", onClick: onReset } : undefined}
    />
  );
}

function NoPlayersFound({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      icon={Search}
      title="No players found"
      description="We couldn't find any players matching your search. Try different keywords or broaden your criteria."
      action={onReset ? { label: "Clear search", onClick: onReset } : undefined}
    />
  );
}

function NoTransfersFound() {
  return (
    <EmptyState
      icon={ArrowRight}
      title="No transfer activity"
      description="There are currently no transfers matching your criteria. Check back later for updates."
    />
  );
}

function NoFixturesFound() {
  return (
    <EmptyState
      icon={Calendar}
      title="No fixtures available"
      description="No matches are scheduled for the selected period. Try selecting a different date range."
    />
  );
}

function NoDataAvailable({ type = "data" }: { type?: string }) {
  return (
    <EmptyState
      icon={Database}
      title={`No ${type} available`}
      description={`${type.charAt(0).toUpperCase() + type.slice(1)} is currently unavailable. Please try again later or contact support if the issue persists.`}
    />
  );
}

function NoSearchResults({ query, onClear }: { query: string; onClear?: () => void }) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description={`No results found for "${query}". Try different keywords or check your spelling.`}
      action={onClear ? { label: "Clear search", onClick: onClear } : undefined}
    />
  );
}

function LoadingError({ onRetry, error }: { onRetry?: () => void; error?: string }) {
  return (
    <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-800 rounded-full">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
          Loading Error
        </h3>
        <p className="text-red-700 dark:text-red-300 mb-6 max-w-md">
          {error || "Failed to load data. Please check your connection and try again."}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-800 rounded-full">
          <Shield className="h-8 w-8 text-yellow-500" />
        </div>
        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
          Connection Issue
        </h3>
        <p className="text-yellow-700 dark:text-yellow-300 mb-6 max-w-md">
          Unable to connect to the server. Please check your internet connection.
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry connection
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function ComingSoon({ feature }: { feature: string }) {
  return (
    <EmptyState
      icon={Clock}
      title="Coming Soon"
      description={`${feature} will be available in a future update. Stay tuned for exciting new features!`}
    />
  );
}

function MaintenanceMode() {
  return (
    <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-800 rounded-full">
          <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Under Maintenance
        </h3>
        <p className="text-blue-700 dark:text-blue-300 mb-6 max-w-md">
          This feature is currently under maintenance. We'll be back shortly with improvements.
        </p>
      </CardContent>
    </Card>
  );
}

function NoFiltersApplied({ onApplyFilters }: { onApplyFilters?: () => void }) {
  return (
    <EmptyState
      icon={Filter}
      title="No filters applied"
      description="Apply filters to narrow down your search and find exactly what you're looking for."
      action={onApplyFilters ? { label: "Apply filters", onClick: onApplyFilters } : undefined}
    />
  );
}

export {
  EmptyState,
  NoTeamsFound,
  NoPlayersFound,
  NoTransfersFound,
  NoFixturesFound,
  NoDataAvailable,
  NoSearchResults,
  LoadingError,
  NetworkError,
  ComingSoon,
  MaintenanceMode,
  NoFiltersApplied
}