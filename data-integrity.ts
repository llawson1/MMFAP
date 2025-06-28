// Data integrity and validation utilities

export interface DataIntegrityReport {
  isValid: boolean;
  score: number; // 0-100
  issues: DataIssue[];
  recommendations: string[];
}

export interface DataIssue {
  type: 'missing' | 'invalid' | 'stale' | 'incomplete' | 'inconsistent';
  field?: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Data type validators
export const dataValidators = {
  transfer: (data: any): DataIntegrityReport => {
    const issues: DataIssue[] = [];
    const recommendations: string[] = [];

    // Required fields check
    const requiredFields = ['fromTeam', 'toTeam', 'playerName', 'source'];
    requiredFields.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        issues.push({
          type: 'missing',
          field,
          message: `Required field '${field}' is missing or empty`,
          severity: 'critical'
        });
      }
    });

    // Data type validation
    if (data.fee !== undefined && typeof data.fee !== 'number') {
      issues.push({
        type: 'invalid',
        field: 'fee',
        message: 'Transfer fee must be a number',
        severity: 'medium'
      });
    }

    if (data.reliability !== undefined && (typeof data.reliability !== 'number' || data.reliability < 0 || data.reliability > 100)) {
      issues.push({
        type: 'invalid',
        field: 'reliability',
        message: 'Reliability score must be a number between 0 and 100',
        severity: 'medium'
      });
    }

    // Timestamp validation
    if (data.timestamp) {
      const timestamp = new Date(data.timestamp);
      if (isNaN(timestamp.getTime())) {
        issues.push({
          type: 'invalid',
          field: 'timestamp',
          message: 'Invalid timestamp format',
          severity: 'medium'
        });
      } else {
        // Check if data is stale (older than 24 hours)
        const ageHours = (Date.now() - timestamp.getTime()) / (1000 * 60 * 60);
        if (ageHours > 24) {
          issues.push({
            type: 'stale',
            field: 'timestamp',
            message: `Data is ${Math.round(ageHours)} hours old`,
            severity: 'low'
          });
        }
      }
    }

    // Business logic validation
    if (data.fromTeam === data.toTeam) {
      issues.push({
        type: 'inconsistent',
        message: 'Transfer cannot be between the same team',
        severity: 'high'
      });
    }

    // Generate recommendations
    if (issues.some(i => i.type === 'missing')) {
      recommendations.push('Ensure all required fields are provided before saving');
    }
    if (issues.some(i => i.type === 'stale')) {
      recommendations.push('Consider refreshing data from the source');
    }
    if (issues.some(i => i.severity === 'critical')) {
      recommendations.push('Critical issues must be resolved before using this data');
    }

    // Calculate score
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const highIssues = issues.filter(i => i.severity === 'high').length;
    const mediumIssues = issues.filter(i => i.severity === 'medium').length;
    const lowIssues = issues.filter(i => i.severity === 'low').length;

    let score = 100;
    score -= criticalIssues * 25;
    score -= highIssues * 15;
    score -= mediumIssues * 10;
    score -= lowIssues * 5;
    score = Math.max(0, score);

    return {
      isValid: criticalIssues === 0,
      score,
      issues,
      recommendations
    };
  },

  team: (data: any): DataIntegrityReport => {
    const issues: DataIssue[] = [];
    const recommendations: string[] = [];

    // Required fields
    const requiredFields = ['name', 'league'];
    requiredFields.forEach(field => {
      if (!data[field]) {
        issues.push({
          type: 'missing',
          field,
          message: `Required field '${field}' is missing`,
          severity: 'critical'
        });
      }
    });

    // Numeric field validation
    const numericFields = ['position', 'played', 'won', 'drawn', 'lost', 'points'];
    numericFields.forEach(field => {
      if (data[field] !== undefined && (typeof data[field] !== 'number' || data[field] < 0)) {
        issues.push({
          type: 'invalid',
          field,
          message: `${field} must be a non-negative number`,
          severity: 'medium'
        });
      }
    });

    // Consistency checks
    if (data.played !== undefined && data.won !== undefined && data.drawn !== undefined && data.lost !== undefined) {
      if (data.played !== data.won + data.drawn + data.lost) {
        issues.push({
          type: 'inconsistent',
          message: 'Games played does not match sum of won, drawn, and lost',
          severity: 'high'
        });
      }
    }

    let score = 100 - issues.filter(i => i.severity === 'critical').length * 25 
                   - issues.filter(i => i.severity === 'high').length * 15
                   - issues.filter(i => i.severity === 'medium').length * 10;

    return {
      isValid: issues.filter(i => i.severity === 'critical').length === 0,
      score: Math.max(0, score),
      issues,
      recommendations
    };
  },

  player: (data: any): DataIntegrityReport => {
    const issues: DataIssue[] = [];
    const recommendations: string[] = [];

    // Required fields
    if (!data.name) {
      issues.push({
        type: 'missing',
        field: 'name',
        message: 'Player name is required',
        severity: 'critical'
      });
    }

    // Age validation
    if (data.age !== undefined) {
      if (typeof data.age !== 'number' || data.age < 16 || data.age > 45) {
        issues.push({
          type: 'invalid',
          field: 'age',
          message: 'Player age must be between 16 and 45',
          severity: 'medium'
        });
      }
    }

    // Market value validation
    if (data.marketValue !== undefined) {
      if (typeof data.marketValue !== 'number' || data.marketValue < 0) {
        issues.push({
          type: 'invalid',
          field: 'marketValue',
          message: 'Market value must be a positive number',
          severity: 'medium'
        });
      }
    }

    let score = 100 - issues.filter(i => i.severity === 'critical').length * 25;
    
    return {
      isValid: issues.filter(i => i.severity === 'critical').length === 0,
      score: Math.max(0, score),
      issues,
      recommendations
    };
  }
};

