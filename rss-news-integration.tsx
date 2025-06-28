// RSS Feed Integration Service for Authentic Transfer News
interface RSSArticle {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string[];
  guid: string;
}

interface RSSFeedData {
  title: string;
  description: string;
  articles: RSSArticle[];
  lastFetched: string;
  feedUrl: string;
}

class RSSNewsIntegrationService {
  private feedUrl = "https://rss.feedspot.com/folder/5hrNtmIe4w==/rss/rsscombiner";
  private proxyUrl = "https://api.allorigins.win/raw?url=";
  private cache: Map<string, RSSFeedData> = new Map();
  private cacheTimeout = 15 * 60 * 1000; // 15 minutes

  async fetchTransferNews(): Promise<RSSFeedData> {
    const cacheKey = 'transfer-news-rss';
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - new Date(cached.lastFetched).getTime() < this.cacheTimeout) {
      return cached;
    }

    try {
      // Use proxy to avoid CORS issues
      const response = await fetch(`${this.proxyUrl}${encodeURIComponent(this.feedUrl)}`);
      const xmlText = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

      const feedData = this.parseRSSFeed(xmlDoc);

      // Cache the results
      this.cache.set(cacheKey, feedData);

      return feedData;
    } catch (error) {
      console.error('Error fetching RSS feed:', error);

      // Return cached data if available, otherwise return mock data
      if (cached) {
        return cached;
      }

      return this.getMockFeedData();
    }
  }

  private parseRSSFeed(xmlDoc: Document): RSSFeedData {
    const channel = xmlDoc.querySelector('channel');
    const items = xmlDoc.querySelectorAll('item');

    const articles: RSSArticle[] = Array.from(items).map(item => {
      const title = item.querySelector('title')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const guid = item.querySelector('guid')?.textContent || link;

      // Extract source from title or description
      const source = this.extractSource(title, description);

      // Categorize articles
      const category = this.categorizeArticle(title, description);

      return {
        title: this.cleanText(title),
        description: this.cleanText(description),
        link,
        pubDate,
        source,
        category,
        guid
      };
    });

    return {
      title: channel?.querySelector('title')?.textContent || 'Transfer News Feed',
      description: channel?.querySelector('description')?.textContent || 'Latest transfer news and rumors',
      articles: articles.slice(0, 50), // Limit to 50 most recent
      lastFetched: new Date().toISOString(),
      feedUrl: this.feedUrl
    };
  }

  private extractSource(title: string, description: string): string {
    // Common football news sources
    const sources = [
      'Sky Sports', 'BBC Sport', 'ESPN', 'Goal.com', 'The Athletic',
      'Guardian', 'Telegraph', 'Mail', 'Mirror', 'Sun',
      'Fabrizio Romano', 'David Ornstein', 'The Times', 'Independent',
      'Football.London', 'Manchester Evening News', 'Liverpool Echo'
    ];

    const text = `${title} ${description}`.toLowerCase();

    for (const source of sources) {
      if (text.includes(source.toLowerCase())) {
        return source;
      }
    }

    return 'Unknown Source';
  }

  private categorizeArticle(title: string, description: string): string[] {
    const text = `${title} ${description}`.toLowerCase();
    const categories: string[] = [];

    // Transfer-related keywords
    if (text.match(/transfer|sign|move|join|deal|agreement|fee|contract/)) {
      categories.push('transfers');
    }

    if (text.match(/rumor|rumour|speculation|interest|target|linked/)) {
      categories.push('rumors');
    }

    if (text.match(/confirmed|official|announce|complete|done/)) {
      categories.push('confirmed');
    }

    if (text.match(/premier league/)) {
      categories.push('premier-league');
    }

    if (text.match(/la liga|spain/)) {
      categories.push('la-liga');
    }

    if (text.match(/serie a|italy/)) {
      categories.push('serie-a');
    }

    if (text.match(/bundesliga|germany/)) {
      categories.push('bundesliga');
    }

    if (text.match(/ligue 1|france/)) {
      categories.push('ligue-1');
    }

    return categories.length > 0 ? categories : ['general'];
  }

  private cleanText(text: string): string {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&[a-zA-Z0-9#]+;/g, ' ') // Remove HTML entities
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  private getMockFeedData(): RSSFeedData {
    return {
      title: 'Transfer News Feed (Offline)',
      description: 'Mock transfer news data - RSS feed temporarily unavailable',
      articles: [
        {
          title: 'Liverpool monitoring Serie A midfielder ahead of summer window',
          description: 'The Reds are keeping tabs on the 24-year-old as they look to strengthen their midfield options.',
          link: '#',
          pubDate: new Date().toISOString(),
          source: 'Sky Sports',
          category: ['transfers', 'rumors', 'premier-league'],
          guid: 'mock-1'
        },
        {
          title: 'Arsenal complete signing of defender from La Liga',
          description: 'The Gunners have officially announced the arrival of their new center-back on a four-year deal.',
          link: '#',
          pubDate: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          source: 'BBC Sport',
          category: ['transfers', 'confirmed', 'premier-league'],
          guid: 'mock-2'
        },
        {
          title: 'Manchester United target responds to transfer speculation',
          description: 'The midfielder has addressed rumors linking him with a move to Old Trafford this summer.',
          link: '#',
          pubDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          source: 'The Athletic',
          category: ['transfers', 'rumors', 'premier-league'],
          guid: 'mock-3'
        }
      ],
      lastFetched: new Date().toISOString(),
      feedUrl: this.feedUrl
    };
  }

  // Get articles by category
  async getArticlesByCategory(category: string): Promise<RSSArticle[]> {
    const feedData = await this.fetchTransferNews();
    return feedData.articles.filter(article => article.category.includes(category));
  }

  // Get recent articles (last 24 hours)
  async getRecentArticles(): Promise<RSSArticle[]> {
    const feedData = await this.fetchTransferNews();
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

    return feedData.articles.filter(article => {
      const articleDate = new Date(article.pubDate).getTime();
      return articleDate > oneDayAgo;
    });
  }

  // Search articles
  async searchArticles(query: string): Promise<RSSArticle[]> {
    const feedData = await this.fetchTransferNews();
    const searchTerm = query.toLowerCase();

    return feedData.articles.filter(article => 
      article.title.toLowerCase().includes(searchTerm) ||
      article.description.toLowerCase().includes(searchTerm)
    );
  }

  // Get feed statistics
  async getFeedStats(): Promise<{
    totalArticles: number;
    recentArticles: number;
    categoryCounts: { [key: string]: number };
    sourceCounts: { [key: string]: number };
    lastUpdate: string;
  }> {
    const feedData = await this.fetchTransferNews();
    const recentArticles = await this.getRecentArticles();

    const categoryCounts: { [key: string]: number } = {};
    const sourceCounts: { [key: string]: number } = {};

    feedData.articles.forEach(article => {
      article.category.forEach(cat => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });

      sourceCounts[article.source] = (sourceCounts[article.source] || 0) + 1;
    });

    return {
      totalArticles: feedData.articles.length,
      recentArticles: recentArticles.length,
      categoryCounts,
      sourceCounts,
      lastUpdate: feedData.lastFetched
    };
  }
}

