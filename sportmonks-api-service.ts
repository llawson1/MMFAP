// Sportmonks API Service for Authentic Football Data
// Documentation: https://docs.sportmonks.com/football/

interface SportmonksPlayer {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  fullname: string;
  image_path: string;
  height: number;
  weight: number;
  date_of_birth: string;
  nationality: string;
  position_id: number;
  detailed_position_id: number;
  current_team_id: number;
  market_value?: number;
}

interface SportmonksTeam {
  id: number;
  name: string;
  short_code: string;
  country_id: number;
  national_team: boolean;
  founded: number;
  logo_path: string;
  venue_id: number;
}

interface SportmonksStatistic {
  player_id: number;
  season_id: number;
  team_id: number;
  league_id: number;
  goals: number;
  assists: number;
  appearances: number;
  minutes_played: number;
  yellow_cards: number;
  red_cards: number;
  shots_total: number;
  shots_on_goal: number;
  passes_total: number;
  passes_accuracy: number;
  saves?: number;
  clean_sheets?: number;
}

interface SportmonksLeague {
  id: number;
  name: string;
  short_code: string;
  image_path: string;
  country_id: number;
  is_cup: boolean;
  current_season_id: number;
}

class SportmonksAPIService {
  private apiKey: string;
  private baseUrl = 'https://api.sportmonks.com/v3/football';
  private rateLimitDelay = 1000; // 1 second between requests for free tier

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('api_token', this.apiKey);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Sportmonks API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  // Get all major European leagues
  async getLeagues(): Promise<SportmonksLeague[]> {
    try {
      const response = await this.makeRequest<{ data: SportmonksLeague[] }>('/leagues', {
        include: 'country',
        filters: 'countryFilters:1;8;17;5;46' // England, Spain, Italy, Germany, France
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching leagues:', error);
      return [];
    }
  }

  // Get teams from a specific league
  async getTeamsByLeague(leagueId: number): Promise<SportmonksTeam[]> {
    try {
      const response = await this.makeRequest<{ data: SportmonksTeam[] }>(`/teams/seasons/${leagueId}`, {
        include: 'venue,country'
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching teams for league ${leagueId}:`, error);
      return [];
    }
  }

  // Get players from a specific team
  async getPlayersByTeam(teamId: number): Promise<SportmonksPlayer[]> {
    try {
      const response = await this.makeRequest<{ data: SportmonksPlayer[] }>(`/squads/teams/${teamId}`, {
        include: 'player,position'
      });
      
      // Extract players from squad data
      const players = response.data.map((squad: any) => squad.player).filter(Boolean);
      return players;
    } catch (error) {
      console.error(`Error fetching players for team ${teamId}:`, error);
      return [];
    }
  }

  // Get player statistics for current season
  async getPlayerStatistics(playerId: number, seasonId: number): Promise<SportmonksStatistic[]> {
    try {
      const response = await this.makeRequest<{ data: SportmonksStatistic[] }>(`/statistics/players/${playerId}`, {
        filters: `seasonFilters:${seasonId}`,
        include: 'team,league'
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching statistics for player ${playerId}:`, error);
      return [];
    }
  }

  // Get current season information
  async getCurrentSeasons(): Promise<any[]> {
    try {
      const response = await this.makeRequest<{ data: any[] }>('/seasons', {
        filters: 'currentSeasons',
        include: 'league'
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current seasons:', error);
      return [];
    }
  }

  // Test API connection and get subscription info
  async testConnection(): Promise<{ success: boolean; subscription?: any; error?: string }> {
    try {
      const response = await this.makeRequest<{ subscription: any }>('/my-subscription');
      return {
        success: true,
        subscription: response.subscription
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get comprehensive player data with market value estimation
  async getEnhancedPlayerData(playerId: number): Promise<any> {
    try {
      const [playerResponse, statisticsResponse] = await Promise.all([
        this.makeRequest<{ data: SportmonksPlayer }>(`/players/${playerId}`, {
          include: 'position,team,country'
        }),
        this.makeRequest<{ data: SportmonksStatistic[] }>(`/statistics/players/${playerId}`, {
          include: 'team,league,season'
        })
      ]);

      const player = playerResponse.data;
      const statistics = statisticsResponse.data;

      // Calculate estimated market value based on performance
      const currentSeasonStats = statistics.find(stat => stat.season_id === 22729); // 2024-25 season
      const marketValue = this.estimateMarketValue(player, currentSeasonStats);

      return {
        ...player,
        statistics: currentSeasonStats,
        estimated_market_value: marketValue,
        performance_rating: this.calculatePerformanceRating(currentSeasonStats)
      };
    } catch (error) {
      console.error(`Error fetching enhanced data for player ${playerId}:`, error);
      return null;
    }
  }

  private estimateMarketValue(player: SportmonksPlayer, stats?: SportmonksStatistic): number {
    if (!stats) return 1000000; // Base value

    const age = new Date().getFullYear() - new Date(player.date_of_birth).getFullYear();
    const ageMultiplier = age <= 23 ? 1.3 : age <= 27 ? 1.1 : age <= 30 ? 1.0 : 0.7;
    
    const goalContribution = (stats.goals || 0) + (stats.assists || 0);
    const performanceMultiplier = Math.max(0.5, 1 + (goalContribution / 20));
    
    const baseValue = 5000000; // 5M base
    return Math.round(baseValue * ageMultiplier * performanceMultiplier);
  }

  private calculatePerformanceRating(stats?: SportmonksStatistic): number {
    if (!stats) return 50;

    const goalContribution = (stats.goals || 0) + (stats.assists || 0);
    const minutesPerContribution = goalContribution > 0 ? (stats.minutes_played || 0) / goalContribution : 0;
    const passAccuracy = (stats.passes_accuracy || 70) / 100;
    
    const rating = Math.min(100, 
      40 + // Base rating
      (goalContribution * 2) + // Goals/assists boost
      (passAccuracy * 20) + // Pass accuracy boost
      Math.max(0, 10 - (minutesPerContribution / 100)) // Efficiency boost
    );
    
    return Math.round(rating);
  }
}

export default SportmonksAPIService;

// Usage examples and integration patterns
export const integrationExamples = {
  // Example: Fetch Premier League players
  async fetchPremierLeaguePlayers(apiKey: string) {
    const service = new SportmonksAPIService(apiKey);
    const leagues = await service.getLeagues();
    const premierLeague = leagues.find(l => l.name.includes('Premier League'));
    
    if (premierLeague) {
      const teams = await service.getTeamsByLeague(premierLeague.current_season_id);
      const allPlayers = [];
      
      for (const team of teams.slice(0, 5)) { // Limit to 5 teams for demo
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
        const players = await service.getPlayersByTeam(team.id);
        allPlayers.push(...players);
      }
      
      return allPlayers;
    }
    
    return [];
  },

  // Example: Compare generated vs authentic data
  async compareDataQuality(apiKey: string) {
    const service = new SportmonksAPIService(apiKey);
    const connection = await service.testConnection();
    
    return {
      apiStatus: connection.success,
      subscription: connection.subscription,
      dataComparison: {
        generated: {
          players: 2500,
          accuracy: "Estimated 85%",
          realTime: false,
          cost: "$0/month"
        },
        authentic: {
          players: "50,000+",
          accuracy: "Official 100%",
          realTime: true,
          cost: "$29-299/month"
        }
      }
    };
  }
};