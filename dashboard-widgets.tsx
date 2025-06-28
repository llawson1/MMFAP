import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Trophy,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ExternalLink,
  RefreshCw,
  Play,
  Pause,
  Settings
} from "lucide-react";
import { AnimatedCounter, StatusBadge, ConfidenceMeter } from "./interactive-elements";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  format?: 'number' | 'currency' | 'percentage';
  icon?: React.ComponentType<{ className?: string }>;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  onClick?: () => void;
  className?: string;
}

function MetricCard({ 
  title, 
  value, 
  change, 
  changeType,
  format = 'number',
  icon: Icon,
  color = 'blue',
  size = 'md',
  animated = true,
  onClick,
  className = ""
}: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700'
  };

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percentage':
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return <ArrowUpRight className="h-3 w-3 text-green-500" />;
      case 'decrease':
        return <ArrowDownRight className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-md hover:scale-105",
        className
      )}
      onClick={onClick}
    >
      <CardContent className={sizeClasses[size]}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-600">{title}</div>
            {Icon && (
              <div className={cn("p-2 rounded-lg", colorClasses[color])}>
                <Icon className="h-4 w-4" />
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="text-2xl font-bold">
              {animated && typeof value === 'number' ? (
                <AnimatedCounter value={value} suffix={format === 'percentage' ? '%' : ''} />
              ) : (
                formatValue(value)
              )}
            </div>
            
            {change !== undefined && (
              <div className="flex items-center gap-1">
                {getChangeIcon()}
                <span className={cn(
                  "text-xs font-medium",
                  changeType === 'increase' ? 'text-green-600' : 
                  changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                )}>
                  {Math.abs(change)}% from last period
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityFeedProps {
  activities: Array<{
    id: string;
    type: 'transfer' | 'match' | 'news' | 'update';
    title: string;
    description: string;
    timestamp: Date;
    priority?: 'low' | 'medium' | 'high';
    url?: string;
  }>;
  maxItems?: number;
  autoRefresh?: boolean;
  className?: string;
}

function ActivityFeed({ 
  activities, 
  maxItems = 10, 
  autoRefresh = true,
  className = "" 
}: ActivityFeedProps) {
  const [isLive, setIsLive] = useState(autoRefresh);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'transfer':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'match':
        return <Trophy className="h-4 w-4 text-green-500" />;
      case 'news':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'update':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Activity
            {isLive && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.slice(0, maxItems).map((activity) => (
            <div 
              key={activity.id}
              className={cn(
                "border-l-4 pl-4 py-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-r",
                getPriorityColor(activity.priority || 'low')
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium truncate">{activity.title}</h4>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  {activity.url && (
                    <Button variant="ghost" size="sm" className="mt-2 h-6 px-2 text-xs">
                      View Details
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {activities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface PerformanceMeterProps {
  metrics: Array<{
    label: string;
    value: number;
    target: number;
    color?: string;
  }>;
  title?: string;
  className?: string;
}

function PerformanceMeter({ metrics, title = "Performance Metrics", className = "" }: PerformanceMeterProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, index) => {
          const percentage = (metric.value / metric.target) * 100;
          const isOnTarget = percentage >= 90;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{metric.label}</span>
                <div className="flex items-center gap-2">
                  <span>{metric.value} / {metric.target}</span>
                  <StatusBadge 
                    status={isOnTarget ? 'success' : percentage >= 70 ? 'warning' : 'error'}
                    label={`${percentage.toFixed(0)}%`}
                  />
                </div>
              </div>
              <Progress 
                value={Math.min(percentage, 100)} 
                className="h-2"
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

interface QuickStatsGridProps {
  stats: Array<{
    label: string;
    value: number | string;
    change?: number;
    format?: 'number' | 'currency' | 'percentage';
  }>;
  columns?: 2 | 3 | 4;
  className?: string;
}

function QuickStatsGrid({ stats, columns = 4, className = "" }: QuickStatsGridProps) {
  const gridClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3', 
    4: 'grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={cn(`grid gap-4 ${gridClasses[columns]}`, className)}>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">
              {typeof stat.value === 'number' ? (
                <AnimatedCounter 
                  value={stat.value} 
                  suffix={stat.format === 'percentage' ? '%' : ''}
                  prefix={stat.format === 'currency' ? '$' : ''}
                />
              ) : (
                stat.value
              )}
            </div>
            <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            {stat.change !== undefined && (
              <div className="flex items-center justify-center gap-1 mt-2">
                {stat.change > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={cn(
                  "text-xs",
                  stat.change > 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {Math.abs(stat.change)}%
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface AlertsBannerProps {
  alerts: Array<{
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    dismissible?: boolean;
    action?: {
      label: string;
      onClick: () => void;
    };
  }>;
  onDismiss?: (id: string) => void;
  className?: string;
}

function AlertsBanner({ alerts, onDismiss, className = "" }: AlertsBannerProps) {
  if (alerts.length === 0) return null;

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {alerts.map((alert) => (
        <div 
          key={alert.id}
          className={cn(
            "border rounded-lg p-4",
            getAlertStyles(alert.type)
          )}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {getAlertIcon(alert.type)}
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{alert.title}</h4>
              <p className="text-sm mt-1 opacity-90">{alert.message}</p>
              {alert.action && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={alert.action.onClick}
                  className="mt-2 h-8 px-3 text-xs"
                >
                  {alert.action.label}
                </Button>
              )}
            </div>
            {alert.dismissible && onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDismiss(alert.id)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

interface SystemStatusProps {
  services: Array<{
    name: string;
    status: 'operational' | 'degraded' | 'outage';
    responseTime?: number;
    uptime?: number;
  }>;
  className?: string;
}

function SystemStatus({ services, className = "" }: SystemStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'outage':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const overallStatus = services.every(s => s.status === 'operational') 
    ? 'operational' 
    : services.some(s => s.status === 'outage')
    ? 'outage'
    : 'degraded';

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Status
          </CardTitle>
          <StatusBadge 
            status={overallStatus === 'operational' ? 'success' : overallStatus === 'degraded' ? 'warning' : 'error'}
            label={overallStatus}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {services.map((service, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className={cn(
                  "w-3 h-3 rounded-full",
                  service.status === 'operational' ? 'bg-green-500' :
                  service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                )}
              />
              <span className="font-medium">{service.name}</span>
            </div>
            <div className="text-right text-sm">
              <Badge className={getStatusColor(service.status)}>
                {service.status}
              </Badge>
              {service.responseTime && (
                <div className="text-xs text-gray-500 mt-1">
                  {service.responseTime}ms
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export {
  MetricCard,
  ActivityFeed,
  PerformanceMeter,
  QuickStatsGrid,
  AlertsBanner,
  SystemStatus
}