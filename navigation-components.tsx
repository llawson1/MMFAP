import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ChevronRight, 
  ChevronLeft,
  Home,
  Search,
  Menu,
  X,
  ArrowLeft,
  ExternalLink,
  Star,
  Bookmark,
  Clock,
  MapPin,
  Users,
  TrendingUp,
  Filter,
  Grid,
  List,
  Calendar,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
    current?: boolean;
  }>;
  separator?: React.ReactNode;
  className?: string;
}

function Breadcrumb({ items, separator, className = "" }: BreadcrumbProps) {
  const defaultSeparator = <ChevronRight className="h-4 w-4 text-gray-400" />;

  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <span className="mx-2">
              {separator || defaultSeparator}
            </span>
          )}
          {item.href && !item.current ? (
            <a 
              href={item.href}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {item.label}
            </a>
          ) : (
            <span className={item.current ? "text-gray-900 font-medium" : "text-gray-600"}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

interface SidebarProps {
  navigation: Array<{
    name: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    current?: boolean;
    badge?: string | number;
    children?: Array<{
      name: string;
      href: string;
      current?: boolean;
    }>;
  }>;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

function Sidebar({ 
  navigation, 
  header, 
  footer, 
  collapsed = false, 
  onToggle,
  className = "" 
}: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  return (
    <aside className={cn(
      "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      <div className="flex flex-col h-full">
        {header && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            {header}
          </div>
        )}

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <div className="space-y-1">
                  <a
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      item.current 
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" 
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    )}
                    onClick={(e) => {
                      if (item.children) {
                        e.preventDefault();
                        toggleExpanded(item.name);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      {item.icon && (
                        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      )}
                      {!collapsed && <span>{item.name}</span>}
                    </div>
                    {!collapsed && (
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                        {item.children && (
                          <ChevronRight 
                            className={cn(
                              "h-4 w-4 transition-transform",
                              expandedItems.includes(item.name) && "rotate-90"
                            )}
                          />
                        )}
                      </div>
                    )}
                  </a>

                  {item.children && !collapsed && expandedItems.includes(item.name) && (
                    <ul className="ml-6 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <a
                            href={child.href}
                            className={cn(
                              "block px-3 py-2 text-sm rounded-md transition-colors",
                              child.current
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                            )}
                          >
                            {child.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {footer && !collapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {footer}
          </div>
        )}

        {onToggle && (
          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="w-full justify-center"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}

interface TabNavigationProps {
  tabs: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
    badge?: string | number;
    disabled?: boolean;
  }>;
  defaultTab?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

function TabNavigation({ 
  tabs, 
  defaultTab, 
  orientation = 'horizontal',
  className = "" 
}: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={cn(
      "space-y-4",
      orientation === 'vertical' && "flex gap-6",
      className
    )}>
      <div className={cn(
        "border-b border-gray-200 dark:border-gray-700",
        orientation === 'horizontal' ? "flex space-x-8" : "flex flex-col space-y-2 w-48"
      )}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
            className={cn(
              "flex items-center gap-2 px-1 py-2 text-sm font-medium transition-colors",
              orientation === 'horizontal' 
                ? "border-b-2 -mb-px" 
                : "border-l-2 pl-4 -ml-px",
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
              tab.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <Badge variant="secondary" className="text-xs">
                {tab.badge}
              </Badge>
            )}
          </button>
        ))}
      </div>

      <div className={cn(orientation === 'vertical' && "flex-1")}>
        {activeContent}
      </div>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPages?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  className?: string;
}

function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showPages = 5,
  showFirstLast = true,
  showPrevNext = true,
  className = "" 
}: PaginationProps) {
  const getPageNumbers = () => {
    const delta = Math.floor(showPages / 2);
    const range = [];
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    if (showFirstLast) {
      range.push(1);
    }

    if (start > 2) {
      range.push('...');
    }

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        range.push(i);
      }
    }

    if (end < totalPages - 1) {
      range.push('...');
    }

    if (totalPages > 1 && showFirstLast) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <nav className={cn("flex items-center justify-center space-x-1", className)}>
      {showPrevNext && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
      )}

      <div className="flex space-x-1">
        {getPageNumbers().map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(Number(page))}
                className="w-10 h-8"
              >
                {page}
              </Button>
            )}
          </div>
        ))}
      </div>

      {showPrevNext && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  );
}

interface QuickSearchProps {
  items: Array<{
    id: string;
    title: string;
    description?: string;
    category?: string;
    url?: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  placeholder?: string;
  onSelect?: (item: any) => void;
  categories?: string[];
  className?: string;
}

function QuickSearch({ 
  items, 
  placeholder = "Search...", 
  onSelect, 
  categories = [],
  className = "" 
}: QuickSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems = items.filter(item => {
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase()) ||
                        item.description?.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesQuery && matchesCategory;
  }).slice(0, 8);

  const handleSelect = (item: any) => {
    onSelect?.(item);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length > 0);
          }}
          onFocus={() => setIsOpen(query.length > 0)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="pl-10"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-96 overflow-hidden">
          {categories.length > 0 && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-1">
                <Button
                  variant={selectedCategory === null ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="h-6 text-xs"
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="h-6 text-xs"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="max-h-80 overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {item.icon && (
                      <item.icon className="h-4 w-4 text-gray-400" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 truncate">
                          {item.description}
                        </div>
                      )}
                    </div>
                    {item.category && (
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No results found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface StepperProps {
  steps: Array<{
    id: string;
    title: string;
    description?: string;
    status: 'completed' | 'current' | 'upcoming';
  }>;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

function Stepper({ steps, orientation = 'horizontal', className = "" }: StepperProps) {
  const getStepIcon = (status: string, index: number) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'current':
        return (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">{index + 1}</span>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-sm font-medium">{index + 1}</span>
          </div>
        );
    }
  };

  return (
    <div className={cn(
      orientation === 'horizontal' ? "flex items-center" : "space-y-4",
      className
    )}>
      {steps.map((step, index) => (
        <div key={step.id} className={cn(
          "flex items-center",
          orientation === 'horizontal' ? "flex-1" : "space-x-3"
        )}>
          <div className="flex items-center">
            {getStepIcon(step.status, index)}
            
            {orientation === 'horizontal' && index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-px ml-4",
                step.status === 'completed' ? "bg-green-500" : "bg-gray-300"
              )} />
            )}
          </div>

          <div className={cn(
            orientation === 'vertical' ? "flex-1" : "ml-4"
          )}>
            <h3 className={cn(
              "text-sm font-medium",
              step.status === 'current' ? "text-blue-600" : 
              step.status === 'completed' ? "text-green-600" : "text-gray-500"
            )}>
              {step.title}
            </h3>
            {step.description && (
              <p className="text-xs text-gray-500 mt-1">{step.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export {
  Breadcrumb,
  Sidebar,
  TabNavigation,
  Pagination,
  QuickSearch,
  Stepper
}