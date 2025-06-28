import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Heart, 
  Share, 
  Bookmark,
  Eye,
  ThumbsUp,
  MessageCircle,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Target,
  Award,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  selected?: boolean;
  className?: string;
}

function InteractiveCard({ 
  children, 
  onClick, 
  hoverable = true, 
  selected = false,
  className = "" 
}: InteractiveCardProps) {
  return (
    <Card 
      className={cn(
        "transition-all duration-200",
        hoverable && "hover:shadow-lg hover:scale-105 cursor-pointer",
        selected && "ring-2 ring-blue-500",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  );
}

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

function AnimatedCounter({ 
  value, 
  duration = 1000, 
  suffix = "", 
  prefix = "",
  className = "" 
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const updateCount = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
  showValue?: boolean;
}

function ProgressRing({ 
  value, 
  size = 120, 
  strokeWidth = 8, 
  color = "#3b82f6",
  className = "",
  showValue = true 
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold">{value}%</span>
        </div>
      )}
    </div>
  );
}

interface TrendIndicatorProps {
  value: number;
  comparison?: number;
  format?: 'number' | 'percentage' | 'currency';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

function TrendIndicator({ 
  value, 
  comparison, 
  format = 'number',
  size = 'md',
  showIcon = true,
  className = "" 
}: TrendIndicatorProps) {
  const isPositive = comparison ? value > comparison : value > 0;
  const change = comparison ? ((value - comparison) / comparison) * 100 : 0;

  const formatValue = (val: number) => {
    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'currency':
        return `$${val.toLocaleString()}`;
      default:
        return val.toLocaleString();
    }
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={cn("flex items-center gap-1", sizeClasses[size], className)}>
      <span className="font-semibold">{formatValue(value)}</span>
      {comparison && (
        <div className={cn(
          "flex items-center gap-1 text-xs",
          isPositive ? "text-green-600" : "text-red-600"
        )}>
          {showIcon && (
            isPositive ? 
              <TrendingUp className="h-3 w-3" /> : 
              <TrendingDown className="h-3 w-3" />
          )}
          <span>{Math.abs(change).toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
}

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

function RatingStars({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  interactive = false,
  onRatingChange,
  className = "" 
}: RatingStarsProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= (hoveredRating || rating);
        
        return (
          <Star
            key={i}
            className={cn(
              sizeClasses[size],
              "transition-colors",
              isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
              interactive && "cursor-pointer hover:text-yellow-400"
            )}
            onMouseEnter={() => interactive && setHoveredRating(starValue)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            onClick={() => interactive && onRatingChange?.(starValue)}
          />
        );
      })}
    </div>
  );
}

interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
  className?: string;
}

function ShareButton({ url, title, text, className = "" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: title || document.title,
      text: text || '',
      url: url || window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy to clipboard');
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className={cn("flex items-center gap-2", className)}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied
        </>
      ) : (
        <>
          <Share className="h-4 w-4" />
          Share
        </>
      )}
    </Button>
  );
}

interface LikeButtonProps {
  initialLikes?: number;
  liked?: boolean;
  onToggle?: (liked: boolean) => void;
  className?: string;
}

function LikeButton({ 
  initialLikes = 0, 
  liked = false, 
  onToggle,
  className = "" 
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(initialLikes);

  const handleToggle = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    onToggle?.(newLiked);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className={cn("flex items-center gap-2", className)}
    >
      <Heart 
        className={cn(
          "h-4 w-4 transition-colors",
          isLiked ? "fill-red-500 text-red-500" : "text-gray-500"
        )} 
      />
      <span>{likeCount}</span>
    </Button>
  );
}

interface BookmarkButtonProps {
  bookmarked?: boolean;
  onToggle?: (bookmarked: boolean) => void;
  className?: string;
}

function BookmarkButton({ 
  bookmarked = false, 
  onToggle,
  className = "" 
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);

  const handleToggle = () => {
    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);
    onToggle?.(newBookmarked);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className={cn("flex items-center gap-2", className)}
    >
      <Bookmark 
        className={cn(
          "h-4 w-4 transition-colors",
          isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-500"
        )} 
      />
    </Button>
  );
}

interface ConfidenceMeterProps {
  confidence: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
  className?: string;
}

function ConfidenceMeter({ 
  confidence, 
  label, 
  showPercentage = true,
  color,
  className = "" 
}: ConfidenceMeterProps) {
  const getColor = () => {
    if (color) return color;
    if (confidence >= 80) return "bg-green-500";
    if (confidence >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getIcon = () => {
    if (confidence >= 80) return <Target className="h-4 w-4 text-green-500" />;
    if (confidence >= 60) return <Zap className="h-4 w-4 text-yellow-500" />;
    return <Clock className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span>{label}</span>
          </div>
          {showPercentage && (
            <span className="font-medium">{confidence}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className={cn("h-2 rounded-full transition-all duration-500", getColor())}
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'success' | 'error' | 'warning';
  label?: string;
  pulse?: boolean;
  className?: string;
}

function StatusBadge({ status, label, pulse = false, className = "" }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return { color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-100' };
      case 'inactive':
        return { color: 'bg-gray-500', textColor: 'text-gray-700', bgColor: 'bg-gray-100' };
      case 'pending':
        return { color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-100' };
      case 'success':
        return { color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-100' };
      case 'error':
        return { color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-100' };
      case 'warning':
        return { color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-100' };
      default:
        return { color: 'bg-gray-500', textColor: 'text-gray-700', bgColor: 'bg-gray-100' };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge 
      className={cn(
        "flex items-center gap-2",
        config.textColor,
        config.bgColor,
        className
      )}
    >
      <div 
        className={cn(
          "w-2 h-2 rounded-full",
          config.color,
          pulse && "animate-pulse"
        )}
      />
      {label || status}
    </Badge>
  );
}

export {
  InteractiveCard,
  AnimatedCounter,
  ProgressRing,
  TrendIndicator,
  RatingStars,
  ShareButton,
  LikeButton,
  BookmarkButton,
  ConfidenceMeter,
  StatusBadge
}