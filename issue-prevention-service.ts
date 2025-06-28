
import { FunctionExistenceDetector } from './function-existence-detector';
import { ReactKeyDetector } from './react-key-detector';

export class IssuePreventionService {
  private static isInitialized = false;
  private static issues: Array<{
    type: 'method-missing' | 'duplicate-key' | 'navigation-error' | 'data-integrity';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    component?: string;
    timestamp: Date;
    stackTrace?: string;
  }> = [];

  static initialize(): void {
    if (this.isInitialized) return;

    // Set up global error handling
    this.setupErrorHandling();
    
    // Validate core utilities
    this.validateCoreUtilities();
    
    // Set up periodic checks
    this.setupPeriodicChecks();
    
    this.isInitialized = true;
    console.log('🛡️ Issue Prevention Service initialized');
  }

  private static setupErrorHandling(): void {
    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logIssue({
        type: 'navigation-error',
        severity: 'high',
        message: `Unhandled promise rejection: ${event.reason}`,
        timestamp: new Date(),
        stackTrace: event.reason?.stack
      });
    });

    // Catch general errors
    window.addEventListener('error', (event) => {
      this.logIssue({
        type: 'navigation-error',
        severity: 'high',
        message: `Runtime error: ${event.message}`,
        timestamp: new Date(),
        stackTrace: event.error?.stack
      });
    });
  }

  private static validateCoreUtilities(): void {
    // Validate TeamNavigationUtil
    try {
      // Use dynamic import to avoid module loading issues
      import('../utils/team-navigation').then((module) => {
        const TeamNavigationUtil = module.default;
        const expectedMethods = [
          'getTeamSlug',
          'getTeamBySlug',
          'getTeamUrl',
          'hasTeamPage',
          'getAllTeams',
          'navigateToTeam'
        ];

        const validation = FunctionExistenceDetector.validateExpectedMethods(
          TeamNavigationUtil,
          expectedMethods
        );

        if (validation.missing.length > 0) {
          this.logIssue({
            type: 'method-missing',
            severity: 'low',
            message: `Missing TeamNavigationUtil methods: ${validation.missing.join(', ')}`,
            component: 'TeamNavigationUtil',
            timestamp: new Date()
          });
        }
      }).catch((error) => {
        this.logIssue({
          type: 'method-missing',
          severity: 'low',
          message: `Failed to validate TeamNavigationUtil: ${error}`,
          component: 'TeamNavigationUtil',
          timestamp: new Date()
        });
      });
    } catch (error) {
      // Silently handle validation errors to prevent blocking app startup
      console.warn('TeamNavigationUtil validation skipped:', error);
    }
  }

  private static setupPeriodicChecks(): void {
    // Check for issues every 30 seconds in development
    if (process.env.NODE_ENV === 'development') {
      setInterval(() => {
        this.runPeriodicChecks();
      }, 30000);
    }
  }

  private static runPeriodicChecks(): void {
    // Check for duplicate React keys
    const duplicates = ReactKeyDetector.getDuplicateReport();
    if (duplicates.length > 0) {
      this.logIssue({
        type: 'duplicate-key',
        severity: 'medium',
        message: `Found ${duplicates.length} duplicate React keys`,
        timestamp: new Date()
      });
    }

    // Check for missing method calls
    const methodErrors = FunctionExistenceDetector.getErrorReport();
    methodErrors.forEach(error => {
      this.logIssue({
        type: 'method-missing',
        severity: 'high',
        message: `Method ${error.method} missing on ${error.component}`,
        component: error.component,
        timestamp: error.timestamp,
        stackTrace: error.stackTrace
      });
    });
  }

  private static logIssue(issue: typeof IssuePreventionService.issues[0]): void {
    this.issues.push(issue);
    
    // Log to console based on severity
    const emoji = {
      low: '🟡',
      medium: '🟠', 
      high: '🔴',
      critical: '🚨'
    };

    console.log(`${emoji[issue.severity]} [${issue.type}] ${issue.message}`, issue);
    
    // Send to monitoring in production
    if (process.env.NODE_ENV === 'production') {
      // Here you could send to analytics/monitoring service
    }
  }

  // Public methods
  static getIssueReport(): typeof IssuePreventionService.issues {
    return this.issues;
  }

  static getIssuesByType(type: string): typeof IssuePreventionService.issues {
    return this.issues.filter(issue => issue.type === type);
  }

  static getIssuesBySeverity(severity: string): typeof IssuePreventionService.issues {
    return this.issues.filter(issue => issue.severity === severity);
  }

  static clearIssues(): void {
    this.issues = [];
    FunctionExistenceDetector.clearErrors();
    ReactKeyDetector.clearRegistry();
  }

  // Manual validation triggers
  static validateNavigation(): boolean {
    try {
      const TeamNavigationUtil = require('../utils/team-navigation').default;
      return typeof TeamNavigationUtil.navigateToTeam === 'function';
    } catch {
      return false;
    }
  }

  static validateComponent(componentName: string, requiredMethods: string[]): boolean {
    // Add component-specific validations here
    return true;
  }
}

// Auto-initialize in development
if (process.env.NODE_ENV === 'development') {
  IssuePreventionService.initialize();
}

export default IssuePreventionService;
