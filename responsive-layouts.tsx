import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Grid, 
  List,
  Filter,
  Search,
  ArrowUpDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}

function ResponsiveGrid({ 
  children, 
  cols = { sm: 1, md: 2, lg: 3, xl: 4 }, 
  gap = 4,
  className = "" 
}: ResponsiveGridProps) {
  const gridClasses = cn(
    "grid",
    `gap-${gap}`,
    cols.sm && `grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    className
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  title?: string;
}

function MobileMenu({ isOpen, onToggle, children, title = "Menu" }: MobileMenuProps) {
  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="md:hidden"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={onToggle} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-lg">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{title}</h2>
                <Button variant="ghost" size="sm" onClick={onToggle}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string | number;
  className?: string;
}

function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = false, 
  badge,
  className = "" 
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className={className}>
      <CardHeader 
        className="cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{title}</span>
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CardTitle>
      </CardHeader>
      {isOpen && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
}

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  className?: string;
}

function ViewToggle({ view, onViewChange, className = "" }: ViewToggleProps) {
  return (
    <div className={cn("flex border rounded-lg overflow-hidden", className)}>
      <Button
        variant={view === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className="rounded-none"
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className="rounded-none"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface MobileFiltersProps {
  children: React.ReactNode;
  activeFilters?: number;
  onClearAll?: () => void;
}

function MobileFilters({ children, activeFilters = 0, onClearAll }: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilters > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFilters}
            </Badge>
          )}
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-x-0 bottom-0 bg-white dark:bg-gray-900 rounded-t-lg shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              <div className="flex items-center gap-2">
                {onClearAll && activeFilters > 0 && (
                  <Button variant="ghost" size="sm" onClick={onClearAll}>
                    Clear all
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {children}
            </div>
            <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
              <Button 
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface MobileSearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
}

function MobileSearch({ 
  placeholder = "Search...", 
  value = "", 
  onChange,
  onClear 
}: MobileSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="md:hidden">
      {!isExpanded ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="w-full justify-start"
        >
          <Search className="h-4 w-4 mr-2" />
          {value || placeholder}
        </Button>
      ) : (
        <div className="flex items-center gap-2 p-2 border rounded-lg">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm"
            autoFocus
          />
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onClear?.();
                setIsExpanded(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
          >
            Done
          </Button>
        </div>
      )}
    </div>
  );
}

interface MobileSortProps {
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
}

function MobileSort({ options, value, onChange }: MobileSortProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="md:hidden">
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          {selectedOption?.label || "Sort"}
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-x-0 bottom-0 bg-white dark:bg-gray-900 rounded-t-lg shadow-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Sort by</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-2">
              {options.map((option) => (
                <Button
                  key={option.value}
                  variant={value === option.value ? "default" : "ghost"}
                  onClick={() => {
                    onChange?.(option.value);
                    setIsOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ResponsiveTableProps {
  headers: string[];
  data: any[][];
  mobileLabels?: string[];
  className?: string;
}

function ResponsiveTable({ headers, data, mobileLabels, className = "" }: ResponsiveTableProps) {
  return (
    <div className={className}>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              {headers.map((header, i) => (
                <th key={i} className="text-left p-4 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                {row.map((cell, j) => (
                  <td key={j} className="p-4">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {data.map((row, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-2">
              {row.map((cell, j) => (
                <div key={j} className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {mobileLabels?.[j] || headers[j]}
                  </span>
                  <span className="font-medium">{cell}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export {
  ResponsiveGrid,
  MobileMenu,
  CollapsibleSection,
  ViewToggle,
  MobileFilters,
  MobileSearch,
  MobileSort,
  ResponsiveTable
}