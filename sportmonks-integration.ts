// Sportmonks API Integration for Authentic Player Data
import { Router } from 'express';

const router = Router();

interface SportmonksPlayer {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  common_name: string;
  display_name: string;
  image_path: string;
  height: number;
  weight: number;
  date_of_birth: string;
  nationality: string;
  position: {
    name: string;
    code: string;
  };
  team: {
    id: number;
    name: string;
    logo_path: string;
  };
  market_value: number;
}

class SportmonksAPI {
  private baseUrl = 'https://api.sportmonks.com/v3/football';
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.SPORTMONKS_API_KEY;
  }

  private async makeRequest(endpoint: string) {
    if (!this.apiKey) {
      throw new Error('SPORTMONKS_API_KEY not configured');
    }

    const url = `${this.baseUrl}${endpoint}?api_token=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Sportmonks API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Sportmonks API request failed:', error);
      throw error;
    }
  }

  async getPlayers(teamId?: number, limit = 50): Promise<SportmonksPlayer[]> {
    const endpoint = teamId 
      ? `/players?filter[team_id]=${teamId}&per_page=${limit}&include=position,team`
      : `/players?per_page=${limit}&include=position,team`;
    
    const response = await this.makeRequest(endpoint);
    return response.data || [];
  }

  async getLeaguePlayers(leagueId: number, limit = 500): Promise<SportmonksPlayer[]> {
    const endpoint = `/players?filter[league_id]=${leagueId}&per_page=${limit}&include=position,team,statistics`;
    const response = await this.makeRequest(endpoint);
    return response.data || [];
  }

  async getTeams(): Promise<any[]> {
    const response = await this.makeRequest('/teams?per_page=100&include=league');
    return response.data || [];
  }

  async getLeagues(): Promise<any[]> {
    const response = await this.makeRequest('/leagues?per_page=50');
    return response.data || [];
  }

  async getPlayer(playerId: number): Promise<SportmonksPlayer | null> {
    const response = await this.makeRequest(`/players/${playerId}`);
    return response.data || null;
  }

  async getTeamPlayers(teamId: number): Promise<SportmonksPlayer[]> {
    const response = await this.makeRequest(`/teams/${teamId}/players`);
    return response.data || [];
  }

  async searchPlayers(name: string): Promise<SportmonksPlayer[]> {
    const response = await this.makeRequest(`/players?search=${encodeURIComponent(name)}`);
    return response.data || [];
  }
}

const sportmonksAPI = new SportmonksAPI();

// Get all players with optional team filter
router.get('/players', async (req, res) => {
  try {
    const teamId = req.query.team_id ? parseInt(req.query.team_id as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    
    const players = await sportmonksAPI.getPlayers(teamId, limit);
    
    res.json({
      success: true,
      data: players,
      source: 'sportmonks_api',
      count: players.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to fetch players from Sportmonks API'
    });
  }
});

// Get specific player by ID
router.get('/players/:id', async (req, res) => {
  try {
    const playerId = parseInt(req.params.id);
    const player = await sportmonksAPI.getPlayer(playerId);
    
    if (!player) {
      return res.status(404).json({
        success: false,
        error: 'Player not found'
      });
    }
    
    res.json({
      success: true,
      data: player,
      source: 'sportmonks_api'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Search players by name
router.get('/search/players', async (req, res) => {
  try {
    const name = req.query.name as string;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Name parameter required'
      });
    }
    
    const players = await sportmonksAPI.searchPlayers(name);
    
    res.json({
      success: true,
      data: players,
      source: 'sportmonks_api',
      query: name,
      count: players.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get players for specific team
router.get('/teams/:teamId/players', async (req, res) => {
  try {
    const teamId = parseInt(req.params.teamId);
    const players = await sportmonksAPI.getTeamPlayers(teamId);
    
    res.json({
      success: true,
      data: players,
      source: 'sportmonks_api',
      team_id: teamId,
      count: players.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Check API status
router.get('/status', (req, res) => {
  const hasApiKey = !!process.env.SPORTMONKS_API_KEY;
  
  res.json({
    service: 'Sportmonks API',
    status: hasApiKey ? 'configured' : 'missing_api_key',
    api_key_configured: hasApiKey,
    base_url: 'https://api.sportmonks.com/v3/football',
    endpoints: [
      '/api/sportmonks/players',
      '/api/sportmonks/players/:id',
      '/api/sportmonks/search/players',
      '/api/sportmonks/teams/:teamId/players'
    ]
  });
});

// Get players by league (Premier League, La Liga, etc.)
router.get('/leagues/:leagueId/players', async (req, res) => {
  try {
    const leagueId = parseInt(req.params.leagueId);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 500;
    
    const players = await sportmonksAPI.getLeaguePlayers(leagueId, limit);
    
    res.json({
      success: true,
      data: players,
      source: 'sportmonks_api',
      league_id: leagueId,
      count: players.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to fetch league players from Sportmonks API'
    });
  }
});

// Get all teams
router.get('/teams', async (req, res) => {
  try {
    const teams = await sportmonksAPI.getTeams();
    
    res.json({
      success: true,
      data: teams,
      source: 'sportmonks_api',
      count: teams.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to fetch teams from Sportmonks API'
    });
  }
});

// Get all leagues
router.get('/leagues', async (req, res) => {
  try {
    const leagues = await sportmonksAPI.getLeagues();
    
    res.json({
      success: true,
      data: leagues,
      source: 'sportmonks_api',
      count: leagues.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to fetch leagues from Sportmonks API'
    });
  }
});

// Bulk fetch players for major European teams
router.get('/bulk/european-players', async (req, res) => {
  try {
    // Major European league IDs (these would need to be verified from Sportmonks)
    const majorLeagues = [8, 564, 271, 82, 301]; // Premier League, La Liga, Serie A, Bundesliga, Ligue 1
    const allPlayers: SportmonksPlayer[] = [];
    
    for (const leagueId of majorLeagues) {
      try {
        const players = await sportmonksAPI.getLeaguePlayers(leagueId, 200);
        allPlayers.push(...players);
      } catch (leagueError) {
        console.warn(`Failed to fetch players for league ${leagueId}:`, leagueError);
      }
    }
    
    res.json({
      success: true,
      data: allPlayers,
      source: 'sportmonks_api',
      leagues_fetched: majorLeagues.length,
      total_players: allPlayers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to bulk fetch European players'
    });
  }
});

export default router;