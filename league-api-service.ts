// Intelligent League API Service for official fixtures data synchronization

export interface LeagueAPIConfig {
  id: string;
  name: string;
  apiEndpoint: string;
  authHeaders: Record<string, string>;
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  dataMapping: {
    fixtureId: string;
    homeTeam: string;
    awayTeam: string;
    date: string;
    venue: string;
    status: string;
    homeScore?: string;
    awayScore?: string;
  };
  lastSync: Date | null;
  nextSync: Date | null;
  isActive: boolean;
  reliability: number;
}

export interface OfficialFixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  league: string;
  status: "scheduled" | "live" | "finished" | "postponed" | "cancelled";
  homeScore?: number;
  awayScore?: number;
  round: string;
  matchday: number;
  referee?: string;
  attendance?: number;
  weather?: {
    temperature: number;
    conditions: string;
  };
  lastUpdated: Date;
  sourceApi: string;
  reliability: number;
}

export interface SyncResult {
  success: boolean;
  league: string;
  fixturesUpdated: number;
  newFixtures: number;
  errors: string[];
  syncTime: Date;
  nextSyncScheduled: Date;
  apiResponseTime: number;
}

class LeagueAPIService {
  private apiConfigs: Map<string, LeagueAPIConfig> = new Map();
  private syncIntervals: Map<string, NodeJS.Timeout> = new Map();
  private rateLimitTrackers: Map<string, { count: number; resetTime: Date }> = new Map();

  constructor() {
    try {
      // Initialize configs but prevent automatic sync to avoid errors
      this.initializeAPIConfigs();
      
      // Don't auto-start sync to prevent runtime errors
      // Sync will only be triggered manually through UI
    } catch (error) {
      console.warn('Failed to initialize league API service:', error);
    }
  }

  private initializeAPIConfigs(): void {
    const configs: LeagueAPIConfig[] = [
      {
        id: "premier-league",
        name: "Premier League",
        apiEndpoint: "https://api.football-data.org/v4/competitions/PL/matches",
        authHeaders: {
          "X-Auth-Token": "ccaa2d9c03d0417faa9aeb8e8c02fd0b"
        },
        rateLimits: {
          requestsPerMinute: 10,
          requestsPerHour: 200,
          requestsPerDay: 2000
        },
        dataMapping: {
          fixtureId: "id",
          homeTeam: "homeTeam.name",
          awayTeam: "awayTeam.name",
          date: "utcDate",
          venue: "venue",
          status: "status",
          homeScore: "score.fullTime.home",
          awayScore: "score.fullTime.away"
        },
        lastSync: null,
        nextSync: new Date(),
        isActive: true,
        reliability: 98
      },
      {
        id: "la-liga",
        name: "La Liga",
        apiEndpoint: "https://api.football-data.org/v4/competitions/PD/matches",
        authHeaders: {
          "X-Auth-Token": "ccaa2d9c03d0417faa9aeb8e8c02fd0b"
        },
        rateLimits: {
          requestsPerMinute: 10,
          requestsPerHour: 200,
          requestsPerDay: 2000
        },
        dataMapping: {
          fixtureId: "id",
          homeTeam: "homeTeam.name",
          awayTeam: "awayTeam.name",
          date: "utcDate",
          venue: "venue",
          status: "status",
          homeScore: "score.fullTime.home",
          awayScore: "score.fullTime.away"
        },
        lastSync: null,
        nextSync: new Date(),
        isActive: true,
        reliability: 97
      },
      {
        id: "serie-a",
        name: "Serie A",
        apiEndpoint: "https://api.football-data.org/v4/competitions/SA/matches",
        authHeaders: {
          "X-Auth-Token": "ccaa2d9c03d0417faa9aeb8e8c02fd0b"
        },
        rateLimits: {
          requestsPerMinute: 10,
          requestsPerHour: 200,
          requestsPerDay: 2000
        },
        dataMapping: {
          fixtureId: "id",
          homeTeam: "homeTeam.name",
          awayTeam: "awayTeam.name",
          date: "utcDate",
          venue: "venue",
          status: "status",
          homeScore: "score.fullTime.home",
          awayScore: "score.fullTime.away"
        },
        lastSync: null,
        nextSync: new Date(),
        isActive: true,
        reliability: 96
      },
      {
        id: "bundesliga",
        name: "Bundesliga",
        apiEndpoint: "https://api.football-data.org/v4/competitions/BL1/matches",
        authHeaders: {
          "X-Auth-Token": "ccaa2d9c03d0417faa9aeb8e8c02fd0b"
        },
        rateLimits: {
          requestsPerMinute: 10,
          requestsPerHour: 200,
          requestsPerDay: 2000
        },
        dataMapping: {
          fixtureId: "id",
          homeTeam: "homeTeam.name",
          awayTeam: "awayTeam.name",
          date: "utcDate",
          venue: "venue",
          status: "status",
          homeScore: "score.fullTime.home",
          awayScore: "score.fullTime.away"
        },
        lastSync: null,
        nextSync: new Date(),
        isActive: true,
        reliability: 95
      },
      {
        id: "ligue-1",
        name: "Ligue 1",
        apiEndpoint: "https://api.football-data.org/v4/competitions/FL1/matches",
        authHeaders: {
          "X-Auth-Token": "ccaa2d9c03d0417faa9aeb8e8c02fd0b"
        },
        rateLimits: {
          requestsPerMinute: 10,
          requestsPerHour: 200,
          requestsPerDay: 2000
        },
        dataMapping: {
          fixtureId: "id",
          homeTeam: "homeTeam.name",
          awayTeam: "awayTeam.name",
          date: "utcDate",
          venue: "venue",
          status: "status",
          homeScore: "score.fullTime.home",
          awayScore: "score.fullTime.away"
        },
        lastSync: null,
        nextSync: new Date(),
        isActive: true,
        reliability: 94
      }
    ];

    configs.forEach(config => {
      this.apiConfigs.set(config.id, config);
    });
  }

