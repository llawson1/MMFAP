
export interface TeamPageAuditResult {
  teamName: string;
  hasFinancialData: boolean;
  hasComprehensiveData: boolean;
  hasLiveData: boolean;
  pageAccessible: boolean;
  urlSlug: string;
  issues: string[];
  status: 'working' | 'partial' | 'broken';
}

export class TeamPageAuditService {
  // Teams from financial data
  private static getFinancialTeams(): string[] {
    // Import teams from teams-data.ts
    const financialTeams = [
      'Liverpool', 'Arsenal', 'Manchester City', 'Chelsea', 'Manchester United',
      'Newcastle United', 'Tottenham Hotspur', 'Brighton & Hove Albion', 'Aston Villa', 'West Ham United',
      'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Athletic Bilbao', 'Real Sociedad', 'Villarreal',
      'Inter Milan', 'AC Milan', 'Juventus', 'Napoli', 'AS Roma', 'Lazio', 'Atalanta',
      'Bayern Munich', 'Borussia Dortmund', 'RB Leipzig', 'Bayer Leverkusen', 'Eintracht Frankfurt',
      'Paris Saint-Germain', 'AS Monaco', 'Lille', 'Nice', 'Rennes', 'Marseille',
      'Benfica', 'Porto', 'Sporting CP', 'Braga', 'Vitória SC'
    ];
    return financialTeams;
  }

  // Teams from comprehensive database
  private static getComprehensiveTeams(): string[] {
    const comprehensiveTeams = [
      'Liverpool', 'Arsenal', 'Chelsea', 'Manchester City', 'Manchester United', 'Tottenham Hotspur',
      'Newcastle United', 'Brighton & Hove Albion', 'Aston Villa', 'West Ham United',
      'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Athletic Bilbao', 'Real Sociedad', 'Villarreal',
      'Juventus', 'AC Milan', 'Inter Milan', 'Napoli', 'AS Roma', 'Lazio',
      'Bayern Munich', 'Borussia Dortmund', 'RB Leipzig', 'Bayer Leverkusen', 'Eintracht Frankfurt',
      'Paris Saint-Germain', 'AS Monaco', 'Lille', 'Nice', 'Rennes',
      'Benfica', 'Porto', 'Sporting CP', 'Braga', 'Vitória SC'
    ];
    return comprehensiveTeams;
  }

  // Get all teams from API-SPORTS data
  private static async getApiSportsActualTeams(): Promise<string[]> {
    try {
      const response = await fetch('/api/authentic-teams/teams');
      const data = await response.json();
      return data.teams?.map((team: any) => team.name) || [];
    } catch (error) {
      console.error('Failed to fetch API-SPORTS teams:', error);
      return [];
    }
  }

