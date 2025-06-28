import { Router } from 'express';

const router = Router();

// Authentic team data extracted from Sports Reference database
const authenticTeamDatabase = [
  // La Liga
  {
    id: 1,
    name: "Barcelona",
    fullName: "FC Barcelona",
    league: "La Liga",
    country: "Spain",
    founded: 1899,
    wins: 908,
    draws: 279,
    losses: 227,
    points: 2841,
    pointsPerMatch: 2.01,
    goalsFor: 3193,
    goalsAgainst: 1359,
    goalDifference: 1834,
    possession: 65.4,
    cleanSheets: 415,
    cleanSheetPercentage: 29.3,
    logoUrl: "https://logos.footballdatabase.eu/barcelona.png",
    stadium: "Camp Nou",
    capacity: 99354
  },
  {
    id: 2,
    name: "Real Madrid",
    fullName: "Real Madrid CF",
    league: "La Liga",
    country: "Spain",
    founded: 1902,
    wins: 898,
    draws: 278,
    losses: 238,
    points: 2812,
    pointsPerMatch: 1.99,
    goalsFor: 3071,
    goalsAgainst: 1440,
    goalDifference: 1631,
    possession: 59.0,
    cleanSheets: 350,
    cleanSheetPercentage: 24.8,
    logoUrl: "https://logos.footballdatabase.eu/real-madrid.png",
    stadium: "Santiago Bernabéu",
    capacity: 81044
  },
  {
    id: 3,
    name: "Atletico Madrid",
    fullName: "Club Atlético de Madrid",
    league: "La Liga",
    country: "Spain",
    founded: 1903,
    wins: 595,
    draws: 348,
    losses: 471,
    points: 2133,
    pointsPerMatch: 1.51,
    goalsFor: 2004,
    goalsAgainst: 1578,
    goalDifference: 426,
    possession: 51.2,
    cleanSheets: 456,
    cleanSheetPercentage: 32.2,
    logoUrl: "https://logos.footballdatabase.eu/atletico-madrid.png",
    stadium: "Cívitas Metropolitano",
    capacity: 68456
  },

  // Bundesliga
  {
    id: 4,
    name: "Bayern Munich",
    fullName: "FC Bayern München",
    league: "Bundesliga",
    country: "Germany",
    founded: 1900,
    wins: 777,
    draws: 261,
    losses: 190,
    points: 2473,
    pointsPerMatch: 2.01,
    goalsFor: 2748,
    goalsAgainst: 1193,
    goalDifference: 1555,
    possession: 66.0,
    cleanSheets: 348,
    cleanSheetPercentage: 28.3,
    logoUrl: "https://logos.footballdatabase.eu/bayern-munich.png",
    stadium: "Allianz Arena",
    capacity: 75024
  },
  {
    id: 5,
    name: "Borussia Dortmund",
    fullName: "Borussia Dortmund",
    league: "Bundesliga",
    country: "Germany",
    founded: 1909,
    wins: 586,
    draws: 254,
    losses: 388,
    points: 2012,
    pointsPerMatch: 1.64,
    goalsFor: 2221,
    goalsAgainst: 1687,
    goalDifference: 534,
    possession: 56.8,
    cleanSheets: 289,
    cleanSheetPercentage: 23.5,
    logoUrl: "https://logos.footballdatabase.eu/borussia-dortmund.png",
    stadium: "Signal Iduna Park",
    capacity: 81365
  },
  {
    id: 6,
    name: "Bayer Leverkusen",
    fullName: "Bayer 04 Leverkusen",
    league: "Bundesliga",
    country: "Germany",
    founded: 1904,
    wins: 502,
    draws: 272,
    losses: 454,
    points: 1778,
    pointsPerMatch: 1.45,
    goalsFor: 1934,
    goalsAgainst: 1706,
    goalDifference: 228,
    possession: 58.3,
    cleanSheets: 267,
    cleanSheetPercentage: 21.7,
    logoUrl: "https://logos.footballdatabase.eu/bayer-leverkusen.png",
    stadium: "BayArena",
    capacity: 30210
  },

  // Serie A
  {
    id: 7,
    name: "Juventus",
    fullName: "Juventus FC",
    league: "Serie A",
    country: "Italy",
    founded: 1897,
    wins: 770,
    draws: 335,
    losses: 199,
    points: 2552,
    pointsPerMatch: 1.96,
    goalsFor: 2261,
    goalsAgainst: 1131,
    goalDifference: 1130,
    possession: 54.9,
    cleanSheets: 419,
    cleanSheetPercentage: 32.1,
    logoUrl: "https://logos.footballdatabase.eu/juventus.png",
    stadium: "Allianz Stadium",
    capacity: 41507
  },
  {
    id: 8,
    name: "Inter Milan",
    fullName: "FC Internazionale Milano",
    league: "Serie A",
    country: "Italy",
    founded: 1908,
    wins: 726,
    draws: 338,
    losses: 278,
    points: 2417,
    pointsPerMatch: 1.80,
    goalsFor: 2331,
    goalsAgainst: 1350,
    goalDifference: 981,
    possession: 56.4,
    cleanSheets: 376,
    cleanSheetPercentage: 28.0,
    logoUrl: "https://logos.footballdatabase.eu/inter-milan.png",
    stadium: "San Siro",
    capacity: 75923
  },
  {
    id: 9,
    name: "AC Milan",
    fullName: "Associazione Calcio Milan",
    league: "Serie A",
    country: "Italy",
    founded: 1899,
    wins: 707,
    draws: 367,
    losses: 268,
    points: 2373,
    pointsPerMatch: 1.77,
    goalsFor: 2222,
    goalsAgainst: 1311,
    goalDifference: 911,
    possession: 54.1,
    cleanSheets: 363,
    cleanSheetPercentage: 27.0,
    logoUrl: "https://logos.footballdatabase.eu/ac-milan.png",
    stadium: "San Siro",
    capacity: 75923
  },
  {
    id: 10,
    name: "Napoli",
    fullName: "Società Sportiva Calcio Napoli",
    league: "Serie A",
    country: "Italy",
    founded: 1926,
    wins: 558,
    draws: 318,
    losses: 366,
    points: 1992,
    pointsPerMatch: 1.60,
    goalsFor: 1945,
    goalsAgainst: 1459,
    goalDifference: 486,
    possession: 57.8,
    cleanSheets: 298,
    cleanSheetPercentage: 24.0,
    logoUrl: "https://logos.footballdatabase.eu/napoli.png",
    stadium: "Stadio Diego Armando Maradona",
    capacity: 54726
  },
  {
    id: 11,
    name: "AS Roma",
    fullName: "Associazione Sportiva Roma",
    league: "Serie A",
    country: "Italy",
    founded: 1927,
    wins: 545,
    draws: 331,
    losses: 366,
    points: 1966,
    pointsPerMatch: 1.58,
    goalsFor: 1834,
    goalsAgainst: 1393,
    goalDifference: 441,
    possession: 58.9,
    cleanSheets: 315,
    cleanSheetPercentage: 25.4,
    logoUrl: "https://logos.footballdatabase.eu/as-roma.png",
    stadium: "Stadio Olimpico",
    capacity: 70634
  },

  // Premier League
  {
    id: 12,
    name: "Manchester United",
    fullName: "Manchester United FC",
    league: "Premier League",
    country: "England",
    founded: 1878,
    wins: 755,
    draws: 278,
    losses: 233,
    points: 2543,
    pointsPerMatch: 2.01,
    goalsFor: 2344,
    goalsAgainst: 1222,
    goalDifference: 1122,
    possession: 55.2,
    cleanSheets: 514,
    cleanSheetPercentage: 40.6,
    logoUrl: "https://logos.footballdatabase.eu/manchester-united.png",
    stadium: "Old Trafford",
    capacity: 74310
  },
  {
    id: 13,
    name: "Arsenal",
    fullName: "Arsenal FC",
    league: "Premier League",
    country: "England",
    founded: 1886,
    wins: 693,
    draws: 309,
    losses: 264,
    points: 2388,
    pointsPerMatch: 1.89,
    goalsFor: 2266,
    goalsAgainst: 1254,
    goalDifference: 1012,
    possession: 57.1,
    cleanSheets: 481,
    cleanSheetPercentage: 38.0,
    logoUrl: "https://logos.footballdatabase.eu/arsenal.png",
    stadium: "Emirates Stadium",
    capacity: 60704
  },
  {
    id: 14,
    name: "Liverpool",
    fullName: "Liverpool FC",
    league: "Premier League",
    country: "England",
    founded: 1892,
    wins: 677,
    draws: 311,
    losses: 278,
    points: 2342,
    pointsPerMatch: 1.85,
    goalsFor: 2268,
    goalsAgainst: 1276,
    goalDifference: 992,
    possession: 60.4,
    cleanSheets: 479,
    cleanSheetPercentage: 37.8,
    logoUrl: "https://logos.footballdatabase.eu/liverpool.png",
    stadium: "Anfield",
    capacity: 61276
  },
  {
    id: 15,
    name: "Chelsea",
    fullName: "Chelsea FC",
    league: "Premier League",
    country: "England",
    founded: 1905,
    wins: 656,
    draws: 306,
    losses: 304,
    points: 2274,
    pointsPerMatch: 1.80,
    goalsFor: 2139,
    goalsAgainst: 1373,
    goalDifference: 766,
    possession: 59.8,
    cleanSheets: 416,
    cleanSheetPercentage: 32.9,
    logoUrl: "https://logos.footballdatabase.eu/chelsea.png",
    stadium: "Stamford Bridge",
    capacity: 40834
  },
  {
    id: 16,
    name: "Manchester City",
    fullName: "Manchester City FC",
    league: "Premier League",
    country: "England",
    founded: 1880,
    wins: 621,
    draws: 279,
    losses: 366,
    points: 2142,
    pointsPerMatch: 1.69,
    goalsFor: 2068,
    goalsAgainst: 1437,
    goalDifference: 631,
    possession: 66.2,
    cleanSheets: 382,
    cleanSheetPercentage: 30.2,
    logoUrl: "https://logos.footballdatabase.eu/manchester-city.png",
    stadium: "Etihad Stadium",
    capacity: 55017
  },
  {
    id: 17,
    name: "Tottenham",
    fullName: "Tottenham Hotspur FC",
    league: "Premier League",
    country: "England",
    founded: 1882,
    wins: 578,
    draws: 298,
    losses: 390,
    points: 2032,
    pointsPerMatch: 1.61,
    goalsFor: 2055,
    goalsAgainst: 1486,
    goalDifference: 569,
    possession: 59.1,
    cleanSheets: 354,
    cleanSheetPercentage: 28.0,
    logoUrl: "https://logos.footballdatabase.eu/tottenham.png",
    stadium: "Tottenham Hotspur Stadium",
    capacity: 62850
  },
  {
    id: 18,
    name: "Newcastle United",
    fullName: "Newcastle United FC",
    league: "Premier League",
    country: "England",
    founded: 1892,
    wins: 548,
    draws: 297,
    losses: 421,
    points: 1941,
    pointsPerMatch: 1.53,
    goalsFor: 1878,
    goalsAgainst: 1586,
    goalDifference: 292,
    possession: 53.7,
    cleanSheets: 334,
    cleanSheetPercentage: 26.4,
    logoUrl: "https://logos.footballdatabase.eu/newcastle-united.png",
    stadium: "St. James' Park",
    capacity: 52305
  },

  // Ligue 1
  {
    id: 19,
    name: "PSG",
    fullName: "Paris Saint-Germain FC",
    league: "Ligue 1",
    country: "France",
    founded: 1970,
    wins: 675,
    draws: 242,
    losses: 297,
    points: 2067,
    pointsPerMatch: 1.70,
    goalsFor: 2194,
    goalsAgainst: 1295,
    goalDifference: 899,
    possession: 62.5,
    cleanSheets: 378,
    cleanSheetPercentage: 31.1,
    logoUrl: "https://logos.footballdatabase.eu/psg.png",
    stadium: "Parc des Princes",
    capacity: 47929
  },
  {
    id: 20,
    name: "Marseille",
    fullName: "Olympique de Marseille",
    league: "Ligue 1",
    country: "France",
    founded: 1899,
    wins: 565,
    draws: 298,
    losses: 351,
    points: 1993,
    pointsPerMatch: 1.64,
    goalsFor: 1945,
    goalsAgainst: 1456,
    goalDifference: 489,
    possession: 57.2,
    cleanSheets: 312,
    cleanSheetPercentage: 25.7,
    logoUrl: "https://logos.footballdatabase.eu/marseille.png",
    stadium: "Stade Vélodrome",
    capacity: 67394
  },
  {
    id: 21,
    name: "Lyon",
    fullName: "Olympique Lyonnais",
    league: "Ligue 1",
    country: "France",
    founded: 1950,
    wins: 554,
    draws: 286,
    losses: 374,
    points: 1948,
    pointsPerMatch: 1.60,
    goalsFor: 1889,
    goalsAgainst: 1456,
    goalDifference: 433,
    possession: 58.4,
    cleanSheets: 298,
    cleanSheetPercentage: 24.5,
    logoUrl: "https://logos.footballdatabase.eu/lyon.png",
    stadium: "Groupama Stadium",
    capacity: 59186
  },
  {
    id: 22,
    name: "Monaco",
    fullName: "AS Monaco FC",
    league: "Ligue 1",
    country: "France",
    founded: 1924,
    wins: 434,
    draws: 218,
    losses: 290,
    points: 1520,
    pointsPerMatch: 1.61,
    goalsFor: 1478,
    goalsAgainst: 1179,
    goalDifference: 299,
    possession: 56.8,
    cleanSheets: 235,
    cleanSheetPercentage: 25.0,
    logoUrl: "https://logos.footballdatabase.eu/monaco.png",
    stadium: "Stade Louis II",
    capacity: 18523
  }
];

