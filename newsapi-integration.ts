// NEWSAPI Integration for Real-time Football News
export interface NewsAPIArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  publishedAt: Date;
  source: {
    id: string;
    name: string;
  };
  author: string;
  category: 'football' | 'transfers' | 'premier-league' | 'soccer';
  relevanceScore: number;
  transferMentions: string[];
  teamMentions: string[];
  playerMentions: string[];
}

export interface NewsAPIResponse {
  articles: NewsAPIArticle[];
  totalResults: number;
  status: string;
  lastUpdated: Date;
}

export class NewsAPIIntegrationService {
  private static readonly BASE_URL = 'https://newsapi.org/v2';
  private static cache: Map<string, { data: NewsAPIResponse; timestamp: Date }> = new Map();
  private static readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

  // Football-related sources with high reliability
  private static readonly FOOTBALL_SOURCES = [
    'bbc-sport',
    'espn',
    'the-guardian',
    'sky-sports',
    'goal-com',
    'football-italia',
    'marca',
    'as',
    'gazzetta-dello-sport',
    'four-four-two'
  ];

  // Transfer-related keywords for filtering
  private static readonly TRANSFER_KEYWORDS = [
    'transfer', 'signing', 'deal', 'contract', 'move', 'bid', 'offer',
    'agreement', 'medical', 'fee', 'talks', 'negotiations', 'target',
    'linked', 'interested', 'approach', 'pursue', 'acquire', 'sell'
  ];

  // Premier League teams for relevance scoring
  private static readonly PREMIER_LEAGUE_TEAMS = [
    'Arsenal', 'Chelsea', 'Liverpool', 'Manchester City', 'Manchester United',
    'Tottenham', 'Newcastle', 'Brighton', 'Aston Villa', 'West Ham',
    'Crystal Palace', 'Fulham', 'Wolves', 'Everton', 'Brentford',
    'Nottingham Forest', 'Luton Town', 'Burnley', 'Sheffield United',
    'Leicester City', 'Ipswich Town', 'Southampton'
  ];

  static isAvailable(): boolean {
    return !!(process.env.NEWSAPI_KEY || import.meta.env.VITE_NEWSAPI_KEY);
  }

  static getApiKey(): string | null {
    return process.env.NEWSAPI_KEY || import.meta.env.VITE_NEWSAPI_KEY || null;
  }

  static async fetchFootballNews(options: {
    query?: string;
    sources?: string[];
    category?: string;
    maxResults?: number;
    hoursBack?: number;
  } = {}): Promise<NewsAPIResponse> {
    const {
      query = 'football OR soccer OR transfer',
      sources = this.FOOTBALL_SOURCES,
      category = 'sports',
      maxResults = 50,
      hoursBack = 24
    } = options;

    const cacheKey = `football_news_${JSON.stringify(options)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp.getTime() < this.CACHE_DURATION) {
      return cached.data;
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('NEWSAPI key not available');
    }

    const fromDate = new Date();
    fromDate.setHours(fromDate.getHours() - hoursBack);

    const params = new URLSearchParams({
      q: query,
      sources: sources.join(','),
      from: fromDate.toISOString(),
      sortBy: 'publishedAt',
      pageSize: maxResults.toString(),
      apiKey
    });

    try {
      const response = await fetch(`${this.BASE_URL}/everything?${params}`);
      
      if (!response.ok) {
        throw new Error(`NewsAPI request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error(`NewsAPI error: ${data.message}`);
      }

      const processedResponse = this.processNewsResponse(data);
      
      // Cache the result
      this.cache.set(cacheKey, { data: processedResponse, timestamp: new Date() });
      
