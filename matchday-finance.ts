import { Request, Response, Router } from 'express';

const router = Router();

// MatchdayFinance API proxy routes for 2023-24 financial data
class MatchdayFinanceAPI {
  private baseUrl = 'https://api.matchdayfinance.com/v1';
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.MATCHDAY_FINANCE_API_KEY;
  }

  private async makeRequest(endpoint: string) {
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

  async getClubFinancials(clubId: string, season = '2023-24') {
    return this.makeRequest(`/clubs/${clubId}/financials?season=${season}`);
  }

  async getLeagueFinancials(leagueId: string, season = '2023-24') {
    return this.makeRequest(`/leagues/${leagueId}/financials?season=${season}`);
  }

  async getFFPCompliance(clubId: string, season = '2023-24') {
    return this.makeRequest(`/clubs/${clubId}/ffp?season=${season}`);
  }

  async getTransferAnalysis(clubId: string, season = '2023-24') {
    return this.makeRequest(`/clubs/${clubId}/transfers?season=${season}`);
  }

  async getRevenueBreakdown(clubId: string, season = '2023-24') {
    return this.makeRequest(`/clubs/${clubId}/revenue?season=${season}`);
  }

  async getWageAnalysis(clubId: string, season = '2023-24') {
    return this.makeRequest(`/clubs/${clubId}/wages?season=${season}`);
  }

  async getFinancialTrends(clubId: string, seasons: string[]) {
    const seasonsQuery = seasons.join(',');
    return this.makeRequest(`/clubs/${clubId}/trends?seasons=${seasonsQuery}`);
  }

  async getLeagueComparison(leagueIds: string[], season = '2023-24') {
    const leaguesQuery = leagueIds.join(',');
    return this.makeRequest(`/leagues/compare?leagues=${leaguesQuery}&season=${season}`);
  }

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

  async getClubFinancialsByName(clubName: string, season = '2023-24') {
    const clubId = this.getClubId(clubName);
    return this.getClubFinancials(clubId, season);
  }
}

const matchdayAPI = new MatchdayFinanceAPI();

// Routes for MatchdayFinance API

// Get club financial data
router.get('/clubs/:clubId/financials', async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;
    const { season = '2023-24' } = req.query;
    
    const data = await matchdayAPI.getClubFinancials(clubId, season as string);
    res.json(data);
  } catch (error) {
    console.error('Error fetching club financials:', error);
    res.status(500).json({ 
      error: 'Failed to fetch club financial data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get club financial data by name
router.get('/clubs/name/:clubName/financials', async (req: Request, res: Response) => {
  try {
    const { clubName } = req.params;
    const { season = '2023-24' } = req.query;
    
    const data = await matchdayAPI.getClubFinancialsByName(decodeURIComponent(clubName), season as string);
    res.json(data);
  } catch (error) {
    console.error('Error fetching club financials by name:', error);
    res.status(500).json({ 
      error: 'Failed to fetch club financial data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get league financial data
router.get('/leagues/:leagueId/financials', async (req: Request, res: Response) => {
  try {
    const { leagueId } = req.params;
    const { season = '2023-24' } = req.query;
    
    const data = await matchdayAPI.getLeagueFinancials(leagueId, season as string);
    res.json(data);
  } catch (error) {
    console.error('Error fetching league financials:', error);
    res.status(500).json({ 
      error: 'Failed to fetch league financial data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get FFP compliance data
router.get('/clubs/:clubId/ffp', async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;
    const { season = '2023-24' } = req.query;
    
    const data = await matchdayAPI.getFFPCompliance(clubId, season as string);
    res.json(data);
  } catch (error) {
    console.error('Error fetching FFP compliance:', error);
    res.status(500).json({ 
      error: 'Failed to fetch FFP compliance data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get transfer analysis
router.get('/clubs/:clubId/transfers', async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;
    const { season = '2023-24' } = req.query;
    
    const data = await matchdayAPI.getTransferAnalysis(clubId, season as string);
    res.json(data);
  } catch (error) {
    console.error('Error fetching transfer analysis:', error);
    res.status(500).json({ 
      error: 'Failed to fetch transfer analysis data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get revenue breakdown
router.get('/clubs/:clubId/revenue', async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;
    const { season = '2023-24' } = req.query;
    
    const data = await matchdayAPI.getRevenueBreakdown(clubId, season as string);
    res.json(data);
  } catch (error) {
    console.error('Error fetching revenue breakdown:', error);
    res.status(500).json({ 
      error: 'Failed to fetch revenue breakdown data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get wage analysis
router.get('/clubs/:clubId/wages', async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;
    const { season = '2023-24' } = req.query;
    
    const data = await matchdayAPI.getWageAnalysis(clubId, season as string);
    res.json(data);
  } catch (error) {
    console.error('Error fetching wage analysis:', error);
    res.status(500).json({ 
      error: 'Failed to fetch wage analysis data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get financial trends
router.get('/clubs/:clubId/trends', async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;
    const { seasons } = req.query;
    
    const seasonList = seasons 
      ? (seasons as string).split(',') 
      : ['2021-22', '2022-23', '2023-24'];
    
    const data = await matchdayAPI.getFinancialTrends(clubId, seasonList);
    res.json(data);
  } catch (error) {
    console.error('Error fetching financial trends:', error);
    res.status(500).json({ 
      error: 'Failed to fetch financial trends data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get league comparison
router.get('/leagues/compare', async (req: Request, res: Response) => {
  try {
    const { leagues, season = '2023-24' } = req.query;
    
    if (!leagues) {
      return res.status(400).json({ error: 'Leagues parameter is required' });
    }
    
    const leagueList = (leagues as string).split(',');
    const data = await matchdayAPI.getLeagueComparison(leagueList, season as string);
    res.json(data);
  } catch (error) {
    console.error('Error fetching league comparison:', error);
    res.status(500).json({ 
      error: 'Failed to fetch league comparison data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get Premier League financials (convenience route)
router.get('/premier-league/financials', async (req: Request, res: Response) => {
  try {
    const { season = '2023-24' } = req.query;
    
    const data = await matchdayAPI.getLeagueFinancials('premier-league', season as string);
    res.json(data);
  } catch (error) {
    console.error('Error fetching Premier League financials:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Premier League financial data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get European leagues comparison (convenience route)
router.get('/european-leagues/compare', async (req: Request, res: Response) => {
  try {
    const { season = '2023-24' } = req.query;
    
    const leagues = ['premier-league', 'la-liga', 'serie-a', 'bundesliga', 'ligue-1'];
    const data = await matchdayAPI.getLeagueComparison(leagues, season as string);
    res.json(data);
  } catch (error) {
    console.error('Error fetching European leagues comparison:', error);
    res.status(500).json({ 
      error: 'Failed to fetch European leagues comparison data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API status endpoint
router.get('/status', (req: Request, res: Response) => {
  const hasApiKey = !!process.env.MATCHDAY_FINANCE_API_KEY;
  
  res.json({
    status: hasApiKey ? 'ready' : 'missing_api_key',
    message: hasApiKey 
      ? 'MatchdayFinance API is configured and ready'
      : 'MatchdayFinance API key is not configured',
    endpoints: [
      '/clubs/:clubId/financials',
      '/clubs/name/:clubName/financials',
      '/leagues/:leagueId/financials',
      '/clubs/:clubId/ffp',
      '/clubs/:clubId/transfers',
      '/clubs/:clubId/revenue',
      '/clubs/:clubId/wages',
      '/clubs/:clubId/trends',
      '/leagues/compare',
      '/premier-league/financials',
      '/european-leagues/compare'
    ]
  });
});

export default router;