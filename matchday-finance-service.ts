// MatchdayFinance API service for authentic 2023-24 financial data

interface FinancialData {
  clubId: string;
  clubName: string;
  season: string;
  revenue: number;
  wages: number;
  transfers: {
    spending: number;
    sales: number;
    netSpend: number;
  };
  profit: number;
  debt: number;
  ffpCompliance: {
    status: 'compliant' | 'monitoring' | 'breach' | 'sanctions';
    score: number;
    details: string[];
  };
  lastUpdated: string;
}

interface LeagueFinancials {
  leagueId: string;
  leagueName: string;
  season: string;
  clubs: FinancialData[];
  totalRevenue: number;
  averageWages: number;
  ffpBreaches: number;
}

class MatchdayFinanceService {
  private baseUrl = 'https://api.matchdayfinance.com/v1';
  private apiKey: string | undefined;

  constructor() {
    // Check for API key in environment
    if (typeof window === 'undefined') {
      // Server-side
      this.apiKey = process.env.MATCHDAY_FINANCE_API_KEY;
    } else {
      // Client-side - would need to be proxied through backend
      this.apiKey = undefined;
    }
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    if (!this.apiKey) {
      throw new Error('MatchdayFinance API key not configured');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`MatchdayFinance API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get financial data for a specific club
  async getClubFinancials(clubId: string, season = '2023-24'): Promise<FinancialData> {
    return this.makeRequest<FinancialData>(`/clubs/${clubId}/financials?season=${season}`);
  }

  // Get financial data for all clubs in a league
  async getLeagueFinancials(leagueId: string, season = '2023-24'): Promise<LeagueFinancials> {
    return this.makeRequest<LeagueFinancials>(`/leagues/${leagueId}/financials?season=${season}`);
  }

  // Get FFP compliance data
  async getFFPCompliance(clubId: string, season = '2023-24'): Promise<{
    status: string;
    score: number;
    violations: string[];
    penalties: string[];
    monitoringPeriod: string;
  }> {
    return this.makeRequest(`/clubs/${clubId}/ffp?season=${season}`);
  }

  // Get transfer spending analysis
  async getTransferAnalysis(clubId: string, season = '2023-24'): Promise<{
    totalSpending: number;
    totalSales: number;
    netSpend: number;
    majorSignings: Array<{
      player: string;
      fee: number;
      fromClub: string;
      date: string;
    }>;
    majorSales: Array<{
      player: string;
      fee: number;
      toClub: string;
      date: string;
    }>;
  }> {
    return this.makeRequest(`/clubs/${clubId}/transfers?season=${season}`);
  }

  // Get revenue breakdown
  async getRevenueBreakdown(clubId: string, season = '2023-24'): Promise<{
    total: number;
    breakdown: {
      matchday: number;
      broadcasting: number;
      commercial: number;
      other: number;
    };
    comparison: {
      previousSeason: number;
      change: number;
      changePercent: number;
    };
  }> {
    return this.makeRequest(`/clubs/${clubId}/revenue?season=${season}`);
  }

  // Get wage structure analysis
  async getWageAnalysis(clubId: string, season = '2023-24'): Promise<{
    totalWages: number;
    wageToRevenueRatio: number;
    averageWage: number;
    highestEarners: Array<{
      player: string;
      position: string;
      weeklyWage: number;
      annualWage: number;
    }>;
    departmentBreakdown: {
      firstTeam: number;
      academy: number;
      management: number;
      support: number;
    };
  }> {
    return this.makeRequest(`/clubs/${clubId}/wages?season=${season}`);
  }

  // Get financial trends over multiple seasons
  async getFinancialTrends(clubId: string, seasons: string[] = ['2021-22', '2022-23', '2023-24']): Promise<{
    revenue: Array<{ season: string; amount: number }>;
    profit: Array<{ season: string; amount: number }>;
    debt: Array<{ season: string; amount: number }>;
    transferSpend: Array<{ season: string; amount: number }>;
    wages: Array<{ season: string; amount: number }>;
    ffpScore: Array<{ season: string; score: number }>;
  }> {
    const seasonsQuery = seasons.join(',');
    return this.makeRequest(`/clubs/${clubId}/trends?seasons=${seasonsQuery}`);
  }

  // Get league comparison data
  async getLeagueComparison(leagueIds: string[], season = '2023-24'): Promise<{
    leagues: Array<{
      id: string;
      name: string;
      totalRevenue: number;
      averageRevenue: number;
      totalDebt: number;
      ffpCompliantClubs: number;
      totalClubs: number;
    }>;
    topSpenders: Array<{
      clubName: string;
      league: string;
      spending: number;
    }>;
    ffpBreaches: Array<{
      clubName: string;
      league: string;
      violations: string[];
      penalties: string[];
    }>;
  }> {
    const leaguesQuery = leagueIds.join(',');
    return this.makeRequest(`/leagues/compare?leagues=${leaguesQuery}&season=${season}`);
  }

  // Helper method to get Premier League club financial data
  async getPremierLeagueFinancials(season = '2023-24'): Promise<LeagueFinancials> {
    return this.getLeagueFinancials('premier-league', season);
  }

  // Helper method to get major European leagues comparison
  async getEuropeanLeaguesComparison(season = '2023-24'): Promise<any> {
    const leagues = ['premier-league', 'la-liga', 'serie-a', 'bundesliga', 'ligue-1'];
    return this.getLeagueComparison(leagues, season);
  }

  // Map club names to MatchdayFinance API club IDs
  private getClubId(clubName: string): string {
    const clubMap: Record<string, string> = {
      'Liverpool': 'liverpool-fc',
      'Manchester City': 'manchester-city',
      'Arsenal': 'arsenal-fc',
      'Chelsea': 'chelsea-fc',
      'Manchester United': 'manchester-united',
      'Tottenham': 'tottenham-hotspur',
      'Newcastle United': 'newcastle-united',
      'Brighton': 'brighton-hove-albion',
      'West Ham': 'west-ham-united',
      'Crystal Palace': 'crystal-palace',
      'Aston Villa': 'aston-villa',
      'Fulham': 'fulham-fc',
      'Wolves': 'wolverhampton-wanderers',
      'Everton': 'everton-fc',
      'Brentford': 'brentford-fc',
      'Nottingham Forest': 'nottingham-forest',
      'Luton Town': 'luton-town',
      'Burnley': 'burnley-fc',
      'Sheffield United': 'sheffield-united',
      'Real Madrid': 'real-madrid',
      'Barcelona': 'fc-barcelona',
      'Atletico Madrid': 'atletico-madrid',
      'AC Milan': 'ac-milan',
      'Inter Milan': 'inter-milan',
      'Juventus': 'juventus',
      'Bayern Munich': 'bayern-munich',
      'Borussia Dortmund': 'borussia-dortmund',
      'PSG': 'paris-saint-germain'
    };

    return clubMap[clubName] || clubName.toLowerCase().replace(/\s+/g, '-');
  }

  // Public method to get club financials by name
  async getClubFinancialsByName(clubName: string, season = '2023-24'): Promise<FinancialData> {
    const clubId = this.getClubId(clubName);
    return this.getClubFinancials(clubId, season);
  }
}

export const matchdayFinanceService = new MatchdayFinanceService();
export type { FinancialData, LeagueFinancials };