      return processedResponse;
    } catch (error) {
      console.error('NewsAPI fetch failed:', error);
      throw error;
    }
  }

  static async fetchTransferNews(hoursBack: number = 24): Promise<NewsAPIResponse> {
    return this.fetchFootballNews({
      query: 'football transfer OR soccer transfer OR player signing OR transfer deal',
      hoursBack,
      maxResults: 30
    });
  }

  static async fetchPremierLeagueNews(hoursBack: number = 24): Promise<NewsAPIResponse> {
    const plTeams = this.PREMIER_LEAGUE_TEAMS.slice(0, 10).join(' OR ');
    return this.fetchFootballNews({
      query: `"Premier League" OR ${plTeams}`,
      hoursBack,
      maxResults: 40
    });
  }

  static async fetchBreakingNews(): Promise<NewsAPIResponse> {
    return this.fetchFootballNews({
      query: 'BREAKING football OR BREAKING soccer OR BREAKING transfer',
      hoursBack: 6,
      maxResults: 20
    });
  }

  static async searchNews(searchQuery: string, hoursBack: number = 72): Promise<NewsAPIResponse> {
    return this.fetchFootballNews({
      query: `football ${searchQuery} OR soccer ${searchQuery}`,
      hoursBack,
      maxResults: 25
    });
  }

  private static processNewsResponse(data: any): NewsAPIResponse {
    const articles = data.articles
      .filter((article: any) => this.isFootballRelevant(article))
      .map((article: any, index: number) => this.processArticle(article, index))
      .sort((a: NewsAPIArticle, b: NewsAPIArticle) => b.relevanceScore - a.relevanceScore);

    return {
      articles,
      totalResults: data.totalResults,
      status: data.status,
      lastUpdated: new Date()
    };
  }

  private static processArticle(article: any, index: number): NewsAPIArticle {
    const title = article.title || '';
    const description = article.description || '';
    const content = article.content || '';
    
    const transferMentions = this.extractTransferMentions(title + ' ' + description);
    const teamMentions = this.extractTeamMentions(title + ' ' + description);
    const playerMentions = this.extractPlayerMentions(title + ' ' + description);
    
    return {
      id: `newsapi_${Date.now()}_${index}`,
      title,
      description,
      content,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: new Date(article.publishedAt),
      source: {
        id: article.source?.id || 'unknown',
        name: article.source?.name || 'Unknown Source'
      },
      author: article.author || 'Unknown Author',
      category: this.categorizeArticle(title + ' ' + description),
      relevanceScore: this.calculateRelevanceScore(article, transferMentions, teamMentions),
      transferMentions,
      teamMentions,
      playerMentions
    };
  }

  private static isFootballRelevant(article: any): boolean {
    const text = `${article.title} ${article.description}`.toLowerCase();
    
    const footballKeywords = [
      'football', 'soccer', 'premier league', 'la liga', 'serie a', 'bundesliga',
      'champions league', 'europa league', 'transfer', 'player', 'manager',
      'club', 'team', 'goal', 'match', 'fixture', 'stadium'
    ];
    
    return footballKeywords.some(keyword => text.includes(keyword));
  }

  private static categorizeArticle(text: string): 'football' | 'transfers' | 'premier-league' | 'soccer' {
    const lowerText = text.toLowerCase();
    
    if (this.TRANSFER_KEYWORDS.some(keyword => lowerText.includes(keyword))) {
      return 'transfers';
    }
    
    if (lowerText.includes('premier league')) {
      return 'premier-league';
    }
    
    if (lowerText.includes('soccer')) {
      return 'soccer';
    }
    
    return 'football';
  }

  private static extractTransferMentions(text: string): string[] {
    const mentions: string[] = [];
    const lowerText = text.toLowerCase();
    
    this.TRANSFER_KEYWORDS.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        mentions.push(keyword);
      }
    });
    
    return [...new Set(mentions)]; // Remove duplicates
  }

  private static extractTeamMentions(text: string): string[] {
    const mentions: string[] = [];
    
    this.PREMIER_LEAGUE_TEAMS.forEach(team => {
      if (text.toLowerCase().includes(team.toLowerCase())) {
        mentions.push(team);
      }
    });
    
    // Add other major European teams
    const majorTeams = [
      'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Juventus', 'AC Milan',
      'Inter Milan', 'Bayern Munich', 'Borussia Dortmund', 'PSG', 'Monaco'
    ];
    
    majorTeams.forEach(team => {
      if (text.toLowerCase().includes(team.toLowerCase())) {
        mentions.push(team);
      }
    });
    
    return [...new Set(mentions)];
  }

  private static extractPlayerMentions(text: string): string[] {
    // This would ideally use a comprehensive player database
    // For now, we'll extract potential player names from common patterns
    const playerPattern = /([A-Z][a-z]+ [A-Z][a-z]+)/g;
    const matches = text.match(playerPattern) || [];
    
    // Filter out common false positives
    const excludeWords = [
      'Premier League', 'Champions League', 'Europa League', 'La Liga',
      'Serie A', 'Real Madrid', 'Manchester United', 'Manchester City'
    ];
    
    return matches.filter(match => !excludeWords.includes(match)).slice(0, 5);
  }

  private static calculateRelevanceScore(
    article: any, 
    transferMentions: string[], 
    teamMentions: string[]
  ): number {
    let score = 0;
    
    // Base score from source reliability
    const reliableSources = ['bbc-sport', 'espn', 'the-guardian', 'sky-sports'];
    if (reliableSources.includes(article.source?.id)) {
      score += 30;
    }
    
    // Score from transfer mentions
    score += transferMentions.length * 10;
    
    // Score from team mentions
    score += teamMentions.length * 15;
    
    // Score from recency
    const hoursOld = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
    if (hoursOld < 6) score += 20;
    else if (hoursOld < 24) score += 10;
    else if (hoursOld < 72) score += 5;
    
    // Score from title keywords
    const title = article.title?.toLowerCase() || '';
    if (title.includes('breaking')) score += 25;
    if (title.includes('exclusive')) score += 15;
    if (title.includes('confirmed')) score += 20;
    if (title.includes('official')) score += 25;
    
    return Math.min(100, score); // Cap at 100
  }

  static clearCache(): void {
    this.cache.clear();
  }

  static getCacheStats(): { entries: number; keys: string[] } {
    return {
      entries: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  static async getSourceReliability(sourceId: string): Promise<number> {
    const reliabilityMap = new Map([
      ['bbc-sport', 95],
      ['espn', 88],
      ['the-guardian', 90],
      ['sky-sports', 85],
      ['goal-com', 75],
      ['football-italia', 80],
      ['marca', 82],
      ['as', 78],
      ['gazzetta-dello-sport', 85],
      ['four-four-two', 75]
    ]);
    
    return reliabilityMap.get(sourceId) || 60; // Default reliability
  }
}