
export interface TeamNavigationResult {
  teamName: string;
  urlSlug: string;
  isAccessible: boolean;
  hasData: boolean;
  navigationSources: string[];
  issues: string[];
  recommendations: string[];
}

export class TeamNavigationService {
  // Teams that should be accessible from navigation
  private static getExpectedTeams(): string[] {
    return [
      // Premier League
      'Liverpool', 'Arsenal', 'Manchester City', 'Chelsea', 'Manchester United',
      'Tottenham', 'Newcastle United', 'Brighton', 'Aston Villa', 'West Ham',
      'Crystal Palace', 'Fulham', 'Wolves', 'Everton', 'Brentford',
      'Nottingham Forest', 'Luton Town', 'Burnley', 'Sheffield United', 'Bournemouth',
      
      // La Liga
      'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Athletic Bilbao', 'Real Sociedad',
      'Villarreal', 'Real Betis', 'Valencia', 'Sevilla', 'Getafe',
      
      // Serie A
      'Inter Milan', 'AC Milan', 'Juventus', 'Napoli', 'AS Roma', 'Lazio', 'Atalanta',
      'Fiorentina', 'Bologna', 'Torino',
      
      // Bundesliga
      'Bayern Munich', 'Borussia Dortmund', 'RB Leipzig', 'Bayer Leverkusen',
      'Eintracht Frankfurt', 'VfL Wolfsburg', 'SC Freiburg', 'Union Berlin',
      
      // Ligue 1
      'Paris Saint-Germain', 'AS Monaco', 'Olympique Marseille', 'Lyon', 'Lille', 'Nice', 'Rennes',
      
      // Liga Portugal
      'Benfica', 'Porto', 'Sporting CP', 'Braga', 'Vitória SC',
      
      // Eredivisie
      'Ajax', 'PSV', 'Feyenoord', 'AZ Alkmaar', 'FC Utrecht'
    ];
  }