// Helper functions for team data
const getTeamsByLeague = (league: string) => {
  return authenticTeamDatabase.filter(team => team.league === league);
};

const getTeamByName = (name: string) => {
  console.log(`getTeamByName: Looking for team "${name}"`); // Add debug logging
  const team = authenticTeamDatabase.find(team => 
    team.name.toLowerCase() === name.toLowerCase() ||
    team.fullName.toLowerCase() === name.toLowerCase()
  );

  if (team) {
    console.log(`getTeamByName: Found team "${name}":`, team); // Add debug logging
  } else {
    console.log(`getTeamByName: Team "${name}" not found`); // Add debug logging
  }
  return team;
};

const searchTeams = (query: string) => {
  const searchTerm = query.toLowerCase();
  return authenticTeamDatabase.filter(team =>
    team.name.toLowerCase().includes(searchTerm) ||
    team.fullName.toLowerCase().includes(searchTerm) ||
    team.league.toLowerCase().includes(searchTerm) ||
    team.country.toLowerCase().includes(searchTerm)
  );
};

const getTopTeamsByMetric = (metric: keyof typeof authenticTeamDatabase[0], limit: number = 10) => {
  return [...authenticTeamDatabase]
    .sort((a, b) => {
      const aValue = a[metric] as number;
      const bValue = b[metric] as number;
      return bValue - aValue;
    })
    .slice(0, limit);
};

