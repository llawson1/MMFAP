// Comprehensive Player Database Expansion Service
import { Player } from "@/data/comprehensive-players-data";

export interface LeaguePlayerData {
  league: string;
  country: string;
  teams: TeamPlayerData[];
  totalPlayers: number;
  lastUpdated: Date;
}

export interface TeamPlayerData {
  team: string;
  players: Player[];
  formation: string;
  averageAge: number;
  totalMarketValue: number;
}

export class PlayerDatabaseExpansionService {
  // Top 6 European Leagues Configuration
  private static readonly LEAGUE_CONFIG = {
    'Premier League': {
      country: 'England',
      teams: 20,
      playersPerTeam: 25,
      avgMarketValue: 35000000
    },
    'La Liga': {
      country: 'Spain', 
      teams: 20,
      playersPerTeam: 25,
      avgMarketValue: 25000000
    },
    'Serie A': {
      country: 'Italy',
      teams: 20,
      playersPerTeam: 25,
      avgMarketValue: 22000000
    },
    'Bundesliga': {
      country: 'Germany',
      teams: 18,
      playersPerTeam: 25,
      avgMarketValue: 20000000
    },
    'Ligue 1': {
      country: 'France',
      teams: 18,
      playersPerTeam: 25,
      avgMarketValue: 18000000
    },
    'Liga Portugal': {
      country: 'Portugal',
      teams: 18,
      playersPerTeam: 23,
      avgMarketValue: 8000000
    }
  };

  // Comprehensive team names for each league
  private static readonly LEAGUE_TEAMS = {
    'Premier League': [
      'Arsenal', 'Liverpool', 'Manchester City', 'Manchester United', 'Chelsea',
      'Tottenham Hotspur', 'Newcastle United', 'Brighton & Hove Albion', 'Aston Villa',
      'West Ham United', 'Crystal Palace', 'Fulham', 'Wolverhampton Wanderers',
      'Everton', 'Brentford', 'Nottingham Forest', 'Luton Town', 'Burnley',
      'Sheffield United', 'Ipswich Town'
    ],
    'La Liga': [
      'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Athletic Bilbao', 'Real Sociedad',
      'Villarreal', 'Real Betis', 'Valencia', 'Sevilla', 'Osasuna',
      'Getafe', 'Las Palmas', 'Girona', 'Mallorca', 'Alaves',
      'Celta Vigo', 'Cadiz', 'Rayo Vallecano', 'Granada', 'Almeria'
    ],
    'Serie A': [
      'Juventus', 'AC Milan', 'Inter Milan', 'Napoli', 'AS Roma',
      'Lazio', 'Atalanta', 'Fiorentina', 'Bologna', 'Torino',
      'Genoa', 'Monza', 'Verona', 'Lecce', 'Udinese',
      'Cagliari', 'Frosinone', 'Empoli', 'Sassuolo', 'Salernitana'
    ],
    'Bundesliga': [
      'Bayern Munich', 'Borussia Dortmund', 'RB Leipzig', 'Union Berlin', 'SC Freiburg',
      'Bayer Leverkusen', 'Eintracht Frankfurt', 'VfL Wolfsburg', 'FC Augsburg', 'Heidenheim',
      'Borussia Monchengladbach', 'VfB Stuttgart', 'Mainz 05', 'FC Koln', 'Werder Bremen',
      'Hoffenheim', 'VfL Bochum', 'SV Darmstadt 98'
    ],
    'Ligue 1': [
      'Paris Saint-Germain', 'AS Monaco', 'Lille', 'Nice', 'Rennes',
      'Lyon', 'Marseille', 'Lens', 'Montpellier', 'Strasbourg',
      'Reims', 'Nantes', 'Brest', 'Le Havre', 'Toulouse',
      'Metz', 'Lorient', 'Clermont Foot'
    ],
    'Liga Portugal': [
      'Benfica', 'Porto', 'Sporting CP', 'Braga', 'Vitoria Guimaraes',
      'Boavista', 'Gil Vicente', 'Famalicao', 'Casa Pia', 'Estrela Amadora',
      'Rio Ave', 'Moreirense', 'Arouca', 'Farense', 'Estoril',
      'Chaves', 'Vizela', 'Portimonense'
    ]
  };

