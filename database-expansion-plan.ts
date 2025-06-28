
export interface LeagueExpansionConfig {
  id: string;
  name: string;
  country: string;
  tier: number;
  priority: 'high' | 'medium' | 'low';
  estimatedTeams: number;
  dataSourcesAvailable: string[];
  implementationPhase: number;
  dependencies: string[];
}

export interface DatabaseExpansionPlan {
  currentPhase: number;
  totalPhases: number;
  completedLeagues: string[];
  inProgressLeagues: string[];
  plannedLeagues: string[];
  estimatedTotalTeams: number;
  estimatedTotalPlayers: number;
}

export class DatabaseExpansionManager {
  private static readonly EXPANSION_PHASES: Record<number, LeagueExpansionConfig[]> = {
    // Phase 1: Top 6 European Leagues (CURRENT)
    1: [
      {
        id: 'premier-league',
        name: 'Premier League',
        country: 'England',
        tier: 1,
        priority: 'high',
        estimatedTeams: 20,
        dataSourcesAvailable: ['Sports Reference', 'Official API', 'Sportmonks'],
        implementationPhase: 1,
        dependencies: []
      },
      {
        id: 'la-liga',
        name: 'La Liga',
        country: 'Spain',
        tier: 1,
        priority: 'high',
        estimatedTeams: 20,
        dataSourcesAvailable: ['Sports Reference', 'Official API', 'Sportmonks'],
        implementationPhase: 1,
        dependencies: []
      },
      {
        id: 'serie-a',
        name: 'Serie A',
        country: 'Italy',
        tier: 1,
        priority: 'high',
        estimatedTeams: 20,
        dataSourcesAvailable: ['Sports Reference', 'Official API', 'Sportmonks'],
        implementationPhase: 1,
        dependencies: []
      },
      {
        id: 'bundesliga',
        name: 'Bundesliga',
        country: 'Germany',
        tier: 1,
        priority: 'high',
        estimatedTeams: 18,
        dataSourcesAvailable: ['Sports Reference', 'Official API', 'Sportmonks'],
        implementationPhase: 1,
        dependencies: []
      },
      {
        id: 'ligue-1',
        name: 'Ligue 1',
        country: 'France',
        tier: 1,
        priority: 'high',
        estimatedTeams: 18,
        dataSourcesAvailable: ['Sports Reference', 'Official API', 'Sportmonks'],
        implementationPhase: 1,
        dependencies: []
      },
      {
        id: 'liga-portugal',
        name: 'Liga Portugal',
        country: 'Portugal',
        tier: 1,
        priority: 'high',
        estimatedTeams: 18,
        dataSourcesAvailable: ['Sports Reference', 'Official API', 'Sportmonks'],
        implementationPhase: 1,
        dependencies: []
      }
    ],

    // Phase 2: Major European Second Tiers + Dutch/Belgian
    2: [
      {
        id: 'championship',
        name: 'Championship',
        country: 'England',
        tier: 2,
        priority: 'high',
        estimatedTeams: 24,
        dataSourcesAvailable: ['Sports Reference', 'Official API'],
        implementationPhase: 2,
        dependencies: ['premier-league']
      },
      {
        id: 'eredivisie',
        name: 'Eredivisie',
        country: 'Netherlands',
        tier: 1,
        priority: 'high',
        estimatedTeams: 18,
        dataSourcesAvailable: ['Sports Reference', 'Official API'],
        implementationPhase: 2,
        dependencies: []
      },
      {
        id: 'pro-league',
        name: 'Belgian Pro League',
        country: 'Belgium',
        tier: 1,
        priority: 'medium',
        estimatedTeams: 16,
        dataSourcesAvailable: ['Sports Reference'],
        implementationPhase: 2,
        dependencies: []
      },
      {
        id: 'segunda-division',
        name: 'Segunda División',
        country: 'Spain',
        tier: 2,
        priority: 'medium',
        estimatedTeams: 22,
        dataSourcesAvailable: ['Sports Reference'],
        implementationPhase: 2,
        dependencies: ['la-liga']
      }
    ],

    // Phase 3: International Expansion
    3: [
      {
        id: 'mls',
        name: 'Major League Soccer',
        country: 'USA',
        tier: 1,
        priority: 'medium',
        estimatedTeams: 29,
        dataSourcesAvailable: ['Official API', 'ESPN'],
        implementationPhase: 3,
        dependencies: []
      },
      {
        id: 'brasileirao',
        name: 'Brasileirão Serie A',
        country: 'Brazil',
        tier: 1,
        priority: 'medium',
        estimatedTeams: 20,
        dataSourcesAvailable: ['Sports Reference'],
        implementationPhase: 3,
        dependencies: []
      },
      {
        id: 'liga-mx',
        name: 'Liga MX',
        country: 'Mexico',
        tier: 1,
        priority: 'medium',
        estimatedTeams: 18,
        dataSourcesAvailable: ['Official API'],
        implementationPhase: 3,
        dependencies: []
      },
      {
        id: 'superliga',
        name: 'Argentine Primera División',
        country: 'Argentina',
        tier: 1,
        priority: 'low',
        estimatedTeams: 26,
        dataSourcesAvailable: ['Sports Reference'],
        implementationPhase: 3,
        dependencies: []
      }
    ],

    // Phase 4: Remaining European + Asian Expansion
    4: [
      {
        id: 'scottish-premiership',
        name: 'Scottish Premiership',
        country: 'Scotland',
        tier: 1,
        priority: 'medium',
        estimatedTeams: 12,
        dataSourcesAvailable: ['Sports Reference'],
        implementationPhase: 4,
        dependencies: []
      },
      {
        id: 'j1-league',
        name: 'J1 League',
        country: 'Japan',
        tier: 1,
        priority: 'medium',
        estimatedTeams: 20,
        dataSourcesAvailable: ['Official API'],
        implementationPhase: 4,
        dependencies: []
      },
      {
        id: 'k-league',
        name: 'K League 1',
        country: 'South Korea',
        tier: 1,
        priority: 'low',
        estimatedTeams: 12,
        dataSourcesAvailable: ['Official API'],
        implementationPhase: 4,
        dependencies: []
      },
      {
        id: 'a-league',
        name: 'A-League Men',
        country: 'Australia',
        tier: 1,
        priority: 'low',
        estimatedTeams: 12,
        dataSourcesAvailable: ['Official API'],
        implementationPhase: 4,
        dependencies: []
      }
    ]
  };

