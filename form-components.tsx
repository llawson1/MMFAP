import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Filter, 
  X, 
  Plus,
  Upload,
  Download,
  Save,
  RefreshCw,
  Check,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFormProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  suggestions?: string[];
  className?: string;
}

function SearchForm({ 
  placeholder = "Search...", 
  value = "", 
  onChange, 
  onSubmit,
  suggestions = [],
  className = "" 
}: SearchFormProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(inputValue);
    setShowSuggestions(false);
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);
    onChange?.(val);
    setShowSuggestions(val.length > 0 && suggestions.length > 0);
  };

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(inputValue.toLowerCase())
  ).slice(0, 5);

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="pl-10 pr-10"
            onFocus={() => setShowSuggestions(inputValue.length > 0 && suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {inputValue && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setInputValue("");
                onChange?.("");
                setShowSuggestions(false);
              }}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </form>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-md last:rounded-b-md"
              onClick={() => {
                setInputValue(suggestion);
                onChange?.(suggestion);
                onSubmit?.(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface FilterFormProps {
  filters: Array<{
    id: string;
    label: string;
    type: 'select' | 'checkbox' | 'range' | 'search';
    options?: Array<{ value: string; label: string }>;
    value?: any;
    min?: number;
    max?: number;
    step?: number;
  }>;
  onFilterChange?: (filterId: string, value: any) => void;
  onReset?: () => void;
  activeCount?: number;
  className?: string;
}

function FilterForm({ 
  filters, 
  onFilterChange, 
  onReset, 
  activeCount = 0,
  className = "" 
}: FilterFormProps) {
  const renderFilterInput = (filter: any) => {
    switch (filter.type) {
      case 'select':
        return (
          <Select 
            value={filter.value || ""} 
            onValueChange={(value) => onFilterChange?.(filter.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {filter.options?.map((option: any) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${filter.id}-${option.value}`}
                  checked={filter.value?.includes(option.value) || false}
                  onCheckedChange={(checked) => {
                    const currentValues = filter.value || [];
                    const newValues = checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    onFilterChange?.(filter.id, newValues);
                  }}
                />
                <Label htmlFor={`${filter.id}-${option.value}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );
      
      case 'range':
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>{filter.min}</span>
              <span>{filter.max}</span>
            </div>
            <Slider
              value={filter.value || [filter.min, filter.max]}
              onValueChange={(value) => onFilterChange?.(filter.id, value)}
              min={filter.min}
              max={filter.max}
              step={filter.step || 1}
              className="w-full"
            />
            <div className="text-center text-sm">
              {Array.isArray(filter.value) 
                ? `${filter.value[0]} - ${filter.value[1]}`
                : `${filter.min} - ${filter.max}`
              }
            </div>
          </div>
        );
      
      case 'search':
        return (
          <Input
            type="text"
            placeholder={`Search ${filter.label.toLowerCase()}`}
            value={filter.value || ""}
            onChange={(e) => onFilterChange?.(filter.id, e.target.value)}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeCount}
              </Badge>
            )}
          </CardTitle>
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              Reset
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filters.map((filter) => (
          <div key={filter.id} className="space-y-2">
            <Label className="text-sm font-medium">{filter.label}</Label>
            {renderFilterInput(filter)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

interface DataImportFormProps {
  onImport?: (data: any) => void;
  acceptedFormats?: string[];
  maxFileSize?: number;
  className?: string;
}

function DataImportForm({ 
  onImport, 
  acceptedFormats = ['csv', 'json', 'xlsx'],
  maxFileSize = 10,
  className = "" 
}: DataImportFormProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setIsProcessing(true);

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!acceptedFormats.includes(extension || '')) {
        throw new Error(`Unsupported file format. Accepted: ${acceptedFormats.join(', ')}`);
      }

      if (file.size > maxFileSize * 1024 * 1024) {
        throw new Error(`File too large. Maximum size: ${maxFileSize}MB`);
      }

      const text = await file.text();
      let data;

      switch (extension) {
        case 'json':
          data = JSON.parse(text);
          break;
        case 'csv':
          // Simple CSV parsing
          const lines = text.split('\n');
          const headers = lines[0].split(',');
          data = lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, index) => {
              obj[header.trim()] = values[index]?.trim();
              return obj;
            }, {} as any);
          });
          break;
        default:
          throw new Error('Unsupported file format');
      }

      onImport?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Import Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300",
            isProcessing && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {isProcessing ? (
            <div className="space-y-2">
              <RefreshCw className="h-8 w-8 mx-auto animate-spin text-blue-500" />
              <p className="text-sm text-gray-600">Processing file...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 mx-auto text-gray-400" />
              <div>
                <p className="text-lg font-medium">Drop your file here</p>
                <p className="text-sm text-gray-500">
                  or{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-500 hover:underline"
                  >
                    browse files
                  </button>
                </p>
              </div>
              <div className="text-xs text-gray-500">
                Supported formats: {acceptedFormats.join(', ').toUpperCase()}
                <br />
                Maximum size: {maxFileSize}MB
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.map(f => `.${f}`).join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ContactFormProps {
  onSubmit?: (data: any) => void;
  fields?: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
    required?: boolean;
    options?: string[];
  }>;
  className?: string;
}

function ContactForm({ 
  onSubmit, 
  fields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'message', label: 'Message', type: 'textarea', required: true }
  ],
  className = "" 
}: ContactFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit?.(formData);
      setSubmitted(true);
      setFormData({});
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center">
          <Check className="h-12 w-12 mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Message Sent!</h3>
          <p className="text-gray-600">Thank you for your message. We'll get back to you soon.</p>
          <Button 
            className="mt-4"
            onClick={() => setSubmitted(false)}
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                  rows={4}
                />
              ) : field.type === 'select' ? (
                <Select
                  value={formData[field.name] || ''}
                  onValueChange={(value) => handleChange(field.name, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="relative">
                  {field.type === 'email' && (
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  )}
                  {field.type === 'tel' && (
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  )}
                  <Input
                    id={field.name}
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required={field.required}
                    className={field.type === 'email' || field.type === 'tel' ? 'pl-10' : ''}
                  />
                </div>
              )}
            </div>
          ))}
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

interface PreferencesFormProps {
  preferences: Record<string, any>;
  onSave?: (preferences: Record<string, any>) => void;
  className?: string;
}

function PreferencesForm({ preferences, onSave, className = "" }: PreferencesFormProps) {
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key: string, value: any) => {
    setLocalPreferences(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave?.(localPreferences);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalPreferences(preferences);
    setHasChanges(false);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Dark Mode</Label>
              <p className="text-sm text-gray-500">Use dark theme across the application</p>
            </div>
            <Switch
              checked={localPreferences.darkMode || false}
              onCheckedChange={(checked) => handleChange('darkMode', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Notifications</Label>
              <p className="text-sm text-gray-500">Receive push notifications</p>
            </div>
            <Switch
              checked={localPreferences.notifications || false}
              onCheckedChange={(checked) => handleChange('notifications', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>Update Frequency</Label>
            <Select
              value={localPreferences.updateFrequency || 'medium'}
              onValueChange={(value) => handleChange('updateFrequency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (Once per hour)</SelectItem>
                <SelectItem value="medium">Medium (Every 15 minutes)</SelectItem>
                <SelectItem value="high">High (Every 5 minutes)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Default League</Label>
            <Select
              value={localPreferences.defaultLeague || 'premier-league'}
              onValueChange={(value) => handleChange('defaultLeague', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="premier-league">Premier League</SelectItem>
                <SelectItem value="la-liga">La Liga</SelectItem>
                <SelectItem value="serie-a">Serie A</SelectItem>
                <SelectItem value="bundesliga">Bundesliga</SelectItem>
                <SelectItem value="ligue-1">Ligue 1</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasChanges && (
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export {
  SearchForm,
  FilterForm,
  DataImportForm,
  ContactForm,
  PreferencesForm
}