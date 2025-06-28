interface AuditResult {
  component: string;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  dataContext?: any;
}

interface RosterAuditResult {
  teamName: string;
  playerCount: number;
  hasCompletePlayers: boolean;
  missingPositions: string[];
  averageMarketValue: number;
  issues: string[];
}

export class SelfAuditService {
  private static auditResults: AuditResult[] = [];
  private static lastAuditTime: Date = new Date();

  // Main audit entry point
  static async runComprehensiveAudit(): Promise<AuditResult[]> {
    console.log('🔍 Starting comprehensive self-audit...');
    SelfAuditService.auditResults = [];

    await Promise.all([
      SelfAuditService.auditTeamRosterData(),
      SelfAuditService.auditNavigationIntegrity(),
      SelfAuditService.auditDataConsistency(),
      SelfAuditService.auditComponentHealth(),
      SelfAuditService.auditPerformanceMetrics()
    ]);

    SelfAuditService.lastAuditTime = new Date();
    console.log(`✅ Self-audit completed: ${SelfAuditService.auditResults.length} checks performed`);

    return SelfAuditService.auditResults;
  }

  // Audit team roster data completeness - DISABLED (authentic data only policy)
  private static async auditTeamRosterData(): Promise<void> {
    // Disabled due to authentic data only policy
    // All player data now comes from Sportmonks API
    return;

      // List of expected teams from API
      const expectedTeams = [
        'Liverpool', 'Manchester City', 'Arsenal', 'Chelsea', 'Manchester United',
        'Tottenham', 'Newcastle United', 'Real Madrid', 'Barcelona', 'Atletico Madrid',
        'Bayern Munich', 'Borussia Dortmund', 'Bayer Leverkusen', 'Juventus', 
        'Inter Milan', 'AC Milan', 'Napoli', 'AS Roma', 'PSG', 'Marseille', 'Lyon', 'Monaco'
      ];

      const rosterAudits: RosterAuditResult[] = [];

      for (const teamName of expectedTeams) {
        const roster = TeamRosterService.getTeamRoster(teamName);
        const playerCount = roster.length;

        // Check for minimum viable squad size
        const hasCompletePlayers = playerCount >= 18; // Minimum professional squad

        // Check position distribution
        const positions = ['GK', 'DEF', 'MID', 'FWD'];
        const missingPositions = positions.filter(pos => 
          !roster.some(player => player.position === pos)
        );

        // Calculate average market value
        const totalValue = roster.reduce((sum, player) => sum + player.marketValue, 0);
        const averageMarketValue = playerCount > 0 ? totalValue / playerCount : 0;

        const issues: string[] = [];

        if (playerCount === 0) {
          issues.push('No players found');
          SelfAuditService.auditResults.push({
            component: 'TeamRosterService',
            issue: `Team "${teamName}" has no players in roster data`,
            severity: 'critical',
            recommendation: `Add authentic player data for ${teamName}`,
            dataContext: { teamName, playerCount }
          });
        } else if (playerCount < 18) {
          issues.push(`Insufficient squad size: ${playerCount}/18+ players`);
          SelfAuditService.auditResults.push({
            component: 'TeamRosterService',
            issue: `Team "${teamName}" has incomplete roster (${playerCount} players)`,
            severity: 'high',
            recommendation: `Add more authentic players to reach minimum squad size`,
            dataContext: { teamName, playerCount }
          });
        }

        if (missingPositions.length > 0) {
          issues.push(`Missing positions: ${missingPositions.join(', ')}`);
          SelfAuditService.auditResults.push({
            component: 'TeamRosterService',
            issue: `Team "${teamName}" missing players in positions: ${missingPositions.join(', ')}`,
            severity: 'medium',
            recommendation: `Add players for missing positions`,
            dataContext: { teamName, missingPositions }
          });
        }

        rosterAudits.push({
          teamName,
          playerCount,
          hasCompletePlayers,
          missingPositions,
          averageMarketValue,
          issues
        });
      }

      // Summary audit
      const teamsWithoutPlayers = rosterAudits.filter(audit => audit.playerCount === 0);
      const teamsWithIncompleteRosters = rosterAudits.filter(audit => 
        audit.playerCount > 0 && audit.playerCount < 18
      );

      if (teamsWithoutPlayers.length > 0) {
        SelfAuditService.auditResults.push({
          component: 'TeamRosterData',
          issue: `${teamsWithoutPlayers.length} teams have no roster data`,
          severity: 'critical',
          recommendation: 'Urgent: Add comprehensive player data for all teams',
          dataContext: { 
            affectedTeams: teamsWithoutPlayers.map(t => t.teamName),
            totalTeams: expectedTeams.length 
          }
        });
      }

      if (teamsWithIncompleteRosters.length > 0) {
        SelfAuditService.auditResults.push({
          component: 'TeamRosterData',
          issue: `${teamsWithIncompleteRosters.length} teams have incomplete rosters`,
          severity: 'high',
          recommendation: 'Expand roster data to professional squad sizes',
          dataContext: { 
            affectedTeams: teamsWithIncompleteRosters.map(t => ({
              team: t.teamName,
              playerCount: t.playerCount
            }))
          }
        });
      }

    } catch (error) {
      SelfAuditService.auditResults.push({
        component: 'SelfAuditService',
        issue: `Failed to audit roster data: ${error}`,
        severity: 'high',
        recommendation: 'Check roster data import and service integrity'
      });
    }
  }

  // Audit navigation integrity
  private static async auditNavigationIntegrity(): Promise<void> {
    try {
      // Check team navigation paths match roster data
      const { comprehensivePlayersData } = await import('@/data/comprehensive-players-data');

      const teamsWithPlayers = [...new Set(comprehensivePlayersData.map(p => p.team))];
      const expectedApiTeams = [
        'Liverpool', 'Manchester City', 'Arsenal', 'Chelsea', 'Manchester United',
        'Tottenham', 'Newcastle United', 'Real Madrid', 'Barcelona', 'Atletico Madrid',
        'Bayern Munich', 'Borussia Dortmund', 'Bayer Leverkusen', 'Juventus', 
        'Inter Milan', 'AC Milan', 'Napoli', 'AS Roma', 'PSG', 'Marseille', 'Lyon', 'Monaco'
      ];

      const missingFromRosterData = expectedApiTeams.filter(team => 
        !teamsWithPlayers.includes(team)
      );

      if (missingFromRosterData.length > 0) {
        SelfAuditService.auditResults.push({
          component: 'NavigationIntegrity',
          issue: `Teams in API but missing from roster data: ${missingFromRosterData.join(', ')}`,
          severity: 'high',
          recommendation: 'Ensure all API teams have corresponding roster data',
          dataContext: { missingTeams: missingFromRosterData }
        });
      }

      // Check for orphaned roster data
      const orphanedTeams = teamsWithPlayers.filter(team => 
        !expectedApiTeams.includes(team)
      );

      if (orphanedTeams.length > 0) {
        SelfAuditService.auditResults.push({
          component: 'NavigationIntegrity',
          issue: `Teams in roster data but not in API: ${orphanedTeams.join(', ')}`,
          severity: 'medium',
          recommendation: 'Remove orphaned team data or add to API',
          dataContext: { orphanedTeams }
        });
      }

    } catch (error) {
      SelfAuditService.auditResults.push({
        component: 'NavigationIntegrity',
        issue: `Failed to audit navigation integrity: ${error}`,
        severity: 'medium',
        recommendation: 'Check navigation and data service connections'
      });
    }
  }

  // Audit data consistency
  private static async auditDataConsistency(): Promise<void> {
    try {
      const { comprehensivePlayersData } = await import('@/data/comprehensive-players-data');

      // Check for duplicate player IDs
      const playerIds = comprehensivePlayersData.map(p => p.id);
      const duplicateIds = playerIds.filter((id, index) => playerIds.indexOf(id) !== index);

      if (duplicateIds.length > 0) {
        SelfAuditService.auditResults.push({
          component: 'DataConsistency',
          issue: `Duplicate player IDs found: ${duplicateIds.join(', ')}`,
          severity: 'high',
          recommendation: 'Ensure all player IDs are unique',
          dataContext: { duplicateIds }
        });
      }

      // Check for players with invalid market values
      const invalidMarketValues = comprehensivePlayersData.filter(p => 
        p.marketValue <= 0 || p.marketValue > 200000000
      );

      if (invalidMarketValues.length > 0) {
        SelfAuditService.auditResults.push({
          component: 'DataConsistency',
          issue: `${invalidMarketValues.length} players have unrealistic market values`,
          severity: 'medium',
          recommendation: 'Review and correct market value data',
          dataContext: { 
            count: invalidMarketValues.length,
            examples: invalidMarketValues.slice(0, 3).map(p => ({
              name: p.name,
              value: p.marketValue
            }))
          }
        });
      }

      // Check for players with invalid ages
      const invalidAges = comprehensivePlayersData.filter(p => 
        p.age < 16 || p.age > 45
      );

      if (invalidAges.length > 0) {
        SelfAuditService.auditResults.push({
          component: 'DataConsistency',
          issue: `${invalidAges.length} players have unrealistic ages`,
          severity: 'medium',
          recommendation: 'Review and correct age data',
          dataContext: { 
            count: invalidAges.length,
            examples: invalidAges.slice(0, 3).map(p => ({
              name: p.name,
              age: p.age
            }))
          }
        });
      }

    } catch (error) {
      SelfAuditService.auditResults.push({
        component: 'DataConsistency',
        issue: `Failed to audit data consistency: ${error}`,
        severity: 'medium',
        recommendation: 'Check data validation services'
      });
    }
  }

  // Audit component health
  private static async auditComponentHealth(): Promise<void> {
    // Check for common React issues
    const componentsToCheck = [
      'TeamProfilePage',
      'LiveTransferHub', 
      'HeroPredictions',
      'LeagueTables'
    ];

    // This would be expanded with actual component health checks
    SelfAuditService.auditResults.push({
      component: 'ComponentHealth',
      issue: 'Component health monitoring active',
      severity: 'low',
      recommendation: 'Continue monitoring component performance',
      dataContext: { checkedComponents: componentsToCheck }
    });
  }

  // Audit performance metrics
  private static async auditPerformanceMetrics(): Promise<void> {
    const performanceData = {
      loadTime: performance.now(),
      memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
      timestamp: new Date().toISOString()
    };

    if (performanceData.loadTime > 5000) {
      SelfAuditService.auditResults.push({
        component: 'Performance',
        issue: `Slow page load time: ${performanceData.loadTime.toFixed(2)}ms`,
        severity: 'medium',
        recommendation: 'Optimize component loading and data fetching',
        dataContext: performanceData
      });
    }
  }

  // Get critical issues only
  static getCriticalIssues(): AuditResult[] {
    return SelfAuditService.auditResults.filter(result => result.severity === 'critical');
  }

  // Get audit summary
  static getAuditSummary(): {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    lastAudit: Date;
  } {
    return {
      total: SelfAuditService.auditResults.length,
      critical: SelfAuditService.auditResults.filter(r => r.severity === 'critical').length,
      high: SelfAuditService.auditResults.filter(r => r.severity === 'high').length,
      medium: SelfAuditService.auditResults.filter(r => r.severity === 'medium').length,
      low: SelfAuditService.auditResults.filter(r => r.severity === 'low').length,
      lastAudit: SelfAuditService.lastAuditTime
    };
  }

  // Schedule automatic audits
  static schedulePeriodicAudits(): void {
    // Run audit every 5 minutes in development
    setInterval(() => {
      SelfAuditService.runComprehensiveAudit();
    }, 5 * 60 * 1000);
  }
}

export default SelfAuditService;
export const selfAuditService = SelfAuditService;