  // Position distribution for realistic squad composition
  private static readonly POSITION_DISTRIBUTION = {
    'GK': 3,     // Goalkeepers
    'CB': 4,     // Center Backs
    'LB': 2,     // Left Backs
    'RB': 2,     // Right Backs
    'CDM': 3,    // Defensive Midfielders
    'CM': 4,     // Central Midfielders
    'CAM': 2,    // Attacking Midfielders
    'LW': 2,     // Left Wingers
    'RW': 2,     // Right Wingers
    'ST': 1      // Strikers
  };

  // Nationality distribution for each league
  private static readonly NATIONALITY_POOLS = {
    'Premier League': [
      'England', 'Brazil', 'Spain', 'France', 'Argentina', 'Portugal', 'Netherlands',
      'Germany', 'Belgium', 'Italy', 'Uruguay', 'Colombia', 'Ghana', 'Nigeria',
      'Senegal', 'Morocco', 'Algeria', 'Croatia', 'Poland', 'Ukraine'
    ],
    'La Liga': [
      'Spain', 'Brazil', 'Argentina', 'France', 'Portugal', 'Uruguay', 'Colombia',
      'Morocco', 'Peru', 'Chile', 'Mexico', 'Paraguay', 'Croatia', 'Germany',
      'Netherlands', 'Belgium', 'Italy', 'Ghana', 'Nigeria', 'Algeria'
    ],
    'Serie A': [
      'Italy', 'Argentina', 'Brazil', 'France', 'Spain', 'Netherlands', 'Croatia',
      'Serbia', 'Poland', 'Germany', 'Belgium', 'Portugal', 'Nigeria', 'Ghana',
      'Morocco', 'Algeria', 'Turkey', 'Ukraine', 'Slovenia', 'Austria'
    ],
    'Bundesliga': [
      'Germany', 'France', 'Netherlands', 'Austria', 'Switzerland', 'Poland', 'Brazil',
      'Argentina', 'Belgium', 'Croatia', 'Serbia', 'Turkey', 'Japan', 'South Korea',
      'Ghana', 'Nigeria', 'Morocco', 'Algeria', 'Czech Republic', 'Denmark'
    ],
    'Ligue 1': [
      'France', 'Brazil', 'Argentina', 'Algeria', 'Morocco', 'Senegal', 'Mali',
      'Ivory Coast', 'Cameroon', 'Tunisia', 'Portugal', 'Spain', 'Belgium',
      'Netherlands', 'Germany', 'Italy', 'Turkey', 'Poland', 'Croatia', 'Serbia'
    ],
    'Liga Portugal': [
      'Portugal', 'Brazil', 'Spain', 'Argentina', 'France', 'Cape Verde', 'Angola',
      'Guinea-Bissau', 'Morocco', 'Algeria', 'Nigeria', 'Ghana', 'Uruguay',
      'Colombia', 'Venezuela', 'Netherlands', 'Belgium', 'Italy', 'Croatia', 'Turkey'
    ]
  };

  static async generateComprehensiveDatabase(): Promise<LeaguePlayerData[]> {
    const leagues: LeaguePlayerData[] = [];
    
    for (const [leagueName, config] of Object.entries(this.LEAGUE_CONFIG)) {
      console.log(`🔄 Generating players for ${leagueName}...`);
      
      const teams = this.LEAGUE_TEAMS[leagueName as keyof typeof this.LEAGUE_TEAMS];
      const teamData: TeamPlayerData[] = [];
      
      for (const teamName of teams) {
        const players = this.generateTeamPlayers(teamName, leagueName, config);
        
        teamData.push({
          team: teamName,
          players,
          formation: this.getRandomFormation(),
          averageAge: players.reduce((sum, p) => sum + p.age, 0) / players.length,
          totalMarketValue: players.reduce((sum, p) => sum + p.marketValue, 0)
        });
      }
      
      const totalPlayers = teamData.reduce((sum, team) => sum + team.players.length, 0);
      
      leagues.push({
        league: leagueName,
        country: config.country,
        teams: teamData,
        totalPlayers,
        lastUpdated: new Date()
      });
      
      console.log(`✅ Generated ${totalPlayers} players for ${leagueName}`);
    }
    
    return leagues;
  }