// Batch data validation
export function validateBatchData<T>(
  data: T[],
  validator: (item: T) => DataIntegrityReport
): {
  overallScore: number;
  validItems: number;
  totalItems: number;
  criticalIssues: number;
  recommendations: string[];
} {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      overallScore: 0,
      validItems: 0,
      totalItems: 0,
      criticalIssues: 1,
      recommendations: ['No data provided for validation']
    };
  }

  const reports = data.map(validator);
  const validItems = reports.filter(r => r.isValid).length;
  const totalItems = data.length;
  const criticalIssues = reports.reduce((sum, r) => 
    sum + r.issues.filter(i => i.severity === 'critical').length, 0
  );
  
  const overallScore = reports.reduce((sum, r) => sum + r.score, 0) / totalItems;
  
  const recommendations = Array.from(new Set(
    reports.flatMap(r => r.recommendations)
  )).slice(0, 5); // Top 5 unique recommendations

  return {
    overallScore: Math.round(overallScore),
    validItems,
    totalItems,
    criticalIssues,
    recommendations
  };
}

// Data freshness checker
export function checkDataFreshness(timestamp: string | Date, maxAgeMinutes = 60): {
  isFresh: boolean;
  ageMinutes: number;
  status: 'fresh' | 'stale' | 'expired';
} {
  const now = new Date();
  const dataTime = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  
  if (isNaN(dataTime.getTime())) {
    return {
      isFresh: false,
      ageMinutes: Infinity,
      status: 'expired'
    };
  }

  const ageMinutes = (now.getTime() - dataTime.getTime()) / (1000 * 60);
  
  let status: 'fresh' | 'stale' | 'expired';
  if (ageMinutes <= maxAgeMinutes / 2) {
    status = 'fresh';
  } else if (ageMinutes <= maxAgeMinutes) {
    status = 'stale';
  } else {
    status = 'expired';
  }

  return {
    isFresh: ageMinutes <= maxAgeMinutes,
    ageMinutes: Math.round(ageMinutes),
    status
  };
}

// Data sanitization
export function sanitizeData<T>(data: T, sanitizers: Record<string, (value: any) => any>): T {
  if (data === null || data === undefined) return data;
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item, sanitizers)) as T;
  }
  
  if (typeof data === 'object') {
    const sanitized = { ...data } as any;
    
    Object.keys(sanitizers).forEach(key => {
      if (key in sanitized) {
        try {
          sanitized[key] = sanitizers[key](sanitized[key]);
        } catch (error) {
          console.warn(`Sanitization failed for field ${key}:`, error);
        }
      }
    });
    
    return sanitized;
  }
  
  return data;
}

// Common sanitizers
export const commonSanitizers = {
  trimString: (value: any) => typeof value === 'string' ? value.trim() : value,
  normalizeTeamName: (value: any) => 
    typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : value,
  roundNumber: (decimals = 2) => (value: any) => 
    typeof value === 'number' ? Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals) : value,
  ensurePositive: (value: any) => 
    typeof value === 'number' ? Math.max(0, value) : value,
  normalizeURL: (value: any) => {
    if (typeof value !== 'string') return value;
    try {
      const url = new URL(value);
      return url.toString();
    } catch {
      return value;
    }
  }
};