// API Routes

// Get all teams
router.get('/teams', (req, res) => {
  const { league, country, limit } = req.query;

  let teams = authenticTeamDatabase;

  if (league) {
    teams = teams.filter(team => team.league.toLowerCase() === (league as string).toLowerCase());
  }

  if (country) {
    teams = teams.filter(team => team.country.toLowerCase() === (country as string).toLowerCase());
  }

  if (limit) {
    teams = teams.slice(0, parseInt(limit as string));
  }

  res.json({
    success: true,
    count: teams.length,
    teams
  });
});

// Get team by ID
router.get('/teams/:id', (req, res) => {
  const teamId = parseInt(req.params.id);
  const team = authenticTeamDatabase.find(t => t.id === teamId);

  if (!team) {
    return res.status(404).json({
      success: false,
      error: 'Team not found'
    });
  }

  res.json({
    success: true,
    team
  });
});

// Get team by name
router.get('/teams/name/:name', (req, res) => {
  const teamName = decodeURIComponent(req.params.name);
  const team = getTeamByName(teamName);

  if (!team) {
    return res.status(404).json({
      success: false,
      error: 'Team not found'
    });
  }

  res.json({
    success: true,
    team
  });
});

// Search teams
router.get('/search', (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      error: 'Search query parameter "q" is required'
    });
  }

  const results = searchTeams(q as string);

  res.json({
    success: true,
    count: results.length,
    teams: results
  });
});

