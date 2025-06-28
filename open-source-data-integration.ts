// Open Source Data Integration Service for Continuous Database Updates
export interface DataSource {
  id: string;
  name: string;
  type: 'api' | 'scraper' | 'feed' | 'file';
  url: string;
  description: string;
  updateFrequency: 'real-time' | 'hourly' | 'daily' | 'weekly';
  dataTypes: string[];
  reliability: number;
  isActive: boolean;
  lastUpdated: Date;
  cost: 'free' | 'freemium' | 'paid';
  authRequired: boolean;
}

export interface DataUpdate {
  sourceId: string;
  timestamp: Date;
  recordsUpdated: number;
  dataType: string;
  status: 'success' | 'partial' | 'failed';
  errors?: string[];
  changes: DataChange[];
}

export interface DataChange {
  type: 'create' | 'update' | 'delete';
  entity: string;
  entityId: string;
  field: string;
  oldValue: any;
  newValue: any;
  confidence: number;
}

export class OpenSourceDataIntegrationService {
  // Free Open Source Data Sources
  private static readonly DATA_SOURCES: DataSource[] = [
    {
      id: 'football-data-org',
      name: 'Football-Data.org',
      type: 'api',
      url: 'https://api.football-data.org/v4',
      description: 'Free tier includes league tables, fixtures, and basic team data',
      updateFrequency: 'daily',
      dataTypes: ['fixtures', 'results', 'standings', 'teams', 'competitions'],
      reliability: 90,
      isActive: true,
      lastUpdated: new Date(),
      cost: 'freemium',
      authRequired: true
    },
    {
      id: 'fbref-scraper',
      name: 'FBRef Data Scraper',
      type: 'scraper',
      url: 'https://fbref.com',
      description: 'Comprehensive player and team statistics from Sports Reference',
      updateFrequency: 'daily',
      dataTypes: ['player_stats', 'team_stats', 'match_data', 'advanced_metrics'],
      reliability: 95,
      isActive: true,
      lastUpdated: new Date(),
      cost: 'free',
      authRequired: false
    },
    {
      id: 'transfermarkt-scraper',
      name: 'Transfermarkt Data',
      type: 'scraper',
      url: 'https://www.transfermarkt.com',
      description: 'Market values, transfer history, and player data',
      updateFrequency: 'weekly',
      dataTypes: ['market_values', 'transfers', 'player_profiles', 'contract_data'],
      reliability: 88,
      isActive: true,
      lastUpdated: new Date(),
      cost: 'free',
      authRequired: false
    },
    {
      id: 'github-football-data',
      name: 'GitHub Football Datasets',
      type: 'file',
      url: 'https://github.com/openfootball',
      description: 'Open football data including fixtures, results, and team information',
      updateFrequency: 'weekly',
      dataTypes: ['fixtures', 'results', 'teams', 'leagues'],
      reliability: 85,
      isActive: true,
      lastUpdated: new Date(),
      cost: 'free',
      authRequired: false
    },
    {
      id: 'espn-rss',
      name: 'ESPN Football RSS',
      type: 'feed',
      url: 'https://www.espn.com/espn/rss/soccer/news',
      description: 'Real-time football news and transfer updates',
      updateFrequency: 'real-time',
      dataTypes: ['news', 'transfers', 'injuries', 'lineup_changes'],
      reliability: 82,
      isActive: true,
      lastUpdated: new Date(),
      cost: 'free',
      authRequired: false
    },
    {
      id: 'bbc-sport-rss',
      name: 'BBC Sport RSS',
      type: 'feed',
      url: 'https://feeds.bbci.co.uk/sport/football/rss.xml',
      description: 'Reliable football news and match reports',
      updateFrequency: 'real-time',
      dataTypes: ['news', 'match_reports', 'team_news'],
      reliability: 94,
      isActive: true,
      lastUpdated: new Date(),
      cost: 'free',
      authRequired: false
    },
    {
      id: 'wikimedia-sports',
      name: 'Wikimedia Sports Data',
      type: 'api',
      url: 'https://commons.wikimedia.org/wiki/Category:Association_football_data',
      description: 'Open access sports data and statistics',
      updateFrequency: 'weekly',
      dataTypes: ['historical_data', 'player_profiles', 'team_history'],
      reliability: 78,
      isActive: true,
      lastUpdated: new Date(),
      cost: 'free',
      authRequired: false
    },
    {
      id: 'rapid-api-free',
      name: 'RapidAPI Football (Free Tier)',
      type: 'api',
      url: 'https://rapidapi.com/api-sports/api/football',
      description: 'Basic football data with free tier limitations',
      updateFrequency: 'daily',
      dataTypes: ['live_scores', 'fixtures', 'standings'],
      reliability: 87,
      isActive: true,
      lastUpdated: new Date(),
      cost: 'freemium',
      authRequired: true
    }
  ];

