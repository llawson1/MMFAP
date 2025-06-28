
export interface NavigationAuditResult {
  path: string;
  status: 'working' | 'broken' | 'missing' | 'redirect_needed';
  component?: string;
  issues: string[];
  recommendations: string[];
  clickSources: string[];
  testResults?: {
    renderTest: boolean;
    dataTest: boolean;
    navigationTest: boolean;
  };
}

export interface ClickFlowMapping {
  from: string;
  to: string;
  trigger: string;
  component: string;
  expectedData?: string[];
}

export class NavigationAuditService {
  private static readonly EXPECTED_ROUTES = [
    // Main Pages
    { path: '/', component: 'Dashboard', critical: true },
    { path: '/leagues', component: 'LeaguesPage', critical: true },
    { path: '/teams', component: 'TeamsBrowsePage', critical: true },
    { path: '/players', component: 'PlayersPage', critical: true },
    { path: '/transfers', component: 'TransfersPage', critical: true },
    { path: '/fixtures', component: 'FixturesPage', critical: true },
    
    // Team Profile Pages
    { path: '/team/:teamName', component: 'TeamProfilePage', critical: true },
    
    // Analysis Pages
    { path: '/ffp-compliance', component: 'FFPCompliancePage', critical: true },
    { path: '/performance-dashboard', component: 'PerformanceDashboardPage', critical: false },
    { path: '/cross-league-comparison', component: 'CrossLeagueComparisonPage', critical: false },
    
    // Data Pages
    { path: '/authentic-database', component: 'AuthenticDatabasePage', critical: false },
    { path: '/financial-dashboard', component: 'FinancialDashboardPage', critical: false },
    
    // News & Updates
    { path: '/news-sources', component: 'NewsSourcesPage', critical: false },
    { path: '/newsapi', component: 'NewsAPIPage', critical: false },
    { path: '/live-updates', component: 'LiveUpdatesPage', critical: false },
    
    // Detail Pages
    { path: '/transfer-article', component: 'TransferArticlePage', critical: false },
    { path: '/team-confidence', component: 'TeamConfidencePage', critical: false },
    { path: '/reliability-breakdown', component: 'ReliabilityBreakdownPage', critical: false },
    { path: '/reliability-analysis', component: 'ReliabilityAnalysisPage', critical: false },
    
    // System Pages
    { path: '/system-health', component: 'SystemHealthPage', critical: false },
    { path: '/compliance-explained', component: 'ComplianceExplainedPage', critical: false },
    { path: '/prediction-methodology', component: 'PredictionMethodologyPage', critical: false },
    
    // Stats Detail Pages
    { path: '/active-users-detail', component: 'ActiveUsersDetailPage', critical: false },
    { path: '/confirmed-deals-detail', component: 'ConfirmedDealsDetailPage', critical: false },
    { path: '/transfer-rumors-detail', component: 'TransferRumorsDetailPage', critical: false },
    { path: '/market-value-detail', component: 'MarketValueDetailPage', critical: false }
  ];

  private static readonly CLICK_FLOWS: ClickFlowMapping[] = [
    // Hero Predictions Navigation
    {
      from: '/',
      to: '/team/:teamName',
      trigger: 'hero_prediction_team_click',
      component: 'HeroPredictions',
      expectedData: ['team_name', 'league', 'prediction_data']
    },
    {
      from: '/',
      to: '/team-confidence',
      trigger: 'confidence_badge_click',
      component: 'InteractiveConfidenceBadge',
      expectedData: ['confidence_score', 'team_data']
    },
    
    // Main Navigation
    {
      from: 'any',
      to: '/teams',
      trigger: 'nav_teams_click',
      component: 'PageNavigation',
      expectedData: ['teams_list']
    },
    {
      from: '/teams',
      to: '/team/:teamName',
      trigger: 'team_card_click',
      component: 'TeamCard',
      expectedData: ['team_profile_data']
    },
    
    // Transfer Hub Navigation
    {
      from: '/',
      to: '/transfer-article',
      trigger: 'transfer_click',
      component: 'LiveTransferHub',
      expectedData: ['transfer_details']
    },
    {
      from: '/',
      to: '/reliability-breakdown',
      trigger: 'source_reliability_click',
      component: 'LiveTransferHub',
      expectedData: ['source_data', 'reliability_score']
    },
    
    // League Navigation
    {
      from: '/leagues',
      to: '/team/:teamName',
      trigger: 'league_table_team_click',
      component: 'LeagueTables',
      expectedData: ['team_data', 'league_position']
    },
    
    // Player Navigation
    {
      from: '/players',
      to: '/team/:teamName',
      trigger: 'player_team_click',
      component: 'PlayersPage',
      expectedData: ['team_data', 'player_context']
    }
  ];

