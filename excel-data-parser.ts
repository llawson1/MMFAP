
import XLSX from 'xlsx';

export interface ExcelTeamData {
  rank: number;
  fromYear: number;
  toYear: number;
  team: string;
  competition: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  pointsPerMatch: number;
  minutes: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  cleanSheets: number;
  cleanSheetPercentage: number;
  possession: number | null; // Can be incomplete
  penalties: number | null; // Can be incomplete
  isDataComplete: boolean;
  incompleteFields: string[];
}

export interface LeagueMapping {
  name: string;
  country: string;
  tier: number;
  isActive: boolean;
}

export class ComprehensiveExcelParser {
  private static readonly LEAGUE_MAPPINGS: Record<string, LeagueMapping> = {
    'Premier League': { name: 'Premier League', country: 'England', tier: 1, isActive: true },
    'La Liga': { name: 'La Liga', country: 'Spain', tier: 1, isActive: true },
    'Serie A': { name: 'Serie A', country: 'Italy', tier: 1, isActive: true },
    'Bundesliga': { name: 'Bundesliga', country: 'Germany', tier: 1, isActive: true },
    'Ligue 1': { name: 'Ligue 1', country: 'France', tier: 1, isActive: true },
    'Liga Portugal': { name: 'Liga Portugal', country: 'Portugal', tier: 1, isActive: true },
    'Championship': { name: 'Championship', country: 'England', tier: 2, isActive: false },
    'Liga NOS': { name: 'Liga Portugal', country: 'Portugal', tier: 1, isActive: true }
  };

  static async parseExcelFile(filePath: string): Promise<ExcelTeamData[]> {
    console.log('📊 Parsing Excel file for authentic team data...');
    
    try {
      const workbook = XLSX.readFile(filePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(worksheet);

      const parsedTeams: ExcelTeamData[] = [];

      for (const row of rawData) {
        const teamData = this.parseTeamRow(row as any);
        if (teamData && this.isValidTeamData(teamData)) {
          parsedTeams.push(teamData);
        }
      }

      console.log(`✅ Parsed ${parsedTeams.length} teams from Excel file`);
      this.logDataCompletenessStats(parsedTeams);
      
      return parsedTeams;
    } catch (error) {
      console.error('❌ Excel parsing failed:', error);
      throw new Error(`Excel parsing failed: ${error}`);
    }
  }

  private static parseTeamRow(row: any): ExcelTeamData | null {
    const incompleteFields: string[] = [];
    
    // Required fields validation
    const requiredFields = ['team', 'competition', 'wins', 'draws', 'losses'];
    for (const field of requiredFields) {
      if (!row[field] && row[field] !== 0) {
        console.warn(`⚠️ Missing required field ${field} for team: ${row.team || 'Unknown'}`);
        return null;
      }
    }

    // Parse basic data
    const matchesPlayed = (row.wins || 0) + (row.draws || 0) + (row.losses || 0);
    const points = ((row.wins || 0) * 3) + (row.draws || 0);
    const pointsPerMatch = matchesPlayed > 0 ? points / matchesPlayed : 0;

    // Check for incomplete optional fields
    const possession = this.parseOptionalNumber(row.possession);
    if (possession === null) incompleteFields.push('possession');

    const penalties = this.parseOptionalNumber(row.penalties);
    if (penalties === null) incompleteFields.push('penalties');

    const cleanSheetPercentage = this.parseOptionalNumber(row.cleanSheetPercentage);
    if (cleanSheetPercentage === null && row.cleanSheets) {
      // Calculate if we have clean sheets but not percentage
      const calculated = matchesPlayed > 0 ? (row.cleanSheets / matchesPlayed) * 100 : 0;
      row.cleanSheetPercentage = calculated;
    }

    return {
      rank: row.rank || 0,
      fromYear: row.fromYear || 1988,
      toYear: row.toYear || 2024,
      team: row.team,
      competition: row.competition,
      matchesPlayed,
      wins: row.wins || 0,
      draws: row.draws || 0,
      losses: row.losses || 0,
      points,
      pointsPerMatch,
      minutes: row.minutes || (matchesPlayed * 90),
      goalsFor: row.goalsFor || 0,
      goalsAgainst: row.goalsAgainst || 0,
      goalDifference: (row.goalsFor || 0) - (row.goalsAgainst || 0),
      cleanSheets: row.cleanSheets || 0,
      cleanSheetPercentage: row.cleanSheetPercentage || 0,
      possession,
      penalties,
      isDataComplete: incompleteFields.length === 0,
      incompleteFields
    };
  }

  private static parseOptionalNumber(value: any): number | null {
    if (value === undefined || value === null || value === '' || value === 'incomplete') {
      return null;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }

  private static isValidTeamData(team: ExcelTeamData): boolean {
    // Validate that the team belongs to one of our target leagues
    const league = this.LEAGUE_MAPPINGS[team.competition];
    if (!league) {
      console.warn(`⚠️ Unknown league: ${team.competition} for team: ${team.team}`);
      return false;
    }

    // Validate basic data integrity
    if (team.wins < 0 || team.draws < 0 || team.losses < 0) {
      console.warn(`⚠️ Invalid match data for team: ${team.team}`);
      return false;
    }

    return true;
  }

  private static logDataCompletenessStats(teams: ExcelTeamData[]): void {
    const completeTeams = teams.filter(t => t.isDataComplete).length;
    const incompleteTeams = teams.filter(t => !t.isDataComplete).length;
    
    console.log(`\n📈 DATA COMPLETENESS STATISTICS:`);
    console.log(`✅ Complete teams: ${completeTeams} (${((completeTeams/teams.length)*100).toFixed(1)}%)`);
    console.log(`⚠️ Incomplete teams: ${incompleteTeams} (${((incompleteTeams/teams.length)*100).toFixed(1)}%)`);

    // Log incomplete field frequency
    const incompleteFieldCounts: Record<string, number> = {};
    teams.forEach(team => {
      team.incompleteFields.forEach(field => {
        incompleteFieldCounts[field] = (incompleteFieldCounts[field] || 0) + 1;
      });
    });

    if (Object.keys(incompleteFieldCounts).length > 0) {
      console.log(`\n🔍 INCOMPLETE FIELDS BREAKDOWN:`);
      Object.entries(incompleteFieldCounts)
        .sort(([,a], [,b]) => b - a)
        .forEach(([field, count]) => {
          console.log(`   ${field}: ${count} teams (${((count/teams.length)*100).toFixed(1)}%)`);
        });
    }
  }

  static getLeagueMapping(): Record<string, LeagueMapping> {
    return this.LEAGUE_MAPPINGS;
  }

  static filterByTopSixLeagues(teams: ExcelTeamData[]): ExcelTeamData[] {
    const topSixLeagues = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'Liga Portugal', 'Liga NOS'];
    return teams.filter(team => topSixLeagues.includes(team.competition));
  }

  static processUploadedData(filePath: string): Promise<ExcelTeamData[]> {
    console.log('🔄 Processing newly uploaded team data...');
    return this.parseExcelFile(filePath);
  }

  static groupByLeague(teams: ExcelTeamData[]): Record<string, ExcelTeamData[]> {
    return teams.reduce((groups, team) => {
      const league = team.competition;
      if (!groups[league]) groups[league] = [];
      groups[league].push(team);
      return groups;
    }, {} as Record<string, ExcelTeamData[]>);
  }
}