  // Convert team name to URL slug
  private static encodeTeamName(teamName: string): string {
    return teamName.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Check which navigation sources should link to each team
  private static getNavigationSources(teamName: string): string[] {
    const sources: string[] = [];
    
    // All teams should be accessible from these sources
    sources.push('Teams Page → Team Card');
    sources.push('Teams Browse → League Filter');
    
    // Top teams should be in hero predictions
    const topTeams = [
      'Liverpool', 'Arsenal', 'Manchester City', 'Chelsea', 'Manchester United',
      'Real Madrid', 'Barcelona', 'Atletico Madrid',
      'Bayern Munich', 'Borussia Dortmund',
      'Inter Milan', 'AC Milan', 'Juventus',
      'Paris Saint-Germain'
    ];
    
    if (topTeams.includes(teamName)) {
      sources.push('Dashboard → Hero Predictions');
    }
    
    // All teams should be in league tables
    sources.push('Dashboard → League Tables');
    
    // Teams with confidence data should be in confidence browser
    sources.push('Dashboard → Team Confidence Browser');
    
    return sources;
  }

  // Audit navigation accessibility for all teams
  public static async auditTeamNavigation(): Promise<TeamNavigationResult[]> {
    const results: TeamNavigationResult[] = [];
    const expectedTeams = this.getExpectedTeams();
    
    for (const teamName of expectedTeams) {
      const result = await this.auditSingleTeam(teamName);
      results.push(result);
    }
    
    return results.sort((a, b) => {
      // Sort by accessibility first, then by name
      if (a.isAccessible !== b.isAccessible) {
        return a.isAccessible ? -1 : 1;
      }
      return a.teamName.localeCompare(b.teamName);
    });
  }

  // Audit a single team's navigation status
  private static async auditSingleTeam(teamName: string): Promise<TeamNavigationResult> {
    const urlSlug = this.encodeTeamName(teamName);
    const navigationSources = this.getNavigationSources(teamName);
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Check if team has data in authentic teams API
    let hasData = false;
    try {
      const response = await fetch(`/api/authentic-teams/teams/name/${encodeURIComponent(teamName)}`);
      hasData = response.ok;
      
      if (!hasData) {
        issues.push(`Team not found in authentic teams database`);
        recommendations.push(`Add ${teamName} to authentic teams database`);
      }
    } catch (error) {
      issues.push(`Failed to check team data: ${error}`);
    }
    
    // Check for potential navigation issues
    if (teamName.includes('&') || teamName.includes('.')) {
      issues.push(`Team name contains special characters that may break URL encoding`);
      recommendations.push(`Test URL encoding for special characters in team name`);
    }
    
    if (teamName.length > 25) {
      issues.push(`Long team name may cause UI layout issues`);
      recommendations.push(`Consider abbreviated display name for UI components`);
    }
    
    // Check if team name has multiple common variations
    const variations = this.getTeamNameVariations(teamName);
    if (variations.length > 1) {
      issues.push(`Team has multiple name variations: ${variations.join(', ')}`);
      recommendations.push(`Implement alias system for team name matching`);
    }
    
    const isAccessible = hasData && issues.length === 0;
    
    return {
      teamName,
      urlSlug,
      isAccessible,
      hasData,
      navigationSources,
      issues,
      recommendations
    };
  }

  // Get common name variations for a team
  private static getTeamNameVariations(teamName: string): string[] {
    const variations: Record<string, string[]> = {
      'Paris Saint-Germain': ['PSG', 'Paris SG', 'Paris Saint-Germain'],
      'Manchester City': ['Man City', 'Manchester City', 'City'],
      'Manchester United': ['Man United', 'Manchester United', 'United'],
      'Tottenham': ['Tottenham Hotspur', 'Spurs', 'Tottenham'],
      'Brighton': ['Brighton & Hove Albion', 'Brighton', 'Brighton & Hove'],
      'Newcastle United': ['Newcastle', 'Newcastle United', 'The Magpies'],
      'Inter Milan': ['Inter', 'Internazionale', 'Inter Milan'],
      'AC Milan': ['Milan', 'AC Milan', 'Rossoneri'],
      'Athletic Bilbao': ['Athletic Club', 'Athletic Bilbao', 'Athletic'],
      'Real Sociedad': ['Real Sociedad', 'La Real', 'Sociedad']
    };
    
    return variations[teamName] || [teamName];
  }

  // Get teams that need immediate attention
  public static async getTeamsNeedingNavigation(): Promise<{
    brokenNavigation: string[];
    missingData: string[];
    navigationIssues: string[];
    summary: {
      total: number;
      accessible: number;
      needingAttention: number;
      coverage: number;
    };
  }> {
    const auditResults = await this.auditTeamNavigation();
    
    const brokenNavigation = auditResults
      .filter(result => !result.isAccessible && result.hasData)
      .map(result => result.teamName);
    
    const missingData = auditResults
      .filter(result => !result.hasData)
      .map(result => result.teamName);
    
    const navigationIssues = auditResults
      .filter(result => result.issues.length > 0)
      .map(result => result.teamName);
    
    const total = auditResults.length;
    const accessible = auditResults.filter(r => r.isAccessible).length;
    const needingAttention = total - accessible;
    const coverage = total > 0 ? (accessible / total) * 100 : 0;
    
    return {
      brokenNavigation,
      missingData,
      navigationIssues,
      summary: {
        total,
        accessible,
        needingAttention,
        coverage
      }
    };
  }

  // Generate implementation plan for fixing navigation
  public static async generateNavigationPlan(): Promise<{
    immediateActions: string[];
    dataAdditions: string[];
    componentUpdates: string[];
    recommendations: string[];
  }> {
    const auditResults = await this.auditTeamNavigation();
    const immediateActions: string[] = [];
    const dataAdditions: string[] = [];
    const componentUpdates: string[] = [];
    const recommendations: string[] = [];
    
    auditResults.forEach(result => {
      if (!result.hasData) {
        dataAdditions.push(`Add ${result.teamName} to authentic teams database`);
      }
      
      if (result.issues.some(issue => issue.includes('URL encoding'))) {
        immediateActions.push(`Test and fix URL encoding for ${result.teamName}`);
      }
      
      if (result.issues.some(issue => issue.includes('name variations'))) {
        componentUpdates.push(`Implement alias matching for ${result.teamName}`);
      }
    });
    
    recommendations.push(
      `Current navigation coverage: ${((auditResults.filter(r => r.isAccessible).length / auditResults.length) * 100).toFixed(1)}%`,
      `${auditResults.filter(r => !r.hasData).length} teams need data entries`,
      `${auditResults.filter(r => r.issues.length > 0).length} teams have navigation issues`,
      'Implement comprehensive navigation testing for all team pages'
    );
    
    return {
      immediateActions,
      dataAdditions,
      componentUpdates,
      recommendations
    };
  }

  // Test navigation for a specific team
  public static async testTeamNavigation(teamName: string): Promise<{
    success: boolean;
    urlSlug: string;
    dataAvailable: boolean;
    errors: string[];
  }> {
    const urlSlug = this.encodeTeamName(teamName);
    const errors: string[] = [];
    
    // Test data availability
    let dataAvailable = false;
    try {
      const response = await fetch(`/api/authentic-teams/teams/name/${encodeURIComponent(teamName)}`);
      dataAvailable = response.ok;
      
      if (!dataAvailable) {
        errors.push('Team data not found in API');
      }
    } catch (error) {
      errors.push(`API request failed: ${error}`);
    }
    
    // Test URL slug generation
    if (!urlSlug || urlSlug.length === 0) {
      errors.push('Failed to generate valid URL slug');
    }
    
    if (urlSlug !== urlSlug.toLowerCase()) {
      errors.push('URL slug contains uppercase characters');
    }
    
    const success = errors.length === 0 && dataAvailable;
    
    return {
      success,
      urlSlug,
      dataAvailable,
      errors
    };
  }
}