  static getCurrentExpansionPlan(): DatabaseExpansionPlan {
    const currentPhase = 1; // Currently implementing Phase 1
    const allLeagues = Object.values(this.EXPANSION_PHASES).flat();
    
    const completedLeagues = this.EXPANSION_PHASES[1]?.map(l => l.id) || [];
    const inProgressLeagues: string[] = []; // Phase 1 leagues currently being implemented
    const plannedLeagues = allLeagues.filter(l => l.implementationPhase > currentPhase).map(l => l.id);

    const estimatedTotalTeams = allLeagues.reduce((sum, league) => sum + league.estimatedTeams, 0);
    const estimatedTotalPlayers = estimatedTotalTeams * 25; // Average 25 players per team

    return {
      currentPhase,
      totalPhases: Math.max(...Object.keys(this.EXPANSION_PHASES).map(Number)),
      completedLeagues,
      inProgressLeagues,
      plannedLeagues,
      estimatedTotalTeams,
      estimatedTotalPlayers
    };
  }

  static getLeaguesByPhase(phase: number): LeagueExpansionConfig[] {
    return this.EXPANSION_PHASES[phase] || [];
  }

  static getLeagueConfig(leagueId: string): LeagueExpansionConfig | null {
    const allLeagues = Object.values(this.EXPANSION_PHASES).flat();
    return allLeagues.find(league => league.id === leagueId) || null;
  }

  static getImplementationPriority(): LeagueExpansionConfig[] {
    const allLeagues = Object.values(this.EXPANSION_PHASES).flat();
    return allLeagues.sort((a, b) => {
      // Sort by phase first, then by priority
      if (a.implementationPhase !== b.implementationPhase) {
        return a.implementationPhase - b.implementationPhase;
      }
      
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  static validateDependencies(leagueId: string): { canImplement: boolean, missingDependencies: string[] } {
    const league = this.getLeagueConfig(leagueId);
    if (!league) {
      return { canImplement: false, missingDependencies: ['League not found'] };
    }

    const completedLeagues = this.getCurrentExpansionPlan().completedLeagues;
    const missingDependencies = league.dependencies.filter(dep => !completedLeagues.includes(dep));

    return {
      canImplement: missingDependencies.length === 0,
      missingDependencies
    };
  }

  static getExpansionTimeline(): { phase: number, leagues: string[], estimatedTeams: number, estimatedDuration: string }[] {
    return Object.entries(this.EXPANSION_PHASES).map(([phase, leagues]) => ({
      phase: parseInt(phase),
      leagues: leagues.map(l => l.name),
      estimatedTeams: leagues.reduce((sum, l) => sum + l.estimatedTeams, 0),
      estimatedDuration: phase === '1' ? '3-4 months' : 
                        phase === '2' ? '4-6 months' : 
                        phase === '3' ? '6-8 months' : '8-12 months'
    }));
  }

  static generateDataSourceRequirements(): Record<string, { required: string[], optional: string[] }> {
    const allLeagues = Object.values(this.EXPANSION_PHASES).flat();
    const requirements: Record<string, { required: string[], optional: string[] }> = {};

    allLeagues.forEach(league => {
      requirements[league.id] = {
        required: league.dataSourcesAvailable.slice(0, 1), // First source is required
        optional: league.dataSourcesAvailable.slice(1) // Rest are optional fallbacks
      };
    });

    return requirements;
  }

  static estimateResourceRequirements(phase: number): {
    developmentTime: string,
    dataStorageGB: number,
    apiCallsPerDay: number,
    serverCapacity: string
  } {
    const leagues = this.getLeaguesByPhase(phase);
    const totalTeams = leagues.reduce((sum, l) => sum + l.estimatedTeams, 0);
    const totalPlayers = totalTeams * 25;

    return {
      developmentTime: phase === 1 ? '2-3 months' : 
                      phase === 2 ? '3-4 months' : 
                      phase === 3 ? '4-6 months' : '6-8 months',
      dataStorageGB: Math.ceil((totalTeams * 0.5) + (totalPlayers * 0.1)), // Estimated storage
      apiCallsPerDay: totalTeams * 100 + totalPlayers * 10, // Estimated API usage
      serverCapacity: totalTeams > 100 ? 'High' : totalTeams > 50 ? 'Medium' : 'Low'
    };
  }
}