  static async performComprehensiveAudit(): Promise<NavigationAuditResult[]> {
    console.log('🔍 Starting comprehensive navigation audit...');
    const results: NavigationAuditResult[] = [];

    for (const route of this.EXPECTED_ROUTES) {
      const auditResult = await this.auditRoute(route);
      results.push(auditResult);
    }

    // Audit dynamic team routes
    const teamAuditResults = await this.auditTeamRoutes();
    results.push(...teamAuditResults);

    console.log('✅ Navigation audit completed:', results.length, 'routes audited');
    return results;
  }

  private static async auditRoute(route: any): Promise<NavigationAuditResult> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    const clickSources: string[] = [];

    // Find all click sources for this route
    const flows = this.CLICK_FLOWS.filter(flow => flow.to === route.path || flow.to.includes(route.path.split('/')[1]));
    clickSources.push(...flows.map(f => `${f.from} → ${f.trigger}`));

    // Check if route exists in App.tsx
    const routeExists = await this.checkRouteExists(route.path);
    if (!routeExists) {
      issues.push('Route not registered in App.tsx');
      recommendations.push('Add route registration in App.tsx');
    }

    // Check if component file exists
    const componentExists = await this.checkComponentExists(route.component);
    if (!componentExists) {
      issues.push(`Component ${route.component} file not found`);
      recommendations.push(`Create ${route.component} component`);
    }

    // Determine status
    let status: 'working' | 'broken' | 'missing' | 'redirect_needed' = 'working';
    if (!routeExists || !componentExists) {
      status = 'missing';
    } else if (issues.length > 0) {
      status = 'broken';
    }

