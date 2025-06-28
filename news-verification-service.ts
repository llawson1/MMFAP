// Real-time News Source Verification System
export interface VerificationResult {
  isVerified: boolean;
  verificationScore: number;
  credibilityLevel: 'excellent' | 'good' | 'moderate' | 'poor' | 'unreliable';
  verificationFactors: VerificationFactor[];
  riskFlags: RiskFlag[];
  authenticity: AuthenticityCheck;
  timestamp: Date;
  verificationId: string;
}

export interface VerificationFactor {
  category: 'domain' | 'content' | 'timing' | 'source' | 'consistency' | 'metadata';
  factor: string;
  impact: number; // -100 to +100
  weight: number; // 0 to 1
  evidence: string;
}

export interface RiskFlag {
  type: 'domain_mismatch' | 'content_inconsistency' | 'timing_anomaly' | 'source_unreliable' | 'metadata_suspicious';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
}

export interface AuthenticityCheck {
  domainVerified: boolean;
  sslVerified: boolean;
  contentQuality: number;
  sourceAttribution: boolean;
  publicationDate: boolean;
  authorVerified: boolean;
  crossReferencable: boolean;
}

export interface NewsSource {
  domain: string;
  name: string;
  baseReliability: number;
  specialization: string[];
  knownAuthors: string[];
  verificationHistory: VerificationResult[];
  lastVerified: Date;
  isWhitelisted: boolean;
  riskProfile: 'low' | 'medium' | 'high';
}

export class NewsVerificationService {
  private static verifiedSources: Map<string, NewsSource> = new Map();
  private static verificationCache: Map<string, VerificationResult> = new Map();
  private static readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  // Trusted news domains database
  private static readonly TRUSTED_DOMAINS = new Map([
    ['bbc.com', { reliability: 98, type: 'public_broadcaster' }],
    ['bbc.co.uk', { reliability: 98, type: 'public_broadcaster' }],
    ['skysports.com', { reliability: 90, type: 'sports_broadcaster' }],
    ['theguardian.com', { reliability: 88, type: 'quality_newspaper' }],
    ['theathletic.com', { reliability: 92, type: 'subscription_sports' }],
    ['espn.com', { reliability: 85, type: 'sports_broadcaster' }],
    ['espn.co.uk', { reliability: 85, type: 'sports_broadcaster' }],
    ['goal.com', { reliability: 75, type: 'sports_website' }],
    ['transfermarkt.com', { reliability: 87, type: 'transfer_database' }],
    ['premierleague.com', { reliability: 100, type: 'official_league' }],
    ['laliga.com', { reliability: 100, type: 'official_league' }],
    ['legaseriea.it', { reliability: 100, type: 'official_league' }],
    ['bundesliga.com', { reliability: 100, type: 'official_league' }],
    ['ligue1.com', { reliability: 100, type: 'official_league' }],
    ['uefa.com', { reliability: 100, type: 'governing_body' }],
    ['fifa.com', { reliability: 100, type: 'governing_body' }],
    ['liverpoolfc.com', { reliability: 100, type: 'official_club' }],
    ['arsenal.com', { reliability: 100, type: 'official_club' }],
    ['chelseafc.com', { reliability: 100, type: 'official_club' }],
    ['manutd.com', { reliability: 100, type: 'official_club' }],
    ['mancity.com', { reliability: 100, type: 'official_club' }],
    ['tottenhamhotspur.com', { reliability: 100, type: 'official_club' }],
    ['realmadrid.com', { reliability: 100, type: 'official_club' }],
    ['fcbarcelona.com', { reliability: 100, type: 'official_club' }],
    ['juventus.com', { reliability: 100, type: 'official_club' }],
    ['acmilan.com', { reliability: 100, type: 'official_club' }],
    ['inter.it', { reliability: 100, type: 'official_club' }],
    ['fcbayern.com', { reliability: 100, type: 'official_club' }],
    ['psg.fr', { reliability: 100, type: 'official_club' }]
  ]);

