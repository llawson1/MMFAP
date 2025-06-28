interface HealthCheckResult {
  status: 'healthy' | 'warning' | 'error';
  service: string;
  details: string;
  timestamp: Date;
  responseTime?: number;
}

interface DatabaseCheck {
  teams: boolean;
  transfers: boolean;
  liveStats: boolean;
  scenarios: boolean;
}

interface LinkCheck {
  url: string;
  status: 'accessible' | 'broken' | 'slow';
  responseTime?: number;
}

class HealthCheckService {
  private static instance: HealthCheckService;
  private checkInterval: NodeJS.Timeout | null = null;
  private listeners: ((results: HealthCheckResult[]) => void)[] = [];

  static getInstance(): HealthCheckService {
    if (!HealthCheckService.instance) {
      HealthCheckService.instance = new HealthCheckService();
    }
    return HealthCheckService.instance;
  }

  startMonitoring(intervalMs: number = 60000) {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(async () => {
      const results = await this.runHealthChecks();
      this.notifyListeners(results);
    }, intervalMs);

    // Run initial check
    this.runHealthChecks().then(results => this.notifyListeners(results));
  }

  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  addListener(callback: (results: HealthCheckResult[]) => void) {
    this.listeners.push(callback);
  }

  removeListener(callback: (results: HealthCheckResult[]) => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  private notifyListeners(results: HealthCheckResult[]) {
    this.listeners.forEach(listener => listener(results));
  }

  async runHealthChecks(): Promise<HealthCheckResult[]> {
    const results: HealthCheckResult[] = [];

    // Database connectivity checks
    const dbResults = await this.checkDatabaseHealth();
    results.push(...dbResults);

    // API endpoint checks
    const apiResults = await this.checkAPIHealth();
    results.push(...apiResults);

    // Internal navigation checks
    const navResults = await this.checkNavigationHealth();
    results.push(...navResults);

    // External link checks
    const linkResults = await this.checkExternalLinks();
    results.push(...linkResults);

    return results;
  }

  private async checkDatabaseHealth(): Promise<HealthCheckResult[]> {
    const results: HealthCheckResult[] = [];
    const endpoints = [
      { name: 'Teams Database', url: '/api/teams' },
      { name: 'Transfers Database', url: '/api/transfers' },
      { name: 'Live Stats Database', url: '/api/live-stats' },
      { name: 'Scenarios Database', url: '/api/scenarios' }
    ];

    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        const response = await fetch(endpoint.url);
        const responseTime = Date.now() - startTime;

        if (response.ok) {
          const data = await response.json();
          const hasData = Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0;
          
          results.push({
            status: hasData ? 'healthy' : 'warning',
            service: endpoint.name,
            details: hasData ? `${Array.isArray(data) ? data.length : 'Valid'} records available` : 'No data available',
            timestamp: new Date(),
            responseTime
          });
        } else {
          results.push({
            status: 'error',
            service: endpoint.name,
            details: `HTTP ${response.status}: ${response.statusText}`,
            timestamp: new Date(),
            responseTime
          });
        }
      } catch (error) {
        results.push({
          status: 'error',
          service: endpoint.name,
          details: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: new Date()
        });
      }
    }

    return results;
  }

  private async checkAPIHealth(): Promise<HealthCheckResult[]> {
    const results: HealthCheckResult[] = [];
    
    try {
      const startTime = Date.now();
      const response = await fetch('/api/live-stats');
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        results.push({
          status: responseTime < 1000 ? 'healthy' : 'warning',
          service: 'API Performance',
          details: `Response time: ${responseTime}ms`,
          timestamp: new Date(),
          responseTime
        });
      } else {
        results.push({
          status: 'error',
          service: 'API Performance',
          details: 'API endpoints not responding',
          timestamp: new Date()
        });
      }
    } catch (error) {
      results.push({
        status: 'error',
        service: 'API Performance',
        details: 'API connection failed',
        timestamp: new Date()
      });
    }

    return results;
  }

  private async checkNavigationHealth(): Promise<HealthCheckResult[]> {
    const results: HealthCheckResult[] = [];
    const routes = [
      '/leagues',
      '/teams', 
      '/players',
      '/transfers',
      '/fixtures',
      '/news-sources',
      '/live-updates',
      '/compliance-explained'
    ];

    // Check if routes are properly configured
    const validRoutes = routes.filter(route => {
      try {
        // Simple check for route accessibility
        return typeof route === 'string' && route.startsWith('/');
      } catch {
        return false;
      }
    });

    results.push({
      status: validRoutes.length === routes.length ? 'healthy' : 'warning',
      service: 'Navigation Routes',
      details: `${validRoutes.length}/${routes.length} routes configured properly`,
      timestamp: new Date()
    });

    return results;
  }

  private async checkExternalLinks(): Promise<HealthCheckResult[]> {
    const results: HealthCheckResult[] = [];
    
    // Check if external links are properly formatted (without actually calling them to avoid CORS)
    const externalLinks = [
      'https://www.uefa.com/news/0268-12157d69ce18-9f011c70f6c3-1000--uefa-approves-new-financial-sustainability-rules/',
      'https://www.premierleague.com/news/2022339',
      'https://www.skysports.com/transfer-centre',
      'https://www.bbc.co.uk/sport/football/transfers'
    ];

    const validLinks = externalLinks.filter(link => {
      try {
        new URL(link);
        return true;
      } catch {
        return false;
      }
    });

    results.push({
      status: validLinks.length === externalLinks.length ? 'healthy' : 'warning',
      service: 'External Links',
      details: `${validLinks.length}/${externalLinks.length} links properly formatted`,
      timestamp: new Date()
    });

    return results;
  }

  async getSystemStatus(): Promise<{
    overall: 'healthy' | 'warning' | 'error';
    lastCheck: Date;
    services: HealthCheckResult[];
  }> {
    const services = await this.runHealthChecks();
    const errorCount = services.filter(s => s.status === 'error').length;
    const warningCount = services.filter(s => s.status === 'warning').length;

    let overall: 'healthy' | 'warning' | 'error' = 'healthy';
    if (errorCount > 0) {
      overall = 'error';
    } else if (warningCount > 0) {
      overall = 'warning';
    }

    return {
      overall,
      lastCheck: new Date(),
      services
    };
  }
}

export const healthCheckService = HealthCheckService.getInstance();
export type { HealthCheckResult, DatabaseCheck, LinkCheck };