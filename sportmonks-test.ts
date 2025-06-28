// Server-side Sportmonks API testing endpoint
import { Router } from 'express';

const router = Router();

// Comprehensive player database for all major European leagues
const comprehensivePlayerDatabase = [
  // Premier League - Liverpool
  { id: 1, name: "Mohamed Salah", team: "Liverpool", position: "RW", age: 32, nationality: "Egypt", marketValue: 65000000, goals: 24, assists: 13, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/5/mohamed-salah.png" },
  { id: 2, name: "Virgil van Dijk", team: "Liverpool", position: "CB", age: 33, nationality: "Netherlands", marketValue: 45000000, goals: 3, assists: 2, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/6/virgil-van-dijk.png" },
  { id: 3, name: "Sadio Mané", team: "Al Nassr", position: "LW", age: 32, nationality: "Senegal", marketValue: 25000000, goals: 18, assists: 7, league: "Saudi Pro League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/7/sadio-mane.png" },
  
  // Manchester City
  { id: 4, name: "Erling Haaland", team: "Manchester City", position: "ST", age: 24, nationality: "Norway", marketValue: 180000000, goals: 36, assists: 8, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/8/erling-haaland.png" },
  { id: 5, name: "Kevin De Bruyne", team: "Napoli", position: "CM", age: 33, nationality: "Belgium", marketValue: 70000000, goals: 12, assists: 18, league: "Serie A", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/9/kevin-de-bruyne.png" },
  
  // Arsenal
  { id: 6, name: "Bukayo Saka", team: "Arsenal", position: "RW", age: 23, nationality: "England", marketValue: 120000000, goals: 16, assists: 9, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/10/bukayo-saka.png" },
  { id: 7, name: "Martin Ødegaard", team: "Arsenal", position: "CAM", age: 26, nationality: "Norway", marketValue: 100000000, goals: 11, assists: 10, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/11/martin-odegaard.png" },
  
  // Chelsea
  { id: 8, name: "Cole Palmer", team: "Chelsea", position: "CAM", age: 22, nationality: "England", marketValue: 80000000, goals: 22, assists: 11, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/12/cole-palmer.png" },
  { id: 9, name: "Enzo Fernández", team: "Chelsea", position: "CM", age: 23, nationality: "Argentina", marketValue: 85000000, goals: 3, assists: 4, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/13/enzo-fernandez.png" },
  
  // Manchester United
  { id: 10, name: "Bruno Fernandes", team: "Manchester United", position: "CAM", age: 30, nationality: "Portugal", marketValue: 75000000, goals: 15, assists: 13, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/14/bruno-fernandes.png" },
  { id: 11, name: "Marcus Rashford", team: "Manchester United", position: "LW", age: 27, nationality: "England", marketValue: 85000000, goals: 8, assists: 5, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/15/marcus-rashford.png" },
  
  // Tottenham
  { id: 12, name: "Son Heung-min", team: "Tottenham", position: "LW", age: 32, nationality: "South Korea", marketValue: 40000000, goals: 17, assists: 10, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/16/son-heung-min.png" },
  { id: 13, name: "James Maddison", team: "Tottenham", position: "CAM", age: 27, nationality: "England", marketValue: 60000000, goals: 4, assists: 9, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/17/james-maddison.png" },
  
  // Newcastle United
  { id: 14, name: "Alexander Isak", team: "Newcastle United", position: "ST", age: 25, nationality: "Sweden", marketValue: 70000000, goals: 21, assists: 2, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/18/alexander-isak.png" },
  { id: 15, name: "Bruno Guimarães", team: "Newcastle United", position: "CM", age: 26, nationality: "Brazil", marketValue: 80000000, goals: 7, assists: 8, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/19/bruno-guimaraes.png" },
  
  // Real Madrid
  { id: 16, name: "Kylian Mbappé", team: "Real Madrid", position: "ST", age: 26, nationality: "France", marketValue: 180000000, goals: 28, assists: 7, league: "La Liga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/20/kylian-mbappe.png" },
  { id: 17, name: "Vinícius Jr.", team: "Real Madrid", position: "LW", age: 24, nationality: "Brazil", marketValue: 150000000, goals: 24, assists: 9, league: "La Liga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/21/vinicius-jr.png" },
  { id: 18, name: "Jude Bellingham", team: "Real Madrid", position: "CM", age: 21, nationality: "England", marketValue: 180000000, goals: 19, assists: 6, league: "La Liga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/22/jude-bellingham.png" },
  
  // Barcelona
  { id: 19, name: "Robert Lewandowski", team: "Barcelona", position: "ST", age: 36, nationality: "Poland", marketValue: 15000000, goals: 26, assists: 2, league: "La Liga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/23/robert-lewandowski.png" },
  { id: 20, name: "Pedri", team: "Barcelona", position: "CM", age: 22, nationality: "Spain", marketValue: 100000000, goals: 2, assists: 8, league: "La Liga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/24/pedri.png" },
  { id: 21, name: "Gavi", team: "Barcelona", position: "CM", age: 20, nationality: "Spain", marketValue: 90000000, goals: 1, assists: 3, league: "La Liga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/25/gavi.png" },
  
  // Bayern Munich
  { id: 22, name: "Harry Kane", team: "Bayern Munich", position: "ST", age: 31, nationality: "England", marketValue: 100000000, goals: 44, assists: 12, league: "Bundesliga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/26/harry-kane.png" },
  { id: 23, name: "Jamal Musiala", team: "Bayern Munich", position: "CAM", age: 21, nationality: "Germany", marketValue: 130000000, goals: 12, assists: 8, league: "Bundesliga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/27/jamal-musiala.png" },
  { id: 24, name: "Joshua Kimmich", team: "Bayern Munich", position: "CM", age: 29, nationality: "Germany", marketValue: 60000000, goals: 4, assists: 17, league: "Bundesliga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/28/joshua-kimmich.png" },
  
  // PSG
  { id: 25, name: "Ousmane Dembélé", team: "PSG", position: "RW", age: 27, nationality: "France", marketValue: 50000000, goals: 14, assists: 10, league: "Ligue 1", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/29/ousmane-dembele.png" },
  { id: 26, name: "Sergio Ramos", team: "PSG", position: "CB", age: 38, nationality: "Spain", marketValue: 3000000, goals: 2, assists: 0, league: "Ligue 1", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/30/sergio-ramos.png" },
  
  // Inter Milan
  { id: 27, name: "Lautaro Martínez", team: "Inter Milan", position: "ST", age: 27, nationality: "Argentina", marketValue: 90000000, goals: 24, assists: 4, league: "Serie A", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/31/lautaro-martinez.png" },
  { id: 28, name: "Nicolò Barella", team: "Inter Milan", position: "CM", age: 27, nationality: "Italy", marketValue: 80000000, goals: 6, assists: 7, league: "Serie A", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/32/nicolo-barella.png" },
  
  // AC Milan
  { id: 29, name: "Rafael Leão", team: "AC Milan", position: "LW", age: 25, nationality: "Portugal", marketValue: 90000000, goals: 15, assists: 8, league: "Serie A", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/33/rafael-leao.png" },
  { id: 30, name: "Mike Maignan", team: "AC Milan", position: "GK", age: 28, nationality: "France", marketValue: 70000000, goals: 0, assists: 0, league: "Serie A", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/34/mike-maignan.png" },
  
  // Juventus
  { id: 31, name: "Dušan Vlahović", team: "Juventus", position: "ST", age: 24, nationality: "Serbia", marketValue: 70000000, goals: 16, assists: 3, league: "Serie A", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/35/dusan-vlahovic.png" },
  { id: 32, name: "Federico Chiesa", team: "Juventus", position: "RW", age: 26, nationality: "Italy", marketValue: 40000000, goals: 9, assists: 3, league: "Serie A", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/36/federico-chiesa.png" },
  
  // Napoli
  { id: 33, name: "Victor Osimhen", team: "Napoli", position: "ST", age: 25, nationality: "Nigeria", marketValue: 120000000, goals: 17, assists: 4, league: "Serie A", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/37/victor-osimhen.png" },
  { id: 34, name: "Khvicha Kvaratskhelia", team: "Napoli", position: "LW", age: 23, nationality: "Georgia", marketValue: 100000000, goals: 11, assists: 9, league: "Serie A", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/38/khvicha-kvaratskhelia.png" },
  
  // Borussia Dortmund
  { id: 35, name: "Karim Adeyemi", team: "Borussia Dortmund", position: "LW", age: 22, nationality: "Germany", marketValue: 35000000, goals: 8, assists: 2, league: "Bundesliga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/39/karim-adeyemi.png" },
  { id: 36, name: "Marco Reus", team: "Borussia Dortmund", position: "CAM", age: 35, nationality: "Germany", marketValue: 8000000, goals: 7, assists: 5, league: "Bundesliga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/40/marco-reus.png" },
  
  // Additional Premier League players
  { id: 37, name: "Phil Foden", team: "Manchester City", position: "CAM", age: 24, nationality: "England", marketValue: 110000000, goals: 19, assists: 8, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/41/phil-foden.png" },
  { id: 38, name: "Declan Rice", team: "Arsenal", position: "CDM", age: 25, nationality: "England", marketValue: 90000000, goals: 7, assists: 10, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/42/declan-rice.png" },
  { id: 39, name: "Kai Havertz", team: "Arsenal", position: "ST", age: 25, nationality: "Germany", marketValue: 70000000, goals: 14, assists: 7, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/43/kai-havertz.png" },
  { id: 40, name: "Darwin Núñez", team: "Liverpool", position: "ST", age: 25, nationality: "Uruguay", marketValue: 70000000, goals: 18, assists: 13, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/44/darwin-nunez.png" },
  
  // Additional La Liga players
  { id: 41, name: "Antoine Griezmann", team: "Atletico Madrid", position: "ST", age: 33, nationality: "France", marketValue: 25000000, goals: 16, assists: 6, league: "La Liga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/45/antoine-griezmann.png" },
  { id: 42, name: "Luka Modrić", team: "Real Madrid", position: "CM", age: 39, nationality: "Croatia", marketValue: 10000000, goals: 2, assists: 8, league: "La Liga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/46/luka-modric.png" },
  
  // Additional Serie A players
  { id: 43, name: "Paulo Dybala", team: "AS Roma", position: "CAM", age: 30, nationality: "Argentina", marketValue: 25000000, goals: 13, assists: 9, league: "Serie A", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/47/paulo-dybala.png" },
  { id: 44, name: "Ciro Immobile", team: "Lazio", position: "ST", age: 34, nationality: "Italy", marketValue: 8000000, goals: 7, assists: 2, league: "Serie A", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/48/ciro-immobile.png" },
  
  // Additional Bundesliga players
  { id: 45, name: "Florian Wirtz", team: "Bayer Leverkusen", position: "CAM", age: 21, nationality: "Germany", marketValue: 130000000, goals: 18, assists: 20, league: "Bundesliga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/49/florian-wirtz.png" },
  { id: 46, name: "Victor Boniface", team: "Bayer Leverkusen", position: "ST", age: 23, nationality: "Nigeria", marketValue: 60000000, goals: 21, assists: 10, league: "Bundesliga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/50/victor-boniface.png" },
  
  // Additional Ligue 1 players
  { id: 47, name: "Alexandre Lacazette", team: "Lyon", position: "ST", age: 33, nationality: "France", marketValue: 10000000, goals: 19, assists: 4, league: "Ligue 1", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/51/alexandre-lacazette.png" },
  { id: 48, name: "Wissam Ben Yedder", team: "Monaco", position: "ST", age: 34, nationality: "France", marketValue: 5000000, goals: 16, assists: 2, league: "Ligue 1", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/52/wissam-ben-yedder.png" },
  
  // Additional players across leagues for depth
  { id: 49, name: "Gianluigi Donnarumma", team: "PSG", position: "GK", age: 25, nationality: "Italy", marketValue: 60000000, goals: 0, assists: 0, league: "Ligue 1", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/53/gianluigi-donnarumma.png" },
  { id: 50, name: "Thibaut Courtois", team: "Real Madrid", position: "GK", age: 32, nationality: "Belgium", marketValue: 35000000, goals: 0, assists: 0, league: "La Liga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/54/thibaut-courtois.png" },
  
  // Extended Premier League players
  { id: 51, name: "Alisson", team: "Liverpool", position: "GK", age: 31, nationality: "Brazil", marketValue: 50000000, goals: 0, assists: 1, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/55/alisson.png" },
  { id: 52, name: "Virgil van Dijk", team: "Liverpool", position: "CB", age: 33, nationality: "Netherlands", marketValue: 45000000, goals: 3, assists: 2, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/56/virgil-van-dijk.png" },
  { id: 53, name: "Rodri", team: "Manchester City", position: "CDM", age: 28, nationality: "Spain", marketValue: 130000000, goals: 9, assists: 14, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/57/rodri.png" },
  { id: 54, name: "Bernardo Silva", team: "Manchester City", position: "CM", age: 30, nationality: "Portugal", marketValue: 80000000, goals: 8, assists: 9, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/58/bernardo-silva.png" },
  { id: 55, name: "William Saliba", team: "Arsenal", position: "CB", age: 23, nationality: "France", marketValue: 80000000, goals: 2, assists: 1, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/59/william-saliba.png" },
  { id: 56, name: "Gabriel Jesus", team: "Arsenal", position: "ST", age: 27, nationality: "Brazil", marketValue: 50000000, goals: 11, assists: 8, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/60/gabriel-jesus.png" },
  { id: 57, name: "Thiago Silva", team: "Chelsea", position: "CB", age: 40, nationality: "Brazil", marketValue: 5000000, goals: 1, assists: 0, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/61/thiago-silva.png" },
  { id: 58, name: "Christopher Nkunku", team: "Chelsea", position: "CAM", age: 26, nationality: "France", marketValue: 65000000, goals: 13, assists: 11, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/62/christopher-nkunku.png" },
  { id: 59, name: "Casemiro", team: "Manchester United", position: "CDM", age: 32, nationality: "Brazil", marketValue: 25000000, goals: 5, assists: 3, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/63/casemiro.png" },
  { id: 60, name: "Rasmus Højlund", team: "Manchester United", position: "ST", age: 21, nationality: "Denmark", marketValue: 70000000, goals: 16, assists: 2, league: "Premier League", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/64/rasmus-hojlund.png" },

  // Extended La Liga players
  { id: 61, name: "Jan Oblak", team: "Atletico Madrid", position: "GK", age: 31, nationality: "Slovenia", marketValue: 45000000, goals: 0, assists: 0, league: "La Liga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/65/jan-oblak.png" },
  { id: 62, name: "José Giménez", team: "Atletico Madrid", position: "CB", age: 29, nationality: "Uruguay", marketValue: 35000000, goals: 2, assists: 1, league: "La Liga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/66/jose-gimenez.png" },
  { id: 63, name: "Frenkie de Jong", team: "Barcelona", position: "CM", age: 27, nationality: "Netherlands", marketValue: 70000000, goals: 4, assists: 5, league: "La Liga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/67/frenkie-de-jong.png" },
  { id: 64, name: "Ferran Torres", team: "Barcelona", position: "RW", age: 24, nationality: "Spain", marketValue: 55000000, goals: 11, assists: 6, league: "La Liga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/68/ferran-torres.png" },
  { id: 65, name: "Aurélien Tchouaméni", team: "Real Madrid", position: "CM", age: 24, nationality: "France", marketValue: 100000000, goals: 3, assists: 4, league: "La Liga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/69/aurelien-tchouameni.png" },
  { id: 66, name: "Eduardo Camavinga", team: "Real Madrid", position: "CM", age: 22, nationality: "France", marketValue: 90000000, goals: 2, assists: 4, league: "La Liga", imageUrl: "https://cdn.sportmonks.com/images/soccer/players/70/eduardo-camavinga.png" }
];

// Helper functions for player data
const getPlayersByLeague = (league: string) => {
  return comprehensivePlayerDatabase.filter(player => player.league === league);
};

const getPlayersByTeam = (team: string) => {
  return comprehensivePlayerDatabase.filter(player => player.team === team);
};

const searchPlayers = (query: string) => {
  const searchTerm = query.toLowerCase();
  return comprehensivePlayerDatabase.filter(player => 
    player.name.toLowerCase().includes(searchTerm) ||
    player.team.toLowerCase().includes(searchTerm) ||
    player.position.toLowerCase().includes(searchTerm) ||
    player.nationality.toLowerCase().includes(searchTerm)
  );
};

const getPlayersByPosition = (position: string) => {
  return comprehensivePlayerDatabase.filter(player => player.position === position);
};

const getPlayersByNationality = (nationality: string) => {
  return comprehensivePlayerDatabase.filter(player => player.nationality === nationality);
};

const getPlayersByAgeRange = (minAge: number, maxAge: number) => {
  return comprehensivePlayerDatabase.filter(player => player.age >= minAge && player.age <= maxAge);
};

const getPlayersByMarketValueRange = (minValue: number, maxValue: number) => {
  return comprehensivePlayerDatabase.filter(player => player.marketValue >= minValue && player.marketValue <= maxValue);
};

// Test Sportmonks API connection
router.get('/api/test-sportmonks', async (req, res) => {
  try {
    const apiKey = process.env.SPORTMONKS_API_KEY;
    
    if (!apiKey) {
      return res.status(400).json({ 
        success: false, 
        error: 'Sportmonks API key not found' 
      });
    }

    // Test basic connection
    const testUrl = `https://api.sportmonks.com/v3/core/my-subscription?api_token=${apiKey}`;
    const response = await fetch(testUrl);
    
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: `API request failed: ${response.status} ${response.statusText}`
      });
    }

    const data = await response.json();
    
    res.json({
      success: true,
      subscription: data.subscription || data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Sportmonks API test error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test fetching sample league data
router.get('/api/test-sportmonks-leagues', async (req, res) => {
  try {
    const apiKey = process.env.SPORTMONKS_API_KEY;
    
    if (!apiKey) {
      return res.status(400).json({ 
        success: false, 
        error: 'Sportmonks API key not found' 
      });
    }

    const leaguesUrl = `https://api.sportmonks.com/v3/football/leagues?api_token=${apiKey}&include=country&filters=countryFilters:1;8;17;5;46`;
    const response = await fetch(leaguesUrl);
    
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: `API request failed: ${response.status} ${response.statusText}`
      });
    }

    const data = await response.json();
    
    res.json({
      success: true,
      leagues: data.data?.slice(0, 10) || [],
      totalFound: data.data?.length || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Sportmonks leagues test error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test fetching sample player data
router.get('/api/test-sportmonks-players/:teamId', async (req, res) => {
  try {
    const apiKey = process.env.SPORTMONKS_API_KEY;
    const { teamId } = req.params;
    
    if (!apiKey) {
      return res.status(400).json({ 
        success: false, 
        error: 'Sportmonks API key not found' 
      });
    }

    const playersUrl = `https://api.sportmonks.com/v3/football/squads/teams/${teamId}?api_token=${apiKey}&include=player,position`;
    const response = await fetch(playersUrl);
    
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: `API request failed: ${response.status} ${response.statusText}`
      });
    }

    const data = await response.json();
    const players = data.data?.map((squad: any) => squad.player).filter(Boolean) || [];
    
    res.json({
      success: true,
      players: players.slice(0, 10),
      totalFound: players.length,
      teamId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Sportmonks players test error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;