  private startIntelligentSync(): void {
    try {
      // Only start sync when explicitly requested to prevent errors
      console.log('Intelligent sync available - trigger manually through UI');
    } catch (error) {
      console.warn('Failed to start intelligent sync:', error);
    }
  }

  // Method to manually start sync when requested
  startManualSync(): void {
    try {
      this.apiConfigs.forEach((config, leagueId) => {
        if (config.isActive) {
          try {
            this.scheduleLeagueSync(leagueId);
          } catch (error) {
            console.warn(`Failed to schedule sync for ${leagueId}:`, error);
          }
        }
      });
    } catch (error) {
      console.warn('Failed to start manual sync:', error);
    }
  }

  private scheduleLeagueSync(leagueId: string): void {
    const config = this.apiConfigs.get(leagueId);
    if (!config) return;

    // Calculate intelligent sync interval based on match density and time
    const syncInterval = this.calculateSyncInterval(config);
    
    const intervalId = setInterval(async () => {
      await this.syncLeagueFixtures(leagueId);
    }, syncInterval);

    this.syncIntervals.set(leagueId, intervalId);
    
    // Don't perform automatic initial sync - only when manually triggered
    console.log(`Sync scheduled for ${leagueId} - ready for manual trigger`);
  }

  private calculateSyncInterval(config: LeagueAPIConfig): number {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    // Base interval: 2 minutes for testing, will adjust based on activity
    let interval = 2 * 60 * 1000;

    // Increase frequency during match days (weekends)
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
      interval = 1 * 60 * 1000; // 1 minute
    }

    // Increase frequency during typical match hours (12-22)
    if (hour >= 12 && hour <= 22) {
      interval = Math.floor(interval / 2); // Half the interval
    }