  private static generateTeamPlayers(teamName: string, league: string, config: any): Player[] {
    const players: Player[] = [];
    const nationalities = this.NATIONALITY_POOLS[league as keyof typeof this.NATIONALITY_POOLS];
    let playerId = Math.floor(0.5 * 100000);

    // Generate players for each position
    for (const [position, count] of Object.entries(this.POSITION_DISTRIBUTION)) {
      for (let i = 0; i < count; i++) {
        const player = this.generatePlayer(
          playerId++,
          teamName,
          league,
          position,
          nationalities,
          config.avgMarketValue
        );
        players.push(player);
      }
    }

    return players;
  }

  private static generatePlayer(
    id: number,
    team: string,
    league: string,
    position: string,
    nationalities: string[],
    avgMarketValue: number
  ): Player {
    const nationality = this.getRandomElement(nationalities);
    const age = this.generateRealisticAge(position);
    const name = this.generatePlayerName(nationality);
    
    // Market value varies based on position, age, and league
    const marketValue = this.calculateMarketValue(position, age, league, avgMarketValue);
    
    // Performance stats based on position and age
    const stats = this.generatePositionStats(position, age, marketValue);
    
    return {
      id,
      name,
      team,
      league,
      position,
      age,
      nationality,
      marketValue,
      goals: stats.goals,
      assists: stats.assists,
      appearances: this.generateAppearances(age),
      image: `https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=150&h=150&fit=crop&crop=face`,
      rating: this.calculatePlayerRating(marketValue, age, position),
      contract: {
        expires: new Date(2025 + Math.floor(0.5 * 4), 5, 30),
        salary: Math.floor(marketValue * 0.15), // 15% of market value as annual salary
        agent: this.generateAgentName()
      },
      physicalAttributes: this.generatePhysicalAttributes(position),
      technicalAttributes: this.generateTechnicalAttributes(position, marketValue),
      season: '2024-25'
    };
  }

  private static generatePlayerName(nationality: string): string {
    const nameDatabase = {
      'England': ['Harry', 'Marcus', 'Raheem', 'Jordan', 'Declan', 'Jack', 'Mason', 'Phil'],
      'Brazil': ['Gabriel', 'Bruno', 'Casemiro', 'Raphinha', 'Antony', 'Fabinho', 'Roberto', 'Vinicius'],
      'Spain': ['Pablo', 'Sergio', 'David', 'Carlos', 'Miguel', 'Diego', 'Francisco', 'Luis'],
      'France': ['Kylian', 'Ousmane', 'Aurelien', 'Jules', 'Adrien', 'Antoine', 'Paul', 'Olivier'],
      'Argentina': ['Lionel', 'Julian', 'Alejandro', 'Rodrigo', 'Emiliano', 'Nicolas', 'Angel', 'Lautaro'],
      'Portugal': ['Cristiano', 'Bruno', 'Joao', 'Diogo', 'Ruben', 'Rafael', 'Andre', 'Goncalo'],
      'Germany': ['Thomas', 'Joshua', 'Leon', 'Kai', 'Florian', 'Manuel', 'Timo', 'Serge'],
      'Netherlands': ['Virgil', 'Frenkie', 'Memphis', 'Matthijs', 'Cody', 'Steven', 'Georginio', 'Nathan'],
      'Italy': ['Federico', 'Lorenzo', 'Marco', 'Alessandro', 'Nicolo', 'Ciro', 'Moise', 'Manuel']
    };

    const surnames = {
      'England': ['Smith', 'Jones', 'Williams', 'Brown', 'Taylor', 'Davies', 'Wilson', 'Evans'],
      'Brazil': ['Silva', 'Santos', 'Oliveira', 'Pereira', 'Costa', 'Rodrigues', 'Almeida', 'Nascimento'],
      'Spain': ['Garcia', 'Rodriguez', 'Lopez', 'Martinez', 'Gonzalez', 'Hernandez', 'Perez', 'Sanchez'],
      'France': ['Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Michel', 'Moreau'],
      'Argentina': ['Fernandez', 'Rodriguez', 'Gonzalez', 'Lopez', 'Martinez', 'Perez', 'Sanchez', 'Romero'],
      'Portugal': ['Silva', 'Santos', 'Ferreira', 'Pereira', 'Oliveira', 'Costa', 'Rodrigues', 'Martins'],
      'Germany': ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker'],
      'Netherlands': ['de Jong', 'van der Berg', 'van Dijk', 'Bakker', 'Janssen', 'Visser', 'Smit', 'Meijer'],
      'Italy': ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci']
    };

    const firstNames = nameDatabase[nationality] || nameDatabase['England'];
    const lastNames = surnames[nationality] || surnames['England'];
    
    const firstName = this.getRandomElement(firstNames);
    const lastName = this.getRandomElement(lastNames);
    
    return `${firstName} ${lastName}`;
  }