export const rssNewsService = new RSSNewsIntegrationService();
export default RSSNewsIntegrationService;

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface VerifiedTransfer {
  id: string;
  player: string;
  fromTeam: string;
  toTeam: string;
  value: string;
  status: 'rumor' | 'confirmed' | 'personal_terms' | 'medical';
  reliability: number;
  confidence: number;
  timestamp: string;
  source: string;
  likelihood: number;
  timeframe: string;
  marketImpact: 'high' | 'medium' | 'low';
}

interface NewsArticle {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
  reliability: number;
}

interface RSSNewsContextType {
  articles: NewsArticle[];
  verifiedTransfers: VerifiedTransfer[];
  isLoading: boolean;
  error: string | null;
  refreshNews: () => Promise<void>;
  lastUpdated: Date | null;
}

export const RSSNewsContext = createContext<RSSNewsContextType | undefined>(undefined);

export const useRSSNews = () => {
  const context = useContext(RSSNewsContext);
  if (context === undefined) {
    throw new Error('useRSSNews must be used within a RSSNewsProvider');
  }
  return context;
};

export const RSSNewsProvider = ({ children }: { children: ReactNode }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [verifiedTransfers, setVerifiedTransfers] = useState<VerifiedTransfer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshNews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock implementation - replace with actual RSS feed parsing
      const mockArticles: NewsArticle[] = [
        {
          title: "Mbappé's Real Madrid Move Confirmed",
          description: "French striker officially joins Real Madrid in record-breaking transfer",
          link: "https://example.com/mbappe-real-madrid",
          pubDate: new Date().toISOString(),
          source: "ESPN",
          category: "transfers",
          reliability: 95
        }
      ];

      const mockTransfers: VerifiedTransfer[] = [
        {
          id: "1",
          player: "Kylian Mbappé",
          fromTeam: "Paris Saint-Germain",
          toTeam: "Real Madrid",
          value: "€180M",
          status: "confirmed",
          reliability: 95,
          confidence: 92,
          timestamp: new Date().toISOString(),
          source: "Official Club Statement",
          likelihood: 95,
          timeframe: "Summer 2024",
          marketImpact: "high"
        }
      ];

      setArticles(mockArticles);
      setVerifiedTransfers(mockTransfers);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshNews();
  }, []);

  const contextValue: RSSNewsContextType = {
    articles,
    verifiedTransfers,
    isLoading,
    error,
    refreshNews,
    lastUpdated
  };

  return (
    <RSSNewsContext.Provider value={contextValue}>
      {children}
    </RSSNewsContext.Provider>
  );
};