    // Respect rate limits - ensure we don't exceed 10 requests per minute
    const minInterval = Math.ceil(60000 / config.rateLimits.requestsPerMinute);
    return Math.max(interval, minInterval);
  }

  async syncLeagueFixtures(leagueId: string): Promise<SyncResult> {
    const config = this.apiConfigs.get(leagueId);
    if (!config) {
      throw new Error(`League configuration not found: ${leagueId}`);
    }

    const startTime = Date.now();
    
    try {
      // Check rate limits
      if (!this.checkRateLimit(leagueId)) {
        return {
          success: false,
          league: config.name,
          fixturesUpdated: 0,
          newFixtures: 0,
          errors: ["Rate limit exceeded"],
          syncTime: new Date(),
          nextSyncScheduled: new Date(Date.now() + 60000),
          apiResponseTime: 0
        };
      }

      // Fetch data from official API
      const fixtures = await this.fetchOfficialFixtures(config);
      
      // Process and store fixtures
      const result = await this.processFixtures(fixtures, config);
      
      // Update sync tracking
      config.lastSync = new Date();
      config.nextSync = new Date(Date.now() + this.calculateSyncInterval(config));
      
      const apiResponseTime = Date.now() - startTime;
      
      return {
        success: true,
        league: config.name,
        fixturesUpdated: result.updated,
        newFixtures: result.new,
        errors: [],
        syncTime: new Date(),
        nextSyncScheduled: config.nextSync,
        apiResponseTime
      };

    } catch (error) {
      console.error(`Sync failed for ${config.name}:`, error);
      
      return {
        success: false,
        league: config.name,
        fixturesUpdated: 0,
        newFixtures: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        syncTime: new Date(),
        nextSyncScheduled: new Date(Date.now() + 300000), // Retry in 5 minutes
        apiResponseTime: Date.now() - startTime
      };
    }
  }

  private async fetchOfficialFixtures(config: LeagueAPIConfig): Promise<any[]> {
    // Add query parameters for better data coverage
    const url = new URL(config.apiEndpoint);
    url.searchParams.set('limit', '50');
    url.searchParams.set('status', 'SCHEDULED,IN_PLAY,FINISHED');
    
    const response = await fetch(url.toString(), {
      headers: {
        ...config.authHeaders,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`Fetched ${data.matches?.length || 0} fixtures for ${config.name}`);
    return data.matches || data.fixtures || [];
  }

  private async processFixtures(rawFixtures: any[], config: LeagueAPIConfig): Promise<{ updated: number; new: number }> {
    let updated = 0;
    let newCount = 0;

    for (const rawFixture of rawFixtures) {
      try {
        const fixture = this.mapFixtureData(rawFixture, config);
        
        // Check if fixture exists (simplified for this implementation)
        const existingFixture = this.getStoredFixture(fixture.id);
        
        if (existingFixture) {
          if (this.hasFixtureChanged(existingFixture, fixture)) {
            await this.updateStoredFixture(fixture);
            updated++;
          }
        } else {
          await this.storeNewFixture(fixture);
          newCount++;
        }
      } catch (error) {
        console.error('Error processing fixture:', error);
      }
    }

    return { updated, new: newCount };
  }

  private mapFixtureData(rawFixture: any, config: LeagueAPIConfig): OfficialFixture {
    const mapping = config.dataMapping;
    
    return {
      id: this.getNestedValue(rawFixture, mapping.fixtureId),
      homeTeam: this.getNestedValue(rawFixture, mapping.homeTeam),
      awayTeam: this.getNestedValue(rawFixture, mapping.awayTeam),
      date: this.getNestedValue(rawFixture, mapping.date),
      time: new Date(this.getNestedValue(rawFixture, mapping.date)).toTimeString().substring(0, 5),
      venue: this.getNestedValue(rawFixture, mapping.venue) || "TBD",
      league: config.name,
      status: this.mapStatus(this.getNestedValue(rawFixture, mapping.status)),
      homeScore: mapping.homeScore ? this.getNestedValue(rawFixture, mapping.homeScore) : undefined,
      awayScore: mapping.awayScore ? this.getNestedValue(rawFixture, mapping.awayScore) : undefined,
      round: rawFixture.matchday ? `Matchday ${rawFixture.matchday}` : "Regular Season",
      matchday: rawFixture.matchday || 1,
      referee: rawFixture.referees?.[0]?.name,
      lastUpdated: new Date(),
      sourceApi: config.id,
      reliability: config.reliability
    };
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private mapStatus(apiStatus: string): "scheduled" | "live" | "finished" | "postponed" | "cancelled" {
    const statusMap: Record<string, "scheduled" | "live" | "finished" | "postponed" | "cancelled"> = {
      'SCHEDULED': 'scheduled',
      'TIMED': 'scheduled',
      'IN_PLAY': 'live',
      'PAUSED': 'live',
      'FINISHED': 'finished',
      'POSTPONED': 'postponed',
      'CANCELLED': 'cancelled',
      'AWARDED': 'finished'
    };

    return statusMap[apiStatus] || 'scheduled';
  }

  private checkRateLimit(leagueId: string): boolean {
    const config = this.apiConfigs.get(leagueId);
    if (!config) return false;

    const tracker = this.rateLimitTrackers.get(leagueId);
    const now = new Date();

    if (!tracker || now >= tracker.resetTime) {
      // Reset rate limit tracker
      this.rateLimitTrackers.set(leagueId, {
        count: 1,
        resetTime: new Date(now.getTime() + 60000) // Reset every minute
      });
      return true;
    }

    if (tracker.count >= config.rateLimits.requestsPerMinute) {
      return false; // Rate limit exceeded
    }

    tracker.count++;
    return true;
  }

  // Simplified storage methods (in production, these would interact with a database)
  private getStoredFixture(id: string): OfficialFixture | null {
    const stored = localStorage.getItem(`fixture_${id}`);
    return stored ? JSON.parse(stored) : null;
  }

  private hasFixtureChanged(existing: OfficialFixture, updated: OfficialFixture): boolean {
    return (
      existing.status !== updated.status ||
      existing.homeScore !== updated.homeScore ||
      existing.awayScore !== updated.awayScore ||
      existing.date !== updated.date
    );
  }

  private async updateStoredFixture(fixture: OfficialFixture): Promise<void> {
    localStorage.setItem(`fixture_${fixture.id}`, JSON.stringify(fixture));
  }

  private async storeNewFixture(fixture: OfficialFixture): Promise<void> {
    localStorage.setItem(`fixture_${fixture.id}`, JSON.stringify(fixture));
  }

  // Public methods for managing sync
  async forceSyncAllLeagues(): Promise<SyncResult[]> {
    const results: SyncResult[] = [];
    
    for (const [leagueId] of this.apiConfigs) {
      try {
        const result = await this.syncLeagueFixtures(leagueId);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          league: this.apiConfigs.get(leagueId)?.name || leagueId,
          fixturesUpdated: 0,
          newFixtures: 0,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          syncTime: new Date(),
          nextSyncScheduled: new Date(Date.now() + 300000),
          apiResponseTime: 0
        });
      }
    }

    return results;
  }

  getLeagueConfigs(): LeagueAPIConfig[] {
    return Array.from(this.apiConfigs.values());
  }

  updateLeagueConfig(leagueId: string, updates: Partial<LeagueAPIConfig>): void {
    const config = this.apiConfigs.get(leagueId);
    if (config) {
      Object.assign(config, updates);
      
      // Restart sync if needed
      if (updates.isActive !== undefined) {
        this.stopLeagueSync(leagueId);
        if (updates.isActive) {
          this.scheduleLeagueSync(leagueId);
        }
      }
    }
  }

  private stopLeagueSync(leagueId: string): void {
    const intervalId = this.syncIntervals.get(leagueId);
    if (intervalId) {
      clearInterval(intervalId);
      this.syncIntervals.delete(leagueId);
    }
  }

  getSyncStatus(): {
    activeLeagues: number;
    totalRequests: number;
    lastSync: Date | null;
    nextSync: Date | null;
    errors: string[];
  } {
    const activeLeagues = Array.from(this.apiConfigs.values()).filter(c => c.isActive).length;
    const configs = Array.from(this.apiConfigs.values());
    
    return {
      activeLeagues,
      totalRequests: Array.from(this.rateLimitTrackers.values()).reduce((sum, tracker) => sum + tracker.count, 0),
      lastSync: configs.reduce((latest, config) => {
        if (!config.lastSync) return latest;
        return !latest || config.lastSync > latest ? config.lastSync : latest;
      }, null as Date | null),
      nextSync: configs.reduce((earliest, config) => {
        if (!config.nextSync) return earliest;
        return !earliest || config.nextSync < earliest ? config.nextSync : earliest;
      }, null as Date | null),
      errors: []
    };
  }

  destroy(): void {
    // Clean up all intervals
    this.syncIntervals.forEach(intervalId => clearInterval(intervalId));
    this.syncIntervals.clear();
  }
}