  // Teams that should have API-SPORTS data
  private static getApiSportsTeams(): string[] {
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
      'Inter', 'AC Milan', 'Juventus', 'Napoli', 'Roma', 'Lazio', 'Atalanta',
      'Fiorentina', 'Bologna', 'Torino',
      
      // Bundesliga
      'Bayern Munich', 'Borussia Dortmund', 'RB Leipzig', 'Bayer Leverkusen',
      'Eintracht Frankfurt', 'VfL Wolfsburg', 'SC Freiburg', 'Union Berlin',
      
      // Liga Portugal
      'Benfica', 'Porto', 'Sporting CP', 'Braga', 'Vitória SC',
      
      // Eredivisie
      'Ajax', 'PSV', 'Feyenoord', 'AZ Alkmaar', 'FC Utrecht'
    ];
  }

  private static encodeTeamName(teamName: string): string {
    return teamName.toLowerCase().replace(/\s+/g, '-');
  }

  public static async auditAllTeamPages(): Promise<TeamPageAuditResult[]> {
    const results: TeamPageAuditResult[] = [];
    
    // Get all unique team names from different sources
    const financialTeams = this.getFinancialTeams();
    const comprehensiveTeams = this.getComprehensiveTeams();
    const apiSportsTeams = this.getApiSportsTeams();
    const actualApiTeams = await this.getApiSportsActualTeams();
    
    const allTeams = new Set([...financialTeams, ...comprehensiveTeams, ...apiSportsTeams, ...actualApiTeams]);
    
    for (const teamName of allTeams) {
      const result = await this.auditTeamPage(teamName, actualApiTeams);
      results.push(result);
    }
    
    return results.sort((a, b) => {
      // Sort by status priority: working > partial > broken
      const statusPriority = { working: 3, partial: 2, broken: 1 };
      if (statusPriority[a.status] !== statusPriority[b.status]) {
        return statusPriority[b.status] - statusPriority[a.status];
      }
      return a.teamName.localeCompare(b.teamName);
    });
  }

  private static async auditTeamPage(teamName: string, actualApiTeams: string[] = []): Promise<TeamPageAuditResult> {
    const financialTeams = this.getFinancialTeams();
    const comprehensiveTeams = this.getComprehensiveTeams();
    const apiSportsTeams = this.getApiSportsTeams();
    
    const hasFinancialData = financialTeams.includes(teamName);
    const hasComprehensiveData = comprehensiveTeams.includes(teamName);
    const hasLiveData = actualApiTeams.includes(teamName) || apiSportsTeams.some(team => 
      team.toLowerCase().includes(teamName.toLowerCase().split(' ')[0]) ||
      teamName.toLowerCase().includes(team.toLowerCase().split(' ')[0])
    );
    
    const urlSlug = this.encodeTeamName(teamName);
    const issues: string[] = [];
    
    // Check for data completeness
    if (!hasFinancialData) {
      issues.push('Missing financial data from teams-data.ts');
    }
    if (!hasComprehensiveData) {
      issues.push('Missing comprehensive data from team-database.ts');
    }
    if (!hasLiveData) {
      issues.push('No API-SPORTS integration available');
    }
    
    // Check for known naming issues
    const knownIssues = this.getKnownTeamIssues(teamName);
    issues.push(...knownIssues);
    
    // Determine status
    let status: 'working' | 'partial' | 'broken';
    const dataSourceCount = [hasFinancialData, hasComprehensiveData, hasLiveData].filter(Boolean).length;
    
    if (dataSourceCount === 3 && issues.length === 0) {
      status = 'working';
    } else if (dataSourceCount >= 1) {
      status = 'partial';
    } else {
      status = 'broken';
    }
    
    // Override status for teams with critical issues
    if (issues.some(issue => issue.includes('CardDescription') || issue.includes('import'))) {
      status = 'broken';
    }
    
    return {
      teamName,
      hasFinancialData,
      hasComprehensiveData,
      hasLiveData,
      pageAccessible: status !== 'broken',
      urlSlug,
      issues,
      status
    };
  }

  private static getKnownTeamIssues(teamName: string): string[] {
    const issues: string[] = [];
    
    // Teams with known naming inconsistencies
    const namingIssues = {
      'Newcastle United': 'Appears twice in financial data',
      'Brighton & Hove Albion': 'May have API name mismatch with "Brighton"',
      'Tottenham Hotspur': 'API may use "Tottenham" vs "Spurs"',
      'Manchester City': 'Under FFP investigation - may affect data',
      'Manchester United': 'High debt levels may affect calculations',
      'Inter Milan': 'API may use "Inter" vs "Internazionale"',
      'AC Milan': 'API may use "Milan" vs "AC Milan"',
      'Paris Saint-Germain': 'API may use "PSG" abbreviation',
      'Real Sociedad': 'API may use different Spanish naming',
      'Athletic Bilbao': 'API may use "Athletic Club"'
    };
    
    if (namingIssues[teamName]) {
      issues.push(`Naming issue: ${namingIssues[teamName]}`);
    }
    
    return issues;
  }

  public static getWorkingTeams(): string[] {
    // Teams that definitely should work based on current data structure
    return [
      'Liverpool', 'Arsenal', 'Manchester City', 'Chelsea', 'Manchester United',
      'Real Madrid', 'Barcelona', 'Atletico Madrid',
      'Bayern Munich', 'Borussia Dortmund',
      'Inter Milan', 'AC Milan', 'Juventus',
      'Paris Saint-Germain', 'Benfica', 'Porto', 'Sporting CP'
    ];
  }

  public static getBrokenTeams(): string[] {
    // Teams that likely won't work due to missing data or issues
    return [
      'Crystal Palace', 'Fulham', 'Wolves', 'Everton', 'Brentford',
      'Nottingham Forest', 'Luton Town', 'Burnley', 'Sheffield United',
      'Ajax', 'PSV', 'Feyenoord', 'AZ Alkmaar', 'FC Utrecht',
      'Real Betis', 'Valencia', 'Sevilla', 'Getafe',
      'Fiorentina', 'Bologna', 'Torino',
      'SC Freiburg', 'Union Berlin', 'VfL Wolfsburg'
    ];
  }

  public static getPartialTeams(): string[] {
    // Teams that have some data but may have issues
    return [
      'Newcastle United', 'Tottenham Hotspur', 'Brighton & Hove Albion',
      'Aston Villa', 'West Ham United', 'Athletic Bilbao', 'Real Sociedad',
      'Villarreal', 'Napoli', 'AS Roma', 'Lazio', 'Atalanta',
      'RB Leipzig', 'Bayer Leverkusen', 'Eintracht Frankfurt',
      'AS Monaco', 'Lille', 'Nice', 'Rennes', 'Marseille',
      'Braga', 'Vitória SC'
    ];
  }

  public static async getTeamsNeedingPages(): Promise<{
    needsCreation: string[];
    hasPages: string[];
    summary: {
      total: number;
      withPages: number;
      needingPages: number;
      coverage: number;
    };
  }> {
    const auditResults = await this.auditAllTeamPages();
    
    const needsCreation = auditResults
      .filter(result => result.status === 'broken' || !result.hasLiveData)
      .map(result => result.teamName);
    
    const hasPages = auditResults
      .filter(result => result.status === 'working' || result.status === 'partial')
      .map(result => result.teamName);
    
    const total = auditResults.length;
    const withPages = hasPages.length;
    const needingPages = needsCreation.length;
    const coverage = total > 0 ? (withPages / total) * 100 : 0;
    
    return {
      needsCreation,
      hasPages,
      summary: {
        total,
        withPages,
        needingPages,
        coverage
      }
    };
  }

  public static async generateTeamCreationPlan(): Promise<{
    highPriority: string[];
    mediumPriority: string[];
    lowPriority: string[];
    recommendations: string[];
  }> {
    const auditResults = await this.auditAllTeamPages();
    
    const highPriority: string[] = [];
    const mediumPriority: string[] = [];
    const lowPriority: string[] = [];
    
    auditResults.forEach(result => {
      if (result.status === 'broken') {
        if (result.hasFinancialData && result.hasComprehensiveData) {
          highPriority.push(result.teamName);
        } else if (result.hasFinancialData || result.hasComprehensiveData) {
          mediumPriority.push(result.teamName);
        } else {
          lowPriority.push(result.teamName);
        }
      }
    });
    
    const recommendations = [
      `Create team pages for ${highPriority.length} high-priority teams with existing data`,
      `Add missing data sources for ${mediumPriority.length} medium-priority teams`,
      `Gather comprehensive data for ${lowPriority.length} low-priority teams`,
      `Current page coverage: ${((auditResults.length - highPriority.length - mediumPriority.length - lowPriority.length) / auditResults.length * 100).toFixed(1)}%`
    ];
    
    return {
      highPriority,
      mediumPriority,
      lowPriority,
      recommendations
    };
  }
}
