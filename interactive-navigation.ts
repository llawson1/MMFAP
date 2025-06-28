// Interactive Navigation Service for Enhanced User Experience
export interface NavigationItem {
  title: string;
  path: string;
  category: 'analysis' | 'data' | 'compliance' | 'news' | 'tools';
  description: string;
  keywords: string[];
  relatedItems: string[];
}

export interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

export class InteractiveNavigationService {
  private static readonly NAVIGATION_MAP: NavigationItem[] = [
    {
      title: 'FFP Compliance Center',
      path: '/ffp-compliance',
      category: 'compliance',
      description: 'Financial Fair Play violations, rules, and regulatory analysis',
      keywords: ['ffp', 'financial', 'compliance', 'violations', 'uefa', 'rules'],
      relatedItems: ['/teams', '/transfers', '/news-sources']
    },
    {
      title: 'Transfer Hub',
      path: '/transfers',
      category: 'analysis',
      description: 'Live transfer market analysis and scenario modeling',
      keywords: ['transfers', 'deals', 'market', 'rumors', 'fees'],
      relatedItems: ['/players', '/teams', '/ffp-compliance']
    },
    {
      title: 'Player Database',
      path: '/players',
      category: 'data',
      description: 'Comprehensive player statistics and analytics',
      keywords: ['players', 'stats', 'performance', 'ratings', 'database'],
      relatedItems: ['/transfers', '/teams', '/ai-valuation']
    },
    {
      title: 'Team Analysis',
      path: '/teams',
      category: 'analysis',
      description: 'Team financial analysis and performance metrics',
      keywords: ['teams', 'finances', 'spending', 'revenue', 'analysis'],
      relatedItems: ['/players', '/ffp-compliance', '/leagues']
    },
    {
      title: 'League Tables',
      path: '/leagues',
      category: 'data',
      description: 'Current standings and league comparisons',
      keywords: ['leagues', 'tables', 'standings', 'positions', 'points'],
      relatedItems: ['/teams', '/players', '/fixtures']
    },
    {
      title: 'News Sources',
      path: '/news-sources',
      category: 'news',
      description: 'Verified transfer news with reliability scoring',
      keywords: ['news', 'sources', 'verification', 'reliability', 'journalism'],
      relatedItems: ['/live-updates', '/newsapi', '/transfers']
    },
    {
      title: 'Live Updates',
      path: '/live-updates',
      category: 'news',
      description: 'Real-time transfer updates and breaking news',
      keywords: ['live', 'updates', 'breaking', 'real-time', 'news'],
      relatedItems: ['/news-sources', '/transfers', '/newsapi']
    },
    {
      title: 'NewsAPI Integration',
      path: '/newsapi',
      category: 'news',
      description: 'Authentic news feeds from trusted sources',
      keywords: ['newsapi', 'authentic', 'feeds', 'trusted', 'sources'],
      relatedItems: ['/news-sources', '/live-updates']
    },
    {
      title: 'Fixtures Calendar',
      path: '/fixtures',
      category: 'data',
      description: 'Match schedules and fixture analysis',
      keywords: ['fixtures', 'matches', 'calendar', 'schedule', 'upcoming'],
      relatedItems: ['/leagues', '/teams']
    }
  ];

  static search(query: string): NavigationItem[] {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    
    return this.NAVIGATION_MAP.filter(item => 
      item.title.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.keywords.some(keyword => keyword.includes(searchTerm))
    ).slice(0, 5);
  }

  static getRelatedItems(currentPath: string): NavigationItem[] {
    const currentItem = this.NAVIGATION_MAP.find(item => item.path === currentPath);
    if (!currentItem) return [];

    return currentItem.relatedItems
      .map(path => this.NAVIGATION_MAP.find(item => item.path === path))
      .filter(Boolean) as NavigationItem[];
  }

  static generateBreadcrumbs(path: string): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Dashboard', href: '/' }
    ];

    const segments = path.split('/').filter(Boolean);
    let currentPath = '';

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const navItem = this.NAVIGATION_MAP.find(item => item.path === currentPath);
      
      breadcrumbs.push({
        name: navItem ? navItem.title : this.formatSegmentName(segment),
        href: currentPath,
        current: index === segments.length - 1
      });
    });

    return breadcrumbs;
  }

  private static formatSegmentName(segment: string): string {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  static getItemsByCategory(category: string): NavigationItem[] {
    return this.NAVIGATION_MAP.filter(item => item.category === category);
  }

  static getAllCategories(): string[] {
    return [...new Set(this.NAVIGATION_MAP.map(item => item.category))];
  }

  // Deep linking utilities for specific content
  static generateDeepLink(baseUrl: string, params: Record<string, string>): string {
    const url = new URL(baseUrl, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url.toString();
  }

  static createTeamDeepLink(teamName: string): string {
    return this.generateDeepLink('/teams', { team: teamName });
  }

  static createPlayerDeepLink(playerName: string): string {
    return this.generateDeepLink('/players', { search: playerName });
  }

  static createFFPDeepLink(team: string): string {
    return this.generateDeepLink('/ffp-compliance', { team });
  }

  static createTransferDeepLink(transferId: string): string {
    return this.generateDeepLink('/transfer-article', { id: transferId });
  }

  static createNewsDeepLink(category: string): string {
    return this.generateDeepLink('/news-sources', { category });
  }

  // Context-aware suggestions
  static getContextualSuggestions(currentPage: string, userInterests: string[] = []): NavigationItem[] {
    const related = this.getRelatedItems(currentPage);
    const interestBased = this.NAVIGATION_MAP.filter(item =>
      userInterests.some(interest => 
        item.keywords.includes(interest.toLowerCase()) || 
        item.category === interest.toLowerCase()
      )
    );

    // Combine and deduplicate
    const suggestions = [...related, ...interestBased];
    const unique = suggestions.filter((item, index, self) => 
      index === self.findIndex(i => i.path === item.path)
    );

    return unique.slice(0, 3);
  }

  // URL state management for complex filters
  static updateURLParams(params: Record<string, string | null>): void {
    const url = new URL(window.location.href);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value);
      }
    });

    window.history.replaceState({}, '', url.toString());
  }

  static getURLParams(): Record<string, string> {
    const params = new URLSearchParams(window.location.search);
    const result: Record<string, string> = {};
    
    for (const [key, value] of params) {
      result[key] = value;
    }
    
    return result;
  }
}