// Create service instance with safer initialization
let leagueAPIService: LeagueAPIService | null = null;

// Only initialize in browser environment to prevent server-side issues
if (typeof window !== 'undefined') {
  try {
    leagueAPIService = new LeagueAPIService();
  } catch (error) {
    console.warn('Failed to initialize league API service:', error);
    leagueAPIService = null;
  }
}

// Create a safe proxy that handles null service
const safeLeagueAPIService = {
  forceSyncAllLeagues: () => {
    if (leagueAPIService) {
      // Start manual sync first, then force sync
      leagueAPIService.startManualSync();
      return leagueAPIService.forceSyncAllLeagues();
    }
    return Promise.resolve([]);
  },
  getLeagueConfigs: () => {
    if (leagueAPIService) {
      return leagueAPIService.getLeagueConfigs();
    }
    return [];
  },
  updateLeagueConfig: (leagueId: string, updates: any) => {
    if (leagueAPIService) {
      return leagueAPIService.updateLeagueConfig(leagueId, updates);
    }
  },
  getSyncStatus: () => {
    if (leagueAPIService) {
      return leagueAPIService.getSyncStatus();
    }
    return {
      activeLeagues: 0,
      totalRequests: 0,
      lastSync: null,
      nextSync: null,
      errors: []
    };
  },
  destroy: () => {
    if (leagueAPIService) {
      leagueAPIService.destroy();
    }
  }
};

export { safeLeagueAPIService as leagueAPIService };
export default safeLeagueAPIService;