  // Update tracking
  private static updateHistory: DataUpdate[] = [];
  private static readonly MAX_HISTORY_ENTRIES = 1000;

  static async initializeDataSources(): Promise<void> {
    console.log('🔄 Initializing open source data integration...');
    
    for (const source of this.DATA_SOURCES) {
      if (source.isActive) {
        await this.testDataSourceConnection(source);
      }
    }
    
    console.log('✅ Data source initialization completed');
  }

  static async testDataSourceConnection(source: DataSource): Promise<boolean> {
    try {
      console.log(`Testing connection to ${source.name}...`);
      
      switch (source.type) {
        case 'api':
          return await this.testAPIConnection(source);
        case 'scraper':
          return await this.testScraperConnection(source);
        case 'feed':
          return await this.testFeedConnection(source);
        case 'file':
          return await this.testFileConnection(source);
        default:
          return false;
      }
    } catch (error) {
      console.warn(`Connection test failed for ${source.name}:`, error);
      return false;
    }
  }

  private static async testAPIConnection(source: DataSource): Promise<boolean> {
    try {
      // Test basic connectivity
      const response = await fetch(source.url, {
        method: 'HEAD',
        headers: this.getHeaders(source)
      });
      
      return response.ok || response.status === 404; // 404 acceptable for API endpoints
    } catch {
      return false;
    }
  }

  private static async testScraperConnection(source: DataSource): Promise<boolean> {
    try {
      const response = await fetch(source.url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; FootballAnalytics/1.0)'
        }
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }

  private static async testFeedConnection(source: DataSource): Promise<boolean> {
    try {
      const response = await fetch(source.url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  private static async testFileConnection(source: DataSource): Promise<boolean> {
    try {
      const response = await fetch(source.url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  private static getHeaders(source: DataSource): Record<string, string> {
    const headers: Record<string, string> = {
      'User-Agent': 'FootballAnalytics/1.0',
      'Accept': 'application/json'
    };

    // Add authentication headers if needed
    if (source.authRequired) {
      const apiKey = this.getAPIKey(source.id);
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }
    }

    return headers;
  }

  private static getAPIKey(sourceId: string): string | null {
    const keyMap: Record<string, string> = {
      'football-data-org': process.env.FOOTBALL_DATA_API_KEY || '',
      'rapid-api-free': process.env.RAPIDAPI_KEY || ''
    };

    return keyMap[sourceId] || null;
  }

  // Football-Data.org Integration
  static async fetchFootballDataOrg(endpoint: string): Promise<any> {
    const source = this.DATA_SOURCES.find(s => s.id === 'football-data-org');
    if (!source || !source.isActive) return null;

    const apiKey = this.getAPIKey('football-data-org');
    if (!apiKey) {
      console.warn('Football-Data.org API key not available');
      return null;
    }

    try {
      const response = await fetch(`${source.url}/${endpoint}`, {
        headers: {
          'X-Auth-Token': apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Log successful update
      this.logDataUpdate({
        sourceId: source.id,
        timestamp: new Date(),
        recordsUpdated: Array.isArray(data) ? data.length : 1,
        dataType: endpoint,
        status: 'success',
        changes: []
      });

      return data;
    } catch (error) {
      console.error(`Football-Data.org API error:`, error);
      
      this.logDataUpdate({
        sourceId: source.id,
        timestamp: new Date(),
        recordsUpdated: 0,
        dataType: endpoint,
        status: 'failed',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        changes: []
      });

      return null;
    }
  }

  // RSS Feed Integration
  static async fetchRSSFeed(sourceId: string): Promise<any[]> {
    const source = this.DATA_SOURCES.find(s => s.id === sourceId);
    if (!source || source.type !== 'feed') return [];

    try {
      // Use RSS to JSON converter service
      const rssToJsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;
      
      const response = await fetch(rssToJsonUrl);
      if (!response.ok) {
        throw new Error(`RSS fetch failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error(`RSS parsing failed: ${data.message}`);
      }

      const articles = data.items || [];
      
      this.logDataUpdate({
        sourceId: source.id,
        timestamp: new Date(),
        recordsUpdated: articles.length,
        dataType: 'rss_articles',
        status: 'success',
        changes: []
      });

      return articles.map((item: any) => ({
        title: item.title,
        description: item.description,
        link: item.link,
        pubDate: new Date(item.pubDate),
        source: source.name,
        category: this.categorizeRSSItem(item.title + ' ' + item.description)
      }));

    } catch (error) {
      console.error(`RSS fetch error for ${source.name}:`, error);
      
      this.logDataUpdate({
        sourceId: source.id,
        timestamp: new Date(),
        recordsUpdated: 0,
        dataType: 'rss_articles',
        status: 'failed',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        changes: []
      });

      return [];
    }
  }

  private static categorizeRSSItem(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('transfer') || lowerText.includes('signing')) return 'transfer';
    if (lowerText.includes('injury') || lowerText.includes('injured')) return 'injury';
    if (lowerText.includes('lineup') || lowerText.includes('team news')) return 'team_news';
    if (lowerText.includes('match') || lowerText.includes('result')) return 'match';
    
    return 'general';
  }

  // GitHub Football Data Integration
  static async fetchGitHubFootballData(): Promise<any> {
    const source = this.DATA_SOURCES.find(s => s.id === 'github-football-data');
    if (!source) return null;

    try {
      // Fetch specific dataset - Premier League fixtures
      const apiUrl = 'https://api.github.com/repos/openfootball/football.json/contents/2024-25/en.1.json';
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`GitHub API request failed: ${response.status}`);
      }

      const fileData = await response.json();
      
      if (fileData.content) {
        // Decode base64 content
        const content = atob(fileData.content);
        const data = JSON.parse(content);
        
        this.logDataUpdate({
          sourceId: source.id,
          timestamp: new Date(),
          recordsUpdated: data.matches?.length || 0,
          dataType: 'fixtures',
          status: 'success',
          changes: []
        });

        return data;
      }

      return null;
    } catch (error) {
      console.error('GitHub football data fetch error:', error);
      
      this.logDataUpdate({
        sourceId: source.id,
        timestamp: new Date(),
        recordsUpdated: 0,
        dataType: 'fixtures',
        status: 'failed',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        changes: []
      });

      return null;
    }
  }

  // Automated Update Scheduler
  static startAutomatedUpdates(): void {
    console.log('🔄 Starting automated data updates...');

    // Real-time updates (RSS feeds)
    setInterval(() => {
      this.updateRSSFeeds();
    }, 5 * 60 * 1000); // Every 5 minutes

    // Hourly updates
    setInterval(() => {
      this.updateHourlyData();
    }, 60 * 60 * 1000); // Every hour

    // Daily updates
    setInterval(() => {
      this.updateDailyData();
    }, 24 * 60 * 60 * 1000); // Every 24 hours

    // Weekly updates
    setInterval(() => {
      this.updateWeeklyData();
    }, 7 * 24 * 60 * 60 * 1000); // Every week

    console.log('✅ Automated update scheduler started');
  }

  private static async updateRSSFeeds(): Promise<void> {
    const rssFeeds = this.DATA_SOURCES.filter(s => s.type === 'feed' && s.updateFrequency === 'real-time');
    
    for (const feed of rssFeeds) {
      if (feed.isActive) {
        await this.fetchRSSFeed(feed.id);
      }
    }
  }

  private static async updateHourlyData(): Promise<void> {
    // Update data that needs hourly refresh
    console.log('🔄 Performing hourly data updates...');
    
    // Example: Live scores, breaking news
    const hourlySources = this.DATA_SOURCES.filter(s => s.updateFrequency === 'hourly');
    
    for (const source of hourlySources) {
      if (source.isActive) {
        await this.testDataSourceConnection(source);
      }
    }
  }

  private static async updateDailyData(): Promise<void> {
    console.log('🔄 Performing daily data updates...');
    
    // Update standings, fixtures, player stats
    const dailySources = this.DATA_SOURCES.filter(s => s.updateFrequency === 'daily');
    
    for (const source of dailySources) {
      if (source.isActive) {
        switch (source.id) {
          case 'football-data-org':
            await this.fetchFootballDataOrg('competitions/PL/standings');
            await this.fetchFootballDataOrg('competitions/PL/matches');
            break;
          case 'fbref-scraper':
            // Placeholder for FBRef data update
            console.log(`Updating ${source.name}...`);
            break;
        }
      }
    }
  }

  private static async updateWeeklyData(): Promise<void> {
    console.log('🔄 Performing weekly data updates...');
    
    // Update market values, transfer data, historical records
    const weeklySources = this.DATA_SOURCES.filter(s => s.updateFrequency === 'weekly');
    
    for (const source of weeklySources) {
      if (source.isActive) {
        switch (source.id) {
          case 'github-football-data':
            await this.fetchGitHubFootballData();
            break;
          case 'transfermarkt-scraper':
            // Placeholder for Transfermarkt data update
            console.log(`Updating ${source.name}...`);
            break;
        }
      }
    }
  }

  private static logDataUpdate(update: DataUpdate): void {
    this.updateHistory.unshift(update);
    
    // Keep history size manageable
    if (this.updateHistory.length > this.MAX_HISTORY_ENTRIES) {
      this.updateHistory = this.updateHistory.slice(0, this.MAX_HISTORY_ENTRIES);
    }

    console.log(`Data update logged: ${update.sourceId} - ${update.status} - ${update.recordsUpdated} records`);
  }

  // Getters and utilities
  static getDataSources(): DataSource[] {
    return [...this.DATA_SOURCES];
  }

  static getActiveDataSources(): DataSource[] {
    return this.DATA_SOURCES.filter(s => s.isActive);
  }

  static getDataSourcesByType(type: string): DataSource[] {
    return this.DATA_SOURCES.filter(s => s.type === type);
  }

  static getUpdateHistory(limit: number = 50): DataUpdate[] {
    return this.updateHistory.slice(0, limit);
  }

  static getDataSourceStats(): {
    total: number;
    active: number;
    byType: Record<string, number>;
    byCost: Record<string, number>;
    reliability: number;
  } {
    const active = this.getActiveDataSources();
    
    return {
      total: this.DATA_SOURCES.length,
      active: active.length,
      byType: this.DATA_SOURCES.reduce((acc, source) => {
        acc[source.type] = (acc[source.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byCost: this.DATA_SOURCES.reduce((acc, source) => {
        acc[source.cost] = (acc[source.cost] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      reliability: active.reduce((sum, source) => sum + source.reliability, 0) / active.length
    };
  }

  static toggleDataSource(sourceId: string, active: boolean): void {
    const source = this.DATA_SOURCES.find(s => s.id === sourceId);
    if (source) {
      source.isActive = active;
      console.log(`Data source ${source.name} ${active ? 'activated' : 'deactivated'}`);
    }
  }

  static async forceUpdate(sourceId?: string): Promise<void> {
    if (sourceId) {
      const source = this.DATA_SOURCES.find(s => s.id === sourceId);
      if (source && source.isActive) {
        await this.testDataSourceConnection(source);
      }
    } else {
      // Update all active sources
      await this.updateRSSFeeds();
      await this.updateDailyData();
    }
  }
}