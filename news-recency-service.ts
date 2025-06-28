// News Recency and Currency Service
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  timestamp: Date;
  isStale: boolean;
  daysOld: number;
}

export class NewsRecencyService {
  private static readonly STALE_THRESHOLD_HOURS = 24; // News becomes stale after 24 hours
  private static readonly MAX_AGE_DAYS = 7; // Don't show news older than 7 days

  static checkRecency(timestamp: Date): { isStale: boolean; daysOld: number; hoursOld: number } {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const hoursOld = Math.floor(diffMs / (60 * 60 * 1000));
    const daysOld = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    return {
      isStale: hoursOld > this.STALE_THRESHOLD_HOURS,
      daysOld,
      hoursOld
    };
  }

  static isNewsCurrent(timestamp: Date): boolean {
    const { daysOld } = this.checkRecency(timestamp);
    return daysOld <= this.MAX_AGE_DAYS;
  }

  static generateCurrentTimestamp(): Date {
    // Generate timestamp within last 24 hours for current news
    const now = new Date();
    const randomHoursAgo = Math.floor(0.5 * 24);
    const randomMinutesAgo = Math.floor(0.5 * 60);
    
    return new Date(now.getTime() - (randomHoursAgo * 60 * 60 * 1000) - (randomMinutesAgo * 60 * 1000));
  }

  static generateRecentTimestamp(maxHoursOld: number = 6): Date {
    // Generate timestamp within specified hours for very recent news
    const now = new Date();
    const randomHoursAgo = 0.5 * maxHoursOld;
    
    return new Date(now.getTime() - (randomHoursAgo * 60 * 60 * 1000));
  }

  static filterCurrentNews<T extends { timestamp: Date }>(newsItems: T[]): T[] {
    return newsItems.filter(item => this.isNewsCurrent(item.timestamp));
  }

  static sortByRecency<T extends { timestamp: Date }>(newsItems: T[]): T[] {
    return newsItems.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  static addRecencyFlags<T extends { timestamp: Date }>(newsItems: T[]): (T & { isStale: boolean; daysOld: number })[] {
    return newsItems.map(item => {
      const { isStale, daysOld } = this.checkRecency(item.timestamp);
      return { ...item, isStale, daysOld };
    });
  }

  static formatTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMinutes = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  }

  static getCurrentTransferWindow(): { isOpen: boolean; windowType: 'summer' | 'winter' | 'closed'; daysRemaining?: number } {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based

    // Summer transfer window: June 1 - August 31
    const summerStart = new Date(year, 5, 1); // June 1
    const summerEnd = new Date(year, 7, 31); // August 31
    
    // Winter transfer window: January 1 - January 31
    const winterStart = new Date(year, 0, 1); // January 1
    const winterEnd = new Date(year, 0, 31); // January 31

    if (now >= summerStart && now <= summerEnd) {
      const daysRemaining = Math.ceil((summerEnd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
      return { isOpen: true, windowType: 'summer', daysRemaining };
    } else if (now >= winterStart && now <= winterEnd) {
      const daysRemaining = Math.ceil((winterEnd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
      return { isOpen: true, windowType: 'winter', daysRemaining };
    } else {
      return { isOpen: false, windowType: 'closed' };
    }
  }
}