// Comprehensive Team Database for Top 6 European Leagues
export interface TeamInfo {
  name: string;
  league: string;
  country: string;
  founded: number;
  stadium: string;
  capacity: number;
  manager: string;
  website: string;
  colors: {
    primary: string;
    secondary: string;
  };
  marketValue: number;
  revenue: number;
  ffpStatus: string;
}

export const COMPREHENSIVE_TEAM_DATABASE: Record<string, TeamInfo> = {
  // PREMIER LEAGUE
  'Liverpool': {
    name: 'Liverpool',
    league: 'Premier League',
    country: 'England',
    founded: 1892,
    stadium: 'Anfield',
    capacity: 53394,
    manager: 'Arne Slot',
    website: 'https://www.liverpoolfc.com',
    colors: { primary: '#C8102E', secondary: '#F6EB61' },
    marketValue: 850000000,
    revenue: 594000000,
    ffpStatus: 'Compliant'
  },
  'Arsenal': {
    name: 'Arsenal',
    league: 'Premier League',
    country: 'England',
    founded: 1886,
    stadium: 'Emirates Stadium',
    capacity: 60704,
    manager: 'Mikel Arteta',
    website: 'https://www.arsenal.com',
    colors: { primary: '#EF0107', secondary: '#063672' },
    marketValue: 780000000,
    revenue: 464000000,
    ffpStatus: 'Compliant'
  },
  'Chelsea': {
    name: 'Chelsea',
    league: 'Premier League',
    country: 'England',
    founded: 1905,
    stadium: 'Stamford Bridge',
    capacity: 40834,
    manager: 'Mauricio Pochettino',
    website: 'https://www.chelseafc.com',
    colors: { primary: '#034694', secondary: '#FFFFFF' },
    marketValue: 820000000,
    revenue: 568000000,
    ffpStatus: 'Under Review'
  },
  'Manchester City': {
    name: 'Manchester City',
    league: 'Premier League',
    country: 'England',
    founded: 1880,
    stadium: 'Etihad Stadium',
    capacity: 55017,
    manager: 'Pep Guardiola',
    website: 'https://www.mancity.com',
    colors: { primary: '#6CABDD', secondary: '#1C2C5B' },
    marketValue: 1050000000,
    revenue: 712000000,
    ffpStatus: 'Under Investigation'
  },
  'Manchester United': {
    name: 'Manchester United',
    league: 'Premier League',
    country: 'England',
    founded: 1878,
    stadium: 'Old Trafford',
    capacity: 74310,
    manager: 'Erik ten Hag',
    website: 'https://www.manutd.com',
    colors: { primary: '#DA020E', secondary: '#FBE122' },
    marketValue: 890000000,
    revenue: 648000000,
    ffpStatus: 'Compliant'
  },
  'Tottenham Hotspur': {
    name: 'Tottenham Hotspur',
    league: 'Premier League',
    country: 'England',
    founded: 1882,
    stadium: 'Tottenham Hotspur Stadium',
    capacity: 62850,
    manager: 'Ange Postecoglou',
    website: 'https://www.tottenhamhotspur.com',
    colors: { primary: '#132257', secondary: '#FFFFFF' },
    marketValue: 720000000,
    revenue: 523000000,
    ffpStatus: 'Compliant'
  },
  'Newcastle United': {
    name: 'Newcastle United',
    league: 'Premier League',
    country: 'England',
    founded: 1892,
    stadium: 'St. James\' Park',
    capacity: 52305,
    manager: 'Eddie Howe',
    website: 'https://www.nufc.co.uk',
    colors: { primary: '#241F20', secondary: '#FFFFFF' },
    marketValue: 650000000,
    revenue: 250000000,
    ffpStatus: 'Monitoring'
  },
  'Brighton & Hove Albion': {
    name: 'Brighton & Hove Albion',
    league: 'Premier League',
    country: 'England',
    founded: 1901,
    stadium: 'American Express Community Stadium',
    capacity: 31800,
    manager: 'Roberto De Zerbi',
    website: 'https://www.brightonandhovealbion.com',
    colors: { primary: '#0057B8', secondary: '#FFFFFF' },
    marketValue: 420000000,
    revenue: 215000000,
    ffpStatus: 'Compliant'
  },
  'Aston Villa': {
    name: 'Aston Villa',
    league: 'Premier League',
    country: 'England',
    founded: 1874,
    stadium: 'Villa Park',
    capacity: 42095,
    manager: 'Unai Emery',
    website: 'https://www.avfc.co.uk',
    colors: { primary: '#95BFE5', secondary: '#7A003C' },
    marketValue: 580000000,
    revenue: 218000000,
    ffpStatus: 'Compliant'
  },
  'West Ham United': {
    name: 'West Ham United',
    league: 'Premier League',
    country: 'England',
    founded: 1895,
    stadium: 'London Stadium',
    capacity: 66000,
    manager: 'David Moyes',
    website: 'https://www.whufc.com',
    colors: { primary: '#7A263A', secondary: '#1BB1E7' },
    marketValue: 450000000,
    revenue: 301000000,
    ffpStatus: 'Compliant'
  },

  // LA LIGA
  'Real Madrid': {
    name: 'Real Madrid',
    league: 'La Liga',
    country: 'Spain',
    founded: 1902,
    stadium: 'Santiago Bernabéu',
    capacity: 81044,
    manager: 'Carlo Ancelotti',
    website: 'https://www.realmadrid.com',
    colors: { primary: '#FEBE10', secondary: '#00529F' },
    marketValue: 1200000000,
    revenue: 757000000,
    ffpStatus: 'Compliant'
  },
  'Barcelona': {
    name: 'Barcelona',
    league: 'La Liga',
    country: 'Spain',
    founded: 1899,
    stadium: 'Camp Nou',
    capacity: 99354,
    manager: 'Hansi Flick',
    website: 'https://www.fcbarcelona.com',
    colors: { primary: '#A50044', secondary: '#004D98' },
    marketValue: 980000000,
    revenue: 582000000,
    ffpStatus: 'Under Review'
  },
  'Atletico Madrid': {
    name: 'Atletico Madrid',
    league: 'La Liga',
    country: 'Spain',
    founded: 1903,
    stadium: 'Cívitas Metropolitano',
    capacity: 68456,
    manager: 'Diego Simeone',
    website: 'https://www.atleticodemadrid.com',
    colors: { primary: '#CE2029', secondary: '#FFFFFF' },
    marketValue: 620000000,
    revenue: 367000000,
    ffpStatus: 'Compliant'
  },
  'Athletic Bilbao': {
    name: 'Athletic Bilbao',
    league: 'La Liga',
    country: 'Spain',
    founded: 1898,
    stadium: 'San Mamés',
    capacity: 53289,
    manager: 'Ernesto Valverde',
    website: 'https://www.athletic-club.eus',
    colors: { primary: '#EE2523', secondary: '#FFFFFF' },
    marketValue: 380000000,
    revenue: 195000000,
    ffpStatus: 'Compliant'
  },
  'Real Sociedad': {
    name: 'Real Sociedad',
    league: 'La Liga',
    country: 'Spain',
    founded: 1909,
    stadium: 'Reale Arena',
    capacity: 39500,
    manager: 'Imanol Alguacil',
    website: 'https://www.realsociedad.eus',
    colors: { primary: '#003399', secondary: '#FFFFFF' },
    marketValue: 320000000,
    revenue: 125000000,
    ffpStatus: 'Compliant'
  },
  'Villarreal': {
    name: 'Villarreal',
    league: 'La Liga',
    country: 'Spain',
    founded: 1923,
    stadium: 'Estadio de la Cerámica',
    capacity: 23500,
    manager: 'Marcelino García',
    website: 'https://www.villarrealcf.es',
    colors: { primary: '#FFE135', secondary: '#003DA5' },
    marketValue: 340000000,
    revenue: 195000000,
    ffpStatus: 'Compliant'
  },

  // SERIE A
  'Juventus': {
    name: 'Juventus',
    league: 'Serie A',
    country: 'Italy',
    founded: 1897,
    stadium: 'Allianz Stadium',
    capacity: 41507,
    manager: 'Massimiliano Allegri',
    website: 'https://www.juventus.com',
    colors: { primary: '#000000', secondary: '#FFFFFF' },
    marketValue: 680000000,
    revenue: 401000000,
    ffpStatus: 'Under Review'
  },
  'AC Milan': {
    name: 'AC Milan',
    league: 'Serie A',
    country: 'Italy',
    founded: 1899,
    stadium: 'San Siro',
    capacity: 75923,
    manager: 'Paulo Fonseca',
    website: 'https://www.acmilan.com',
    colors: { primary: '#FB090B', secondary: '#000000' },
    marketValue: 620000000,
    revenue: 264000000,
    ffpStatus: 'Compliant'
  },
  'Inter Milan': {
    name: 'Inter Milan',
    league: 'Serie A',
    country: 'Italy',
    founded: 1908,
    stadium: 'San Siro',
    capacity: 75923,
    manager: 'Simone Inzaghi',
    website: 'https://www.inter.it',
    colors: { primary: '#0068A8', secondary: '#000000' },
    marketValue: 580000000,
    revenue: 364000000,
    ffpStatus: 'Monitoring'
  },
  'Napoli': {
    name: 'Napoli',
    league: 'Serie A',
    country: 'Italy',
    founded: 1926,
    stadium: 'Stadio Diego Armando Maradona',
    capacity: 54726,
    manager: 'Walter Mazzarri',
    website: 'https://www.sscnapoli.it',
    colors: { primary: '#087BC4', secondary: '#FFFFFF' },
    marketValue: 520000000,
    revenue: 207000000,
    ffpStatus: 'Compliant'
  },
  'AS Roma': {
    name: 'AS Roma',
    league: 'Serie A',
    country: 'Italy',
    founded: 1927,
    stadium: 'Stadio Olimpico',
    capacity: 70634,
    manager: 'José Mourinho',
    website: 'https://www.asroma.com',
    colors: { primary: '#8B0000', secondary: '#FFD700' },
    marketValue: 420000000,
    revenue: 206000000,
    ffpStatus: 'Compliant'
  },
  'Lazio': {
    name: 'Lazio',
    league: 'Serie A',
    country: 'Italy',
    founded: 1900,
    stadium: 'Stadio Olimpico',
    capacity: 70634,
    manager: 'Maurizio Sarri',
    website: 'https://www.sslazio.it',
    colors: { primary: '#87CEEB', secondary: '#FFFFFF' },
    marketValue: 350000000,
    revenue: 174000000,
    ffpStatus: 'Compliant'
  },

  // BUNDESLIGA
  'Bayern Munich': {
    name: 'Bayern Munich',
    league: 'Bundesliga',
    country: 'Germany',
    founded: 1900,
    stadium: 'Allianz Arena',
    capacity: 75000,
    manager: 'Vincent Kompany',
    website: 'https://fcbayern.com',
    colors: { primary: '#DC052D', secondary: '#0066B2' },
    marketValue: 920000000,
    revenue: 654000000,
    ffpStatus: 'Compliant'
  },
  'Borussia Dortmund': {
    name: 'Borussia Dortmund',
    league: 'Bundesliga',
    country: 'Germany',
    founded: 1909,
    stadium: 'Signal Iduna Park',
    capacity: 81365,
    manager: 'Edin Terzić',
    website: 'https://www.bvb.de',
    colors: { primary: '#FDE100', secondary: '#000000' },
    marketValue: 580000000,
    revenue: 365000000,
    ffpStatus: 'Compliant'
  },
  'RB Leipzig': {
    name: 'RB Leipzig',
    league: 'Bundesliga',
    country: 'Germany',
    founded: 2009,
    stadium: 'Red Bull Arena',
    capacity: 47069,
    manager: 'Marco Rose',
    website: 'https://www.dierotenbullen.com',
    colors: { primary: '#DD0031', secondary: '#FFFFFF' },
    marketValue: 480000000,
    revenue: 267000000,
    ffpStatus: 'Compliant'
  },
  'Bayer Leverkusen': {
    name: 'Bayer Leverkusen',
    league: 'Bundesliga',
    country: 'Germany',
    founded: 1904,
    stadium: 'BayArena',
    capacity: 30210,
    manager: 'Xabi Alonso',
    website: 'https://www.bayer04.de',
    colors: { primary: '#E32221', secondary: '#000000' },
    marketValue: 420000000,
    revenue: 285000000,
    ffpStatus: 'Compliant'
  },
  'Eintracht Frankfurt': {
    name: 'Eintracht Frankfurt',
    league: 'Bundesliga',
    country: 'Germany',
    founded: 1899,
    stadium: 'Deutsche Bank Park',
    capacity: 51500,
    manager: 'Oliver Glasner',
    website: 'https://www.eintracht.de',
    colors: { primary: '#E1000F', secondary: '#000000' },
    marketValue: 320000000,
    revenue: 174000000,
    ffpStatus: 'Compliant'
  },

  // LIGUE 1
  'Paris Saint-Germain': {
    name: 'Paris Saint-Germain',
    league: 'Ligue 1',
    country: 'France',
    founded: 1970,
    stadium: 'Parc des Princes',
    capacity: 48583,
    manager: 'Luis Enrique',
    website: 'https://www.psg.fr',
    colors: { primary: '#004170', secondary: '#DA020E' },
    marketValue: 920000000,
    revenue: 654000000,
    ffpStatus: 'Monitoring'
  },
  'PSG': {
    name: 'Paris Saint-Germain',
    league: 'Ligue 1',
    country: 'France',
    founded: 1970,
    stadium: 'Parc des Princes',
    capacity: 48583,
    manager: 'Luis Enrique',
    website: 'https://www.psg.fr',
    colors: { primary: '#004170', secondary: '#DA020E' },
    marketValue: 920000000,
    revenue: 654000000,
    ffpStatus: 'Monitoring'
  },
  'AS Monaco': {
    name: 'AS Monaco',
    league: 'Ligue 1',
    country: 'France',
    founded: 1924,
    stadium: 'Stade Louis II',
    capacity: 18523,
    manager: 'Adi Hütter',
    website: 'https://www.asmonaco.com',
    colors: { primary: '#CE1126', secondary: '#FFFFFF' },
    marketValue: 380000000,
    revenue: 174000000,
    ffpStatus: 'Compliant'
  },
  'Lille': {
    name: 'Lille',
    league: 'Ligue 1',
    country: 'France',
    founded: 1944,
    stadium: 'Stade Pierre-Mauroy',
    capacity: 50186,
    manager: 'Paulo Fonseca',
    website: 'https://www.losc.fr',
    colors: { primary: '#D2001F', secondary: '#FFFFFF' },
    marketValue: 280000000,
    revenue: 135000000,
    ffpStatus: 'Compliant'
  },
  'Nice': {
    name: 'Nice',
    league: 'Ligue 1',
    country: 'France',
    founded: 1904,
    stadium: 'Allianz Riviera',
    capacity: 35624,
    manager: 'Francesco Farioli',
    website: 'https://www.ogcnice.com',
    colors: { primary: '#B50E34', secondary: '#000000' },
    marketValue: 240000000,
    revenue: 127000000,
    ffpStatus: 'Compliant'
  },
  'Rennes': {
    name: 'Rennes',
    league: 'Ligue 1',
    country: 'France',
    founded: 1901,
    stadium: 'Roazhon Park',
    capacity: 29778,
    manager: 'Bruno Génésio',
    website: 'https://www.staderennais.com',
    colors: { primary: '#FF0000', secondary: '#000000' },
    marketValue: 220000000,
    revenue: 98000000,
    ffpStatus: 'Compliant'
  },

  // LIGA PORTUGAL
  'Benfica': {
    name: 'Benfica',
    league: 'Liga Portugal',
    country: 'Portugal',
    founded: 1904,
    stadium: 'Estádio da Luz',
    capacity: 64642,
    manager: 'Roger Schmidt',
    website: 'https://www.slbenfica.pt',
    colors: { primary: '#FF0000', secondary: '#FFFFFF' },
    marketValue: 280000000,
    revenue: 89000000,
    ffpStatus: 'Compliant'
  },
  'Porto': {
    name: 'Porto',
    league: 'Liga Portugal',
    country: 'Portugal',
    founded: 1893,
    stadium: 'Estádio do Dragão',
    capacity: 50033,
    manager: 'Sérgio Conceição',
    website: 'https://www.fcporto.pt',
    colors: { primary: '#003DA5', secondary: '#FFFFFF' },
    marketValue: 260000000,
    revenue: 94000000,
    ffpStatus: 'Compliant'
  },
  'Sporting CP': {
    name: 'Sporting CP',
    league: 'Liga Portugal',
    country: 'Portugal',
    founded: 1906,
    stadium: 'Estádio José Alvalade',
    capacity: 50095,
    manager: 'Rúben Amorim',
    website: 'https://www.sporting.pt',
    colors: { primary: '#006600', secondary: '#FFFFFF' },
    marketValue: 220000000,
    revenue: 73000000,
    ffpStatus: 'Compliant'
  },
  'Braga': {
    name: 'Braga',
    league: 'Liga Portugal',
    country: 'Portugal',
    founded: 1921,
    stadium: 'Estádio Municipal de Braga',
    capacity: 30286,
    manager: 'Artur Jorge',
    website: 'https://www.scbraga.pt',
    colors: { primary: '#FF0000', secondary: '#FFFFFF' },
    marketValue: 120000000,
    revenue: 45000000,
    ffpStatus: 'Compliant'
  },
  'Vitória SC': {
    name: 'Vitória SC',
    league: 'Liga Portugal',
    country: 'Portugal',
    founded: 1922,
    stadium: 'Estádio D. Afonso Henriques',
    capacity: 30029,
    manager: 'Moreno Teixeira',
    website: 'https://www.vsc.pt',
    colors: { primary: '#FFFFFF', secondary: '#000000' },
    marketValue: 85000000,
    revenue: 35000000,
    ffpStatus: 'Compliant'
  }
};

export function getTeamInfo(teamName: string): TeamInfo | null {
  return COMPREHENSIVE_TEAM_DATABASE[teamName] || null;
}

export function getTeamsByLeague(league: string): TeamInfo[] {
  return Object.values(COMPREHENSIVE_TEAM_DATABASE).filter(team => team.league === league);
}

export function getAllTeams(): TeamInfo[] {
  return Object.values(COMPREHENSIVE_TEAM_DATABASE);
}

export function searchTeams(query: string): TeamInfo[] {
  const searchTerm = query.toLowerCase();
  return Object.values(COMPREHENSIVE_TEAM_DATABASE).filter(team => 
    team.name.toLowerCase().includes(searchTerm) ||
    team.league.toLowerCase().includes(searchTerm) ||
    team.country.toLowerCase().includes(searchTerm)
  );
}