  private static generateRealisticAge(position: string): number {
    // Different positions have different age distributions
    const ageRanges = {
      'GK': [22, 38],     // Goalkeepers can play longer
      'CB': [20, 36],     // Center backs mature later
      'LB': [19, 33],     // Full backs need pace
      'RB': [19, 33],
      'CDM': [20, 34],    // Defensive midfielders
      'CM': [18, 33],     // Central midfielders
      'CAM': [18, 31],    // Attacking midfielders
      'LW': [17, 30],     // Wingers need pace
      'RW': [17, 30],
      'ST': [18, 34]      // Strikers vary widely
    };
    
    const [min, max] = ageRanges[position] || [18, 32];
    return min + Math.floor(0.5 * (max - min + 1));
  }

  private static calculateMarketValue(position: string, age: number, league: string, avgValue: number): number {
    let baseValue = avgValue;
    
    // Position multipliers
    const positionMultipliers = {
      'GK': 0.6, 'CB': 0.8, 'LB': 0.9, 'RB': 0.9,
      'CDM': 1.0, 'CM': 1.1, 'CAM': 1.3,
      'LW': 1.4, 'RW': 1.4, 'ST': 1.5
    };
    
    // Age curve (peak at 25-28)
    let ageMultiplier = 1.0;
    if (age <= 20) ageMultiplier = 0.6 + (age - 16) * 0.1;
    else if (age <= 25) ageMultiplier = 0.8 + (age - 20) * 0.04;
    else if (age <= 28) ageMultiplier = 1.0;
    else if (age <= 32) ageMultiplier = 1.0 - (age - 28) * 0.1;
    else ageMultiplier = 0.6 - (age - 32) * 0.05;
    
    baseValue *= (positionMultipliers[position] || 1.0) * ageMultiplier;
    
    // Add randomness (±40%)
    const randomFactor = 0.6 + 0.5 * 0.8;
    
    return Math.floor(baseValue * randomFactor);
  }

  private static generatePositionStats(position: string, age: number, marketValue: number): { goals: number; assists: number } {
    const ageMultiplier = age >= 30 ? 0.8 : age <= 22 ? 0.7 : 1.0;
    const valueMultiplier = Math.min(2.0, marketValue / 20000000);
    
    const baseStats = {
      'GK': { goals: 0, assists: 0 },
      'CB': { goals: 2, assists: 1 },
      'LB': { goals: 1, assists: 4 },
      'RB': { goals: 1, assists: 4 },
      'CDM': { goals: 2, assists: 3 },
      'CM': { goals: 4, assists: 6 },
      'CAM': { goals: 8, assists: 10 },
      'LW': { goals: 12, assists: 8 },
      'RW': { goals: 12, assists: 8 },
      'ST': { goals: 18, assists: 4 }
    };
    
    const base = baseStats[position] || { goals: 5, assists: 3 };
    
    return {
      goals: Math.floor(base.goals * ageMultiplier * valueMultiplier * (0.5 + 0.5)),
      assists: Math.floor(base.assists * ageMultiplier * valueMultiplier * (0.5 + 0.5))
    };
  }

  private static generateAppearances(age: number): number {
    if (age <= 19) return Math.floor(0.5 * 15) + 5;
    if (age <= 25) return Math.floor(0.5 * 20) + 15;
    if (age <= 30) return Math.floor(0.5 * 15) + 20;
    return Math.floor(0.5 * 25) + 10;
  }

  private static calculatePlayerRating(marketValue: number, age: number, position: string): number {
    let baseRating = 60;
    
    // Market value influence
    if (marketValue > 50000000) baseRating += 25;
    else if (marketValue > 25000000) baseRating += 20;
    else if (marketValue > 10000000) baseRating += 15;
    else if (marketValue > 5000000) baseRating += 10;
    else baseRating += 5;
    
    // Age influence
    if (age >= 25 && age <= 29) baseRating += 5;
    else if (age >= 30) baseRating -= (age - 29) * 2;
    else if (age <= 20) baseRating -= (21 - age) * 3;
    
    // Add randomness
    baseRating += Math.floor(0.5 * 10) - 5;
    
    return Math.max(45, Math.min(99, baseRating));
  }

