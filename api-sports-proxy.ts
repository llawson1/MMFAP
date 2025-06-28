// API-SPORTS Proxy Server Route
import { Router } from 'express';

const router = Router();

const API_SPORTS_BASE_URL = 'https://v3.football.api-sports.io';

// Proxy all API-SPORTS requests
router.all('/*', async (req, res) => {
  try {
    const apiKey = process.env.API_SPORTS_KEY;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'API_SPORTS_KEY not configured'
      });
    }

    // Build the target URL
    const targetPath = req.path;
    const queryString = new URLSearchParams(req.query as Record<string, string>).toString();
    const targetUrl = `${API_SPORTS_BASE_URL}${targetPath}${queryString ? `?${queryString}` : ''}`;

    console.log(`Proxying API-SPORTS request: ${req.method} ${targetUrl}`);

    // Make request to API-SPORTS
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'v3.football.api-sports.io',
        'Content-Type': 'application/json'
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API-SPORTS error: ${response.status} ${response.statusText} - ${errorText}`);

      return res.status(response.status).json({
        success: false,
        error: `API-SPORTS error: ${response.status} ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();

    // Log API usage info
    if (data.paging) {
      console.log(`API-SPORTS response: ${data.results} results, page ${data.paging.current}/${data.paging.total}`);
    }

    res.json(data);
  } catch (error) {
    console.error('API-SPORTS proxy error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown proxy error'
    });
  }
});

router.get('/status', async (req, res) => {
  try {
    const apiKey = process.env.API_SPORTS_KEY;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'API_SPORTS_KEY not configured'
      });
    }

    const response = await fetch('https://v3.football.api-sports.io/status', {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'v3.football.api-sports.io'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('API-SPORTS status error:', error);
    res.status(500).json({ error: 'Failed to fetch API status' });
  }
});

// Get teams from specific league
router.get('/teams', async (req, res) => {
  try {
    const apiKey = process.env.API_SPORTS_KEY;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'API_SPORTS_KEY not configured'
      });
    }

    // Use season 2025 for current season access
    const { league, season = 2025 } = req.query;

    if (!league) {
      return res.status(400).json({ error: 'League parameter is required' });
    }

    const response = await fetch(`https://v3.football.api-sports.io/teams?league=${league}&season=${season}`, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'v3.football.api-sports.io'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('API-SPORTS teams error:', error);
    res.status(500).json({ error: 'Failed to fetch teams data' });
  }
});

// Get players from specific team
router.get('/players', async (req, res) => {
  try {
    const apiKey = process.env.API_SPORTS_KEY;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'API_SPORTS_KEY not configured'
      });
    }

    // Use season 2025 for current season access
    const { team, season = 2025, page = 1 } = req.query;

    if (!team) {
      return res.status(400).json({ error: 'Team parameter is required' });
    }

    const response = await fetch(`https://v3.football.api-sports.io/players?team=${team}&season=${season}&page=${page}`, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'v3.football.api-sports.io'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('API-SPORTS players error:', error);
    res.status(500).json({ error: 'Failed to fetch players data' });
  }
});

// Get standings for specific league
router.get('/standings', async (req, res) => {
  try {
    const apiKey = process.env.API_SPORTS_KEY;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'API_SPORTS_KEY not configured'
      });
    }

    // Use season 2025 for current season access
    const { league, season = 2025 } = req.query;

    if (!league) {
      return res.status(400).json({ error: 'League parameter is required' });
    }

    const response = await fetch(`https://v3.football.api-sports.io/standings?league=${league}&season=${season}`, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'v3.football.api-sports.io'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('API-SPORTS standings error:', error);
    res.status(500).json({ error: 'Failed to fetch standings data' });
  }
});

export default router;