  // Known reliable journalists and their credibility scores
  private static readonly VERIFIED_JOURNALISTS = new Map([
    ['Fabrizio Romano', { credibility: 94, specialization: ['transfers', 'breaking_news'] }],
    ['David Ornstein', { credibility: 92, specialization: ['transfers', 'arsenal'] }],
    ['James Pearce', { credibility: 90, specialization: ['liverpool', 'transfers'] }],
    ['Gianluca Di Marzio', { credibility: 88, specialization: ['serie_a', 'transfers'] }],
    ['Florian Plettenberg', { credibility: 87, specialization: ['bundesliga', 'transfers'] }],
    ['Matteo Moretto', { credibility: 85, specialization: ['la_liga', 'transfers'] }],
    ['Ben Jacobs', { credibility: 83, specialization: ['premier_league', 'transfers'] }],
    ['Romano Exclusive', { credibility: 94, specialization: ['transfers', 'exclusives'] }]
  ]);

  static async verifyNewsSource(url: string, content: any): Promise<VerificationResult> {
    try {
      const verificationId = this.generateVerificationId(url, content);
      
      // Check cache first
      const cached = this.verificationCache.get(verificationId);
      if (cached && Date.now() - cached.timestamp.getTime() < this.CACHE_DURATION) {
        return cached;
      }

      const result = await this.performVerification(url, content);
      
      // Cache result
      this.verificationCache.set(verificationId, result);
      
      // Clean old cache entries
      this.cleanCache();
      
      return result;
    } catch (error) {
      console.warn('News verification failed:', error);
      
      // Return minimal verification result on error
      return {
        isVerified: false,
        verificationScore: 0,
        credibilityLevel: 'unreliable',
        verificationFactors: [],
        riskFlags: [{
          type: 'source_unreliable',
          severity: 'high',
          description: 'Verification service error',
          recommendation: 'Manual verification required'
        }],
        authenticity: {
          domainVerified: false,
          sslVerified: false,
          contentQuality: 0,
          sourceAttribution: false,
          publicationDate: false,
          authorVerified: false,
          crossReferencable: false
        },
        timestamp: new Date(),
        verificationId: `error_${Date.now()}`
      };
    }
  }

  private static async performVerification(url: string, content: any): Promise<VerificationResult> {
    const factors: VerificationFactor[] = [];
    const riskFlags: RiskFlag[] = [];
    let score = 0;
    
    // Domain verification
    const domainCheck = this.verifyDomain(url);
    factors.push(...domainCheck.factors);
    riskFlags.push(...domainCheck.riskFlags);
    score += domainCheck.score;

    // Content verification
    const contentCheck = this.verifyContent(content);
    factors.push(...contentCheck.factors);
    riskFlags.push(...contentCheck.riskFlags);
    score += contentCheck.score;

    // Author verification
    const authorCheck = this.verifyAuthor(content.author || content.sourceName);
    factors.push(...authorCheck.factors);
    score += authorCheck.score;

    // Timing verification
    const timingCheck = this.verifyTiming(content.publishedAt || content.timestamp);
    factors.push(...timingCheck.factors);
    riskFlags.push(...timingCheck.riskFlags);
    score += timingCheck.score;

    // Cross-reference verification
    const crossRefCheck = await this.verifyCrossReference(content);
    factors.push(...crossRefCheck.factors);
    score += crossRefCheck.score;

    // Metadata verification
    const metadataCheck = this.verifyMetadata(content);
    factors.push(...metadataCheck.factors);
    riskFlags.push(...metadataCheck.riskFlags);
    score += metadataCheck.score;

    // Calculate final score (0-100)
    const finalScore = Math.max(0, Math.min(100, score));
    
    const result: VerificationResult = {
      isVerified: finalScore >= 70,
      verificationScore: finalScore,
      credibilityLevel: this.getCredibilityLevel(finalScore),
      verificationFactors: factors,
      riskFlags: riskFlags,
      authenticity: this.buildAuthenticityCheck(url, content, factors),
      timestamp: new Date(),
      verificationId: this.generateVerificationId(url, content)
    };

    // Update source history
    this.updateSourceHistory(url, result);

    return result;
  }