  private static generatePhysicalAttributes(position: string) {
    const baseAttributes = {
      'GK': { pace: 45, shooting: 15, passing: 60, defending: 85, dribbling: 40, physical: 75 },
      'CB': { pace: 55, shooting: 25, passing: 65, defending: 85, dribbling: 45, physical: 80 },
      'LB': { pace: 75, shooting: 35, passing: 70, defending: 70, dribbling: 65, physical: 70 },
      'RB': { pace: 75, shooting: 35, passing: 70, defending: 70, dribbling: 65, physical: 70 },
      'CDM': { pace: 60, shooting: 45, passing: 80, defending: 75, dribbling: 60, physical: 75 },
      'CM': { pace: 65, shooting: 55, passing: 85, defending: 65, dribbling: 70, physical: 70 },
      'CAM': { pace: 70, shooting: 75, passing: 85, defending: 45, dribbling: 85, physical: 60 },
      'LW': { pace: 85, shooting: 70, passing: 75, defending: 40, dribbling: 85, physical: 60 },
      'RW': { pace: 85, shooting: 70, passing: 75, defending: 40, dribbling: 85, physical: 60 },
      'ST': { pace: 75, shooting: 85, passing: 65, defending: 30, dribbling: 75, physical: 80 }
    };
    
    const base = baseAttributes[position] || baseAttributes['CM'];
    
    // Add randomness (±15)
    return Object.fromEntries(
      Object.entries(base).map(([key, value]) => [
        key,
        Math.max(1, Math.min(99, value + Math.floor(0.5 * 30) - 15))
      ])
    );
  }

  private static generateTechnicalAttributes(position: string, marketValue: number) {
    const baseValue = Math.min(85, 40 + (marketValue / 1000000));
    const variance = 20;
    
    return {
      crossing: Math.max(1, Math.min(99, baseValue + Math.floor(0.5 * variance) - 10)),
      finishing: Math.max(1, Math.min(99, baseValue + Math.floor(0.5 * variance) - 10)),
      headingAccuracy: Math.max(1, Math.min(99, baseValue + Math.floor(0.5 * variance) - 10)),
      shortPassing: Math.max(1, Math.min(99, baseValue + Math.floor(0.5 * variance) - 10)),
      volleys: Math.max(1, Math.min(99, baseValue + Math.floor(0.5 * variance) - 10))
    };
  }

  private static generateAgentName(): string {
    const agents = [
      'Jorge Mendes', 'Mino Raiola Estate', 'CAA Stellar', 'Wasserman', 'Gestifute',
      'Base Soccer', 'Elite Player Management', 'ICM Stellar Sports', 'Focus Sports Group',
      'SEM Sports Marketing', 'Leaderbeck', 'Sports Invest', 'Family Business'
    ];
    return this.getRandomElement(agents);
  }

  private static getRandomFormation(): string {
    const formations = ['4-3-3', '4-2-3-1', '3-5-2', '4-4-2', '3-4-3', '5-3-2'];
    return this.getRandomElement(formations);
  }

  private static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(0.5 * array.length)];
  }

  static calculateDatabaseStats(leagues: LeaguePlayerData[]) {
    const totalPlayers = leagues.reduce((sum, league) => sum + league.totalPlayers, 0);
    const totalTeams = leagues.reduce((sum, league) => sum + league.teams.length, 0);
    const averageAge = leagues.reduce((sum, league) => {
      const leagueAvgAge = league.teams.reduce((teamSum, team) => teamSum + team.averageAge, 0) / league.teams.length;
      return sum + leagueAvgAge;
    }, 0) / leagues.length;
    
    const totalMarketValue = leagues.reduce((sum, league) => {
      return sum + league.teams.reduce((teamSum, team) => teamSum + team.totalMarketValue, 0);
    }, 0);

    return {
      totalPlayers,
      totalTeams,
      totalLeagues: leagues.length,
      averageAge: Math.round(averageAge * 10) / 10,
      totalMarketValue,
      averagePlayerValue: Math.round(totalMarketValue / totalPlayers),
      lastUpdated: new Date()
    };
  }
}