import { Router } from 'express';

const router = Router();

class PremierLeagueSalariesAPI {
  private apiKey: string;
  private baseUrl = 'https://api.premierleaguesalaries.com/v1';

  constructor() {
    this.apiKey = process.env.PREMIERLEAGUESALARIES || '8850|m1jLOF2l6qlyej7ntn03OtNEWckqCDrKczo7MVNy';
  }

  private async makeRequest(endpoint: string) {
    try {
      if (!this.apiKey) {
        throw new Error('Premier League Salaries API key not configured');
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Premier League Salaries API error:', error);
      throw error;
    }
  }

  async getTeamSalaries(teamId?: string) {
    const endpoint = teamId ? `/teams/${teamId}/salaries` : '/salaries';
    return this.makeRequest(endpoint);
  }

  async getPlayerSalary(playerId: string) {
    return this.makeRequest(`/players/${playerId}/salary`);
  }

  async getTopEarners(limit = 50) {
    return this.makeRequest(`/top-earners?limit=${limit}`);
  }

  async getTeamWageBill(teamId: string) {
    return this.makeRequest(`/teams/${teamId}/wage-bill`);
  }

  async getSalaryComparison(position?: string) {
    const endpoint = position ? `/salary-comparison?position=${position}` : '/salary-comparison';
    return this.makeRequest(endpoint);
  }

  async getTeams() {
    return this.makeRequest('/teams');
  }

  async getPositionAnalysis() {
    return this.makeRequest('/position-analysis');
  }

  async getContractDetails(playerId: string) {
    return this.makeRequest(`/players/${playerId}/contract`);
  }

  async getWageStructure(teamId: string) {
    return this.makeRequest(`/teams/${teamId}/wage-structure`);
  }

  async getSalaryTrends(timeframe = '2024') {
    return this.makeRequest(`/trends?year=${timeframe}`);
  }
}

const salariesAPI = new PremierLeagueSalariesAPI();

// Get all team salaries or specific team
router.get('/teams/:teamId?/salaries', async (req, res) => {
  try {
    const { teamId } = req.params;
    const data = await salariesAPI.getTeamSalaries(teamId);
    res.json({
      success: true,
      data,
      source: 'Premier League Salaries API'
    });
  } catch (error) {
    console.error('Team salaries error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch team salaries'
    });
  }
});

// Get specific player salary
router.get('/players/:playerId/salary', async (req, res) => {
  try {
    const { playerId } = req.params;
    const data = await salariesAPI.getPlayerSalary(playerId);
    res.json({
      success: true,
      data,
      source: 'Premier League Salaries API'
    });
  } catch (error) {
    console.error('Player salary error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch player salary'
    });
  }
});

// Get top earners in the league
router.get('/top-earners', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const data = await salariesAPI.getTopEarners(Number(limit));
    res.json({
      success: true,
      data,
      source: 'Premier League Salaries API',
      count: data.length || 0
    });
  } catch (error) {
    console.error('Top earners error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch top earners'
    });
  }
});

// Get team wage bill
router.get('/teams/:teamId/wage-bill', async (req, res) => {
  try {
    const { teamId } = req.params;
    const data = await salariesAPI.getTeamWageBill(teamId);
    res.json({
      success: true,
      data,
      source: 'Premier League Salaries API'
    });
  } catch (error) {
    console.error('Team wage bill error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch team wage bill'
    });
  }
});

// Get salary comparison by position
router.get('/salary-comparison', async (req, res) => {
  try {
    const { position } = req.query;
    const data = await salariesAPI.getSalaryComparison(position as string);
    res.json({
      success: true,
      data,
      source: 'Premier League Salaries API'
    });
  } catch (error) {
    console.error('Salary comparison error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch salary comparison'
    });
  }
});

// Get all teams
router.get('/teams', async (req, res) => {
  try {
    const data = await salariesAPI.getTeams();
    res.json({
      success: true,
      data,
      source: 'Premier League Salaries API'
    });
  } catch (error) {
    console.error('Teams error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch teams'
    });
  }
});

// Get position analysis
router.get('/position-analysis', async (req, res) => {
  try {
    const data = await salariesAPI.getPositionAnalysis();
    res.json({
      success: true,
      data,
      source: 'Premier League Salaries API'
    });
  } catch (error) {
    console.error('Position analysis error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch position analysis'
    });
  }
});

// Get player contract details
router.get('/players/:playerId/contract', async (req, res) => {
  try {
    const { playerId } = req.params;
    const data = await salariesAPI.getContractDetails(playerId);
    res.json({
      success: true,
      data,
      source: 'Premier League Salaries API'
    });
  } catch (error) {
    console.error('Contract details error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch contract details'
    });
  }
});

// Get team wage structure
router.get('/teams/:teamId/wage-structure', async (req, res) => {
  try {
    const { teamId } = req.params;
    const data = await salariesAPI.getWageStructure(teamId);
    res.json({
      success: true,
      data,
      source: 'Premier League Salaries API'
    });
  } catch (error) {
    console.error('Wage structure error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch wage structure'
    });
  }
});

// Get salary trends
router.get('/trends', async (req, res) => {
  try {
    const { year = '2024' } = req.query;
    const data = await salariesAPI.getSalaryTrends(year as string);
    res.json({
      success: true,
      data,
      source: 'Premier League Salaries API'
    });
  } catch (error) {
    console.error('Salary trends error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch salary trends'
    });
  }
});

// API status check
router.get('/status', async (req, res) => {
  try {
    // Test API connectivity with teams endpoint
    await salariesAPI.getTeams();
    res.json({
      success: true,
      status: 'connected',
      api: 'Premier League Salaries API',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'API connection failed'
    });
  }
});

export default router;