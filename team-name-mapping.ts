// Team name mapping utility for consistent URL encoding and navigation
export const getTeamNameMapping = (urlTeamName: string): string => {
  const mappings: { [key: string]: string } = {
    // Ligue 1
    'paris-saint-germain': 'Paris Saint-Germain',
    'psg': 'Paris Saint-Germain',
    'olympique-marseille': 'Marseille',
    'olympique-lyonnais': 'Lyon',
    'as-monaco': 'AS Monaco',
    'monaco': 'AS Monaco',
    'lille': 'Lille',
    'nice': 'Nice',
    'rennes': 'Rennes',
    
    // Serie A
    'ac-milan': 'AC Milan',
    'milan': 'AC Milan',
    'inter-milan': 'Inter Milan',
    'inter': 'Inter Milan',
    'internazionale': 'Inter Milan',
    'as-roma': 'AS Roma',
    'roma': 'AS Roma',
    'ssc-napoli': 'Napoli',
    'napoli': 'Napoli',
    'juventus-fc': 'Juventus',
    'juventus': 'Juventus',
    'lazio': 'Lazio',
    
    // La Liga
    'atletico-madrid': 'Atletico Madrid',
    'atletico': 'Atletico Madrid',
    'real-madrid': 'Real Madrid',
    'madrid': 'Real Madrid',
    'fc-barcelona': 'Barcelona',
    'barcelona': 'Barcelona',
    'barca': 'Barcelona',
    'athletic-bilbao': 'Athletic Bilbao',
    'athletic': 'Athletic Bilbao',
    'real-sociedad': 'Real Sociedad',
    'sociedad': 'Real Sociedad',
    'villarreal': 'Villarreal',
    
    // Bundesliga
    'bayern-munich': 'Bayern Munich',
    'bayern': 'Bayern Munich',
    'borussia-dortmund': 'Borussia Dortmund',
    'dortmund': 'Borussia Dortmund',
    'bvb': 'Borussia Dortmund',
    'bayer-leverkusen': 'Bayer Leverkusen',
    'leverkusen': 'Bayer Leverkusen',
    'rb-leipzig': 'RB Leipzig',
    'leipzig': 'RB Leipzig',
    'eintracht-frankfurt': 'Eintracht Frankfurt',
    'frankfurt': 'Eintracht Frankfurt',
    
    // Premier League
    'manchester-united': 'Manchester United',
    'man-united': 'Manchester United',
    'manchester-city': 'Manchester City',
    'man-city': 'Manchester City',
    'city': 'Manchester City',
    'newcastle-united': 'Newcastle United',
    'newcastle': 'Newcastle United',
    'tottenham-hotspur': 'Tottenham Hotspur',
    'tottenham': 'Tottenham Hotspur',
    'spurs': 'Tottenham Hotspur',
    'west-ham-united': 'West Ham United',
    'west-ham': 'West Ham United',
    'aston-villa': 'Aston Villa',
    'villa': 'Aston Villa',
    'brighton-hove-albion': 'Brighton & Hove Albion',
    'brighton': 'Brighton & Hove Albion',
    'arsenal': 'Arsenal',
    'liverpool': 'Liverpool',
    'chelsea': 'Chelsea',
    
    // Liga Portugal
    'fc-porto': 'Porto',
    'porto': 'Porto',
    'sporting-cp': 'Sporting CP',
    'sporting': 'Sporting CP',
    'sl-benfica': 'Benfica',
    'benfica': 'Benfica',
    'sc-braga': 'Braga',
    'braga': 'Braga',
    'vitoria-sc': 'Vitória SC'
  };
  
  const lowerName = urlTeamName?.toLowerCase();
  return mappings[lowerName] || urlTeamName;
};

// Encode team name for URL navigation
export const encodeTeamName = (teamName: string): string => {
  return teamName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// Reverse mapping: get URL-encoded name from display name
export const getUrlEncodedTeamName = (displayName: string): string => {
  const reverseMapping: { [key: string]: string } = {
    'PSG': 'paris-saint-germain',
    'AC Milan': 'ac-milan',
    'Inter Milan': 'inter-milan',
    'AS Roma': 'as-roma',
    'Atletico Madrid': 'atletico-madrid',
    'Real Madrid': 'real-madrid',
    'Bayern Munich': 'bayern-munich',
    'Borussia Dortmund': 'borussia-dortmund',
    'Bayer Leverkusen': 'bayer-leverkusen',
    'Manchester United': 'manchester-united',
    'Manchester City': 'manchester-city',
    'Newcastle United': 'newcastle-united',
    'Brighton & Hove Albion': 'brighton-hove-albion',
    'Crystal Palace': 'crystal-palace',
    'FC Porto': 'fc-porto',
    'Sporting CP': 'sporting-cp'
  };

  return reverseMapping[displayName] || encodeTeamName(displayName);
};