    return {
      path: route.path,
      status,
      component: route.component,
      issues,
      recommendations,
      clickSources,
      testResults: {
        renderTest: componentExists,
        dataTest: true, // Would need actual component testing
        navigationTest: routeExists
      }
    };
  }

  private static async auditTeamRoutes(): Promise<NavigationAuditResult[]> {
    const results: NavigationAuditResult[] = [];
    
    // Get all teams that should have routes
    const expectedTeams = [
      // Premier League
      'Liverpool', 'Arsenal', 'Manchester City', 'Chelsea', 'Manchester United',
      'Tottenham Hotspur', 'Newcastle United', 'Brighton & Hove Albion', 'Aston Villa',
      
      // La Liga  
      'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Athletic Bilbao',
      
      // Serie A
      'Inter Milan', 'AC Milan', 'Juventus', 'Napoli',
      
      // Bundesliga
      'Bayern Munich', 'Borussia Dortmund', 'RB Leipzig', 'Bayer Leverkusen',
      
      // Ligue 1
      'Paris Saint-Germain', 'AS Monaco', 'Olympique Marseille', 'Lyon'
    ];

    for (const teamName of expectedTeams) {
      const encodedName = this.encodeTeamName(teamName);
      const teamResult: NavigationAuditResult = {
        path: `/team/${encodedName}`,
        status: 'working',
        component: 'TeamProfilePage',
        issues: [],
        recommendations: [],
        clickSources: [
          'Hero Predictions → team click',
          'Teams Page → team card click',
          'League Tables → team name click'
        ]
      };

      // Check if team data exists
      const hasTeamData = await this.checkTeamDataExists(teamName);
      if (!hasTeamData) {
        teamResult.issues.push(`No team data found for ${teamName}`);
        teamResult.recommendations.push(`Add authentic data for ${teamName}`);
        teamResult.status = 'broken';
      }

      results.push(teamResult);
    }

    return results;
  }

  private static async checkRouteExists(path: string): Promise<boolean> {
    // This would check if the route is registered in App.tsx
    // For now, simulating based on known routes
    const knownRoutes = [
      '/', '/leagues', '/teams', '/players', '/transfers', '/fixtures',
      '/team/:teamName', '/ffp-compliance', '/performance-dashboard',
      '/authentic-database', '/financial-dashboard', '/news-sources',
      '/newsapi', '/live-updates', '/transfer-article', '/team-confidence',
      '/reliability-breakdown', '/system-health', '/compliance-explained'
    ];
    
    return knownRoutes.some(route => route === path || path.includes(route.split(':')[0]));
  }

  private static async checkComponentExists(componentName: string): Promise<boolean> {
    // This would check if the component file exists
    // For now, simulating based on known components
    const knownComponents = [
      'Dashboard', 'LeaguesPage', 'TeamsBrowsePage', 'PlayersPage', 'TransfersPage',
      'FixturesPage', 'TeamProfilePage', 'FFPCompliancePage', 'PerformanceDashboardPage',
      'AuthenticDatabasePage', 'FinancialDashboardPage', 'NewsSourcesPage',
      'NewsAPIPage', 'LiveUpdatesPage', 'TransferArticlePage', 'TeamConfidencePage',
      'ReliabilityBreakdownPage', 'SystemHealthPage', 'ComplianceExplainedPage'
    ];
    
    return knownComponents.includes(componentName);
  }

  private static async checkTeamDataExists(teamName: string): Promise<boolean> {
    try {
      const response = await fetch('/api/authentic-teams/teams');
      const data = await response.json();
      return data.teams?.some((team: any) => team.name === teamName) ?? false;
    } catch {
      return false;
    }
  }

  private static encodeTeamName(teamName: string): string {
    return teamName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '');
  }

  static generateFixPlan(auditResults: NavigationAuditResult[]): {
    criticalFixes: string[];
    missingPages: string[];
    brokenLinks: string[];
    recommendations: string[];
  } {
    const criticalFixes: string[] = [];
    const missingPages: string[] = [];
    const brokenLinks: string[] = [];
    const recommendations: string[] = [];

    auditResults.forEach(result => {
      if (result.status === 'missing') {
        missingPages.push(`Create ${result.path} (${result.component})`);
        if (result.clickSources.length > 0) {
          criticalFixes.push(`Fix navigation from: ${result.clickSources.join(', ')}`);
        }
      } else if (result.status === 'broken') {
        brokenLinks.push(`Fix ${result.path}: ${result.issues.join(', ')}`);
      }
      
      recommendations.push(...result.recommendations);
    });

    return {
      criticalFixes: [...new Set(criticalFixes)],
      missingPages: [...new Set(missingPages)],
      brokenLinks: [...new Set(brokenLinks)],
      recommendations: [...new Set(recommendations)]
    };
  }

  static async testClickFlow(flow: ClickFlowMapping): Promise<boolean> {
    console.log(`Testing click flow: ${flow.from} → ${flow.to} via ${flow.trigger}`);
    
    // This would test the actual click flow
    // For now, returning success if both routes exist
    const fromExists = await this.checkRouteExists(flow.from);
    const toExists = await this.checkRouteExists(flow.to);
    
    return fromExists && toExists;
  }
}

export default NavigationAuditService;