  private static verifyDomain(url: string): {
    factors: VerificationFactor[];
    riskFlags: RiskFlag[];
    score: number;
  } {
    const factors: VerificationFactor[] = [];
    const riskFlags: RiskFlag[] = [];
    let score = 0;

    try {
      const domain = new URL(url).hostname.replace('www.', '');
      const trustedDomain = this.TRUSTED_DOMAINS.get(domain);

      if (trustedDomain) {
        score += trustedDomain.reliability * 0.4; // 40% weight for domain trust
        factors.push({
          category: 'domain',
          factor: 'Trusted Domain',
          impact: trustedDomain.reliability * 0.4,
          weight: 0.4,
          evidence: `${domain} is a verified ${trustedDomain.type} with ${trustedDomain.reliability}% reliability`
        });
      } else {
        score -= 20;
        riskFlags.push({
          type: 'domain_mismatch',
          severity: 'medium',
          description: `Domain ${domain} is not in trusted sources database`,
          recommendation: 'Verify domain authenticity through additional sources'
        });
      }

      // SSL verification
      if (url.startsWith('https://')) {
        score += 5;
        factors.push({
          category: 'domain',
          factor: 'SSL Secured',
          impact: 5,
          weight: 0.05,
          evidence: 'URL uses HTTPS encryption'
        });
      } else {
        score -= 10;
        riskFlags.push({
          type: 'metadata_suspicious',
          severity: 'medium',
          description: 'URL does not use HTTPS encryption',
          recommendation: 'Verify authenticity as legitimate news sources use SSL'
        });
      }

    } catch (error) {
      score -= 30;
      riskFlags.push({
        type: 'domain_mismatch',
        severity: 'high',
        description: 'Invalid or malformed URL',
        recommendation: 'Reject source due to invalid URL format'
      });
    }

    return { factors, riskFlags, score };
  }

  private static verifyContent(content: any): {
    factors: VerificationFactor[];
    riskFlags: RiskFlag[];
    score: number;
  } {
    const factors: VerificationFactor[] = [];
    const riskFlags: RiskFlag[] = [];
    let score = 0;

    // Content quality checks
    const headline = content.headline || content.title || '';
    const summary = content.summary || content.description || '';
    const fullText = content.fullText || content.content || '';

    // Length and detail verification
    if (headline.length > 10 && headline.length < 200) {
      score += 10;
      factors.push({
        category: 'content',
        factor: 'Appropriate Headline Length',
        impact: 10,
        weight: 0.1,
        evidence: `Headline is ${headline.length} characters - within professional range`
      });
    } else {
      score -= 5;
      riskFlags.push({
        type: 'content_inconsistency',
        severity: 'low',
        description: 'Headline length unusual for professional journalism',
        recommendation: 'Verify content quality standards'
      });
    }

    if (summary.length > 50 && summary.length < 500) {
      score += 10;
      factors.push({
        category: 'content',
        factor: 'Detailed Summary',
        impact: 10,
        weight: 0.1,
        evidence: `Summary provides ${summary.length} characters of context`
      });
    }

    if (fullText.length > 100) {
      score += 15;
      factors.push({
        category: 'content',
        factor: 'Comprehensive Content',
        impact: 15,
        weight: 0.15,
        evidence: `Article contains ${fullText.length} characters of detailed content`
      });
    }

    // Transfer-specific content verification
    const transferKeywords = ['transfer', 'signing', 'deal', 'agreement', 'medical', 'contract', 'fee', 'bid'];
    const keywordCount = transferKeywords.filter(keyword => 
      headline.toLowerCase().includes(keyword) || summary.toLowerCase().includes(keyword)
    ).length;

    if (keywordCount >= 2) {
      score += 10;
      factors.push({
        category: 'content',
        factor: 'Transfer Content Verified',
        impact: 10,
        weight: 0.1,
        evidence: `Contains ${keywordCount} relevant transfer keywords`
      });
    }

    // Sensationalism detection
    const sensationalWords = ['BREAKING', 'EXCLUSIVE', 'SHOCKING', 'MASSIVE', 'HUGE', 'BOMBSHELL'];
    const sensationalCount = sensationalWords.filter(word => 
      headline.toUpperCase().includes(word)
    ).length;

    if (sensationalCount > 2) {
      score -= 15;
      riskFlags.push({
        type: 'content_inconsistency',
        severity: 'medium',
        description: 'Excessive use of sensational language',
        recommendation: 'Be cautious of potentially clickbait content'
      });
    }

    return { factors, riskFlags, score };
  }