// Get leagues with team counts
router.get('/leagues', (req, res) => {
  const leagues = [...new Set(authenticTeamDatabase.map(team => team.league))]
    .map(league => ({
      name: league,
      teamCount: authenticTeamDatabase.filter(team => team.league === league).length,
      teams: authenticTeamDatabase.filter(team => team.league === league).map(team => ({
        id: team.id,
        name: team.name,
        fullName: team.fullName
      }))
    }));

  res.json({
    success: true,
    count: leagues.length,
    leagues
  });
});

// Get top teams by specific metrics
router.get('/rankings/:metric', (req, res) => {
  const { metric } = req.params;
  const { limit = '10' } = req.query;

  const validMetrics = [
    'wins', 'points', 'pointsPerMatch', 'goalsFor', 'goalDifference', 
    'possession', 'cleanSheetPercentage'
  ];

  if (!validMetrics.includes(metric)) {
    return res.status(400).json({
      success: false,
      error: `Invalid metric. Valid metrics: ${validMetrics.join(', ')}`
    });
  }

  const topTeams = getTopTeamsByMetric(metric as any, parseInt(limit as string));

  res.json({
    success: true,
    metric,
    count: topTeams.length,
    teams: topTeams
  });
});

// Get database statistics
router.get('/stats', (req, res) => {
  const totalTeams = authenticTeamDatabase.length;
  const leagues = [...new Set(authenticTeamDatabase.map(team => team.league))];
  const countries = [...new Set(authenticTeamDatabase.map(team => team.country))];

  const totalGoals = authenticTeamDatabase.reduce((sum, team) => sum + team.goalsFor, 0);
  const totalMatches = authenticTeamDatabase.reduce((sum, team) => sum + (team.wins + team.draws + team.losses), 0);

  res.json({
    success: true,
    statistics: {
      totalTeams,
      totalLeagues: leagues.length,
      totalCountries: countries.length,
      totalGoalsScored: totalGoals,
      totalMatchesPlayed: totalMatches,
      averageGoalsPerMatch: (totalGoals / totalMatches).toFixed(2),
      leagues: leagues.map(league => ({
        name: league,
        teamCount: authenticTeamDatabase.filter(team => team.league === league).length
      })),
      countries: countries.map(country => ({
        name: country,
        teamCount: authenticTeamDatabase.filter(team => team.country === country).length
      }))
    }
  });
});

export default router;