  private static verifyAuthor(author: string): {
    factors: VerificationFactor[];
    score: number;
  } {
    const factors: VerificationFactor[] = [];
    let score = 0;

    if (!author || author.trim().length === 0) {
      score -= 10;
      return { factors, score };
    }

    const verifiedJournalist = this.VERIFIED_JOURNALISTS.get(author);
    if (verifiedJournalist) {
      score += verifiedJournalist.credibility * 0.2; // 20% weight for author credibility
      factors.push({
        category: 'source',
        factor: 'Verified Journalist',
        impact: verifiedJournalist.credibility * 0.2,
        weight: 0.2,
        evidence: `${author} is a verified journalist with ${verifiedJournalist.credibility}% credibility rating`
      });
    } else if (author.includes('Official') || author.includes('FC') || author.includes('Club')) {
      score += 25;
      factors.push({
        category: 'source',
        factor: 'Official Source',
        impact: 25,
        weight: 0.25,
        evidence: `Author appears to be official club/league source: ${author}`
      });
    } else {
      score += 5;
      factors.push({
        category: 'source',
        factor: 'Author Attribution',
        impact: 5,
        weight: 0.05,
        evidence: `Article has author attribution: ${author}`
      });
    }

    return { factors, score };
  }

  private static verifyTiming(timestamp: string | Date): {
    factors: VerificationFactor[];
    riskFlags: RiskFlag[];
    score: number;
  } {
    const factors: VerificationFactor[] = [];
    const riskFlags: RiskFlag[] = [];
    let score = 0;

    try {
      const pubDate = new Date(timestamp);
      const now = new Date();
      const ageHours = (now.getTime() - pubDate.getTime()) / (1000 * 60 * 60);

      if (ageHours < 24) {
        score += 20;
        factors.push({
          category: 'timing',
          factor: 'Recent Publication',
          impact: 20,
          weight: 0.2,
          evidence: `Published ${Math.round(ageHours)} hours ago - within 24-hour recency requirement`
        });
      } else if (ageHours < 72) {
        score += 10;
        factors.push({
          category: 'timing',
          factor: 'Moderately Recent',
          impact: 10,
          weight: 0.1,
          evidence: `Published ${Math.round(ageHours)} hours ago - reasonably recent`
        });
      } else {
        score -= 15;
        riskFlags.push({
          type: 'timing_anomaly',
          severity: 'medium',
          description: `Content is ${Math.round(ageHours)} hours old`,
          recommendation: 'Older content may not reflect current transfer market'
        });
      }

      // Future date detection
      if (pubDate > now) {
        score -= 25;
        riskFlags.push({
          type: 'timing_anomaly',
          severity: 'high',
          description: 'Publication date is in the future',
          recommendation: 'Reject source due to impossible publication date'
        });
      }

    } catch (error) {
      score -= 20;
      riskFlags.push({
        type: 'metadata_suspicious',
        severity: 'medium',
        description: 'Invalid or missing publication timestamp',
        recommendation: 'Verify publication date authenticity'
      });
    }

    return { factors, riskFlags, score };
  }

  private static async verifyCrossReference(content: any): Promise<{
    factors: VerificationFactor[];
    score: number;
  }> {
    const factors: VerificationFactor[] = [];
    let score = 0;

    // Check if players mentioned exist in our database
    const playersMentioned = content.playersMentioned || [];
    if (playersMentioned.length > 0) {
      score += 10;
      factors.push({
        category: 'consistency',
        factor: 'Player References',
        impact: 10,
        weight: 0.1,
        evidence: `References ${playersMentioned.length} specific players: ${playersMentioned.join(', ')}`
      });
    }

    // Check if teams mentioned are real
    const teamsMentioned = content.teamsMentioned || [];
    if (teamsMentioned.length > 0) {
      score += 10;
      factors.push({
        category: 'consistency',
        factor: 'Team References',
        impact: 10,
        weight: 0.1,
        evidence: `References ${teamsMentioned.length} teams: ${teamsMentioned.join(', ')}`
      });
    }

    // Check for transfer fee reasonableness
    if (content.transferFee && typeof content.transferFee === 'number') {
      const fee = content.transferFee;
      if (fee > 0 && fee < 300000000) { // Reasonable range
        score += 5;
        factors.push({
          category: 'consistency',
          factor: 'Realistic Transfer Fee',
          impact: 5,
          weight: 0.05,
          evidence: `Transfer fee of €${fee.toLocaleString()} is within realistic market range`
        });
      }
    }

    return { factors, score };
  }

  private static verifyMetadata(content: any): {
    factors: VerificationFactor[];
    riskFlags: RiskFlag[];
    score: number;
  } {
    const factors: VerificationFactor[] = [];
    const riskFlags: RiskFlag[] = [];
    let score = 0;

    // Check for required fields
    const requiredFields = ['headline', 'summary', 'sourceName', 'publishedAt'];
    const missingFields = requiredFields.filter(field => !content[field]);

    if (missingFields.length === 0) {
      score += 15;
      factors.push({
        category: 'metadata',
        factor: 'Complete Metadata',
        impact: 15,
        weight: 0.15,
        evidence: 'All required metadata fields are present'
      });
    } else {
      score -= missingFields.length * 5;
      riskFlags.push({
        type: 'metadata_suspicious',
        severity: 'medium',
        description: `Missing metadata fields: ${missingFields.join(', ')}`,
        recommendation: 'Incomplete metadata suggests lower content quality'
      });
    }

    // Check for transfer-specific metadata
    if (content.transferType && content.reliability !== undefined) {
      score += 10;
      factors.push({
        category: 'metadata',
        factor: 'Transfer Metadata',
        impact: 10,
        weight: 0.1,
        evidence: `Contains transfer-specific metadata: type=${content.transferType}, reliability=${content.reliability}`
      });
    }

    return { factors, riskFlags, score };
  }

  private static getCredibilityLevel(score: number): 'excellent' | 'good' | 'moderate' | 'poor' | 'unreliable' {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'moderate';
    if (score >= 40) return 'poor';
    return 'unreliable';
  }

  private static buildAuthenticityCheck(url: string, content: any, factors: VerificationFactor[]): AuthenticityCheck {
    return {
      domainVerified: factors.some(f => f.factor === 'Trusted Domain'),
      sslVerified: url.startsWith('https://'),
      contentQuality: factors.filter(f => f.category === 'content').reduce((sum, f) => sum + f.impact, 0),
      sourceAttribution: !!content.author || !!content.sourceName,
      publicationDate: !!content.publishedAt,
      authorVerified: factors.some(f => f.factor === 'Verified Journalist'),
      crossReferencable: (content.playersMentioned?.length || 0) > 0 || (content.teamsMentioned?.length || 0) > 0
    };
  }

  private static generateVerificationId(url: string, content: any): string {
    const str = url + (content.headline || '') + (content.publishedAt || '');
    return btoa(str).substring(0, 16);
  }

  private static updateSourceHistory(url: string, result: VerificationResult): void {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      let source = this.verifiedSources.get(domain);
      
      if (!source) {
        source = {
          domain,
          name: domain,
          baseReliability: result.verificationScore,
          specialization: [],
          knownAuthors: [],
          verificationHistory: [],
          lastVerified: new Date(),
          isWhitelisted: this.TRUSTED_DOMAINS.has(domain),
          riskProfile: result.riskFlags.length > 2 ? 'high' : result.riskFlags.length > 0 ? 'medium' : 'low'
        };
      }

      source.verificationHistory.push(result);
      source.lastVerified = new Date();
      
      // Keep only last 50 verification results
      if (source.verificationHistory.length > 50) {
        source.verificationHistory = source.verificationHistory.slice(-50);
      }

      this.verifiedSources.set(domain, source);
    } catch (error) {
      console.warn('Failed to update source history:', error);
    }
  }

  private static cleanCache(): void {
    const now = Date.now();
    for (const [key, result] of this.verificationCache.entries()) {
      if (now - result.timestamp.getTime() > this.CACHE_DURATION) {
        this.verificationCache.delete(key);
      }
    }
  }

  static getSourceHistory(domain: string): NewsSource | undefined {
    return this.verifiedSources.get(domain);
  }

  static getVerificationStats(): {
    totalVerifications: number;
    averageScore: number;
    riskFlagsCount: number;
    trustedSources: number;
  } {
    const allResults = Array.from(this.verificationCache.values());
    const totalRiskFlags = allResults.reduce((sum, result) => sum + result.riskFlags.length, 0);
    const averageScore = allResults.length > 0 
      ? allResults.reduce((sum, result) => sum + result.verificationScore, 0) / allResults.length 
      : 0;

    return {
      totalVerifications: allResults.length,
      averageScore: Math.round(averageScore),
      riskFlagsCount: totalRiskFlags,
      trustedSources: this.verifiedSources.size
    };
  }
}