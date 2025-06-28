
import { comprehensivePlayersData } from "@/data/comprehensive-players-data";

export interface RosterPlayer {
  id: number;
  name: string;
  age: number;
  position: string;
  team: string;
  league: string;
  marketValue: number;
  nationality?: string;
  height?: string;
  preferredFoot?: string;
  contractUntil?: string;
}

export interface TeamRosterStats {
  totalPlayers: number;
  averageAge: number;
  totalMarketValue: number;
  averageMarketValue: number;
  positionCounts: Record<string, number>;
  nationalities: Record<string, number>;
  youngestPlayer: RosterPlayer | null;
  oldestPlayer: RosterPlayer | null;
  mostValuablePlayer: RosterPlayer | null;
}

export class TeamRosterService {
  static getTeamRoster(teamName: string): RosterPlayer[] {
    return comprehensivePlayersData
      .filter(player => player.team === teamName)
      .sort((a, b) => {
        // Sort by position order then by name
        const positionOrder = { 'GK': 1, 'DEF': 2, 'MID': 3, 'FWD': 4 };
        const aOrder = positionOrder[a.position as keyof typeof positionOrder] || 5;
        const bOrder = positionOrder[b.position as keyof typeof positionOrder] || 5;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return a.name.localeCompare(b.name);
      });
  }

  static getRosterByPosition(teamName: string) {
    const roster = this.getTeamRoster(teamName);
    return {
      'GK': roster.filter(p => p.position === 'GK'),
      'DEF': roster.filter(p => p.position === 'DEF'),
      'MID': roster.filter(p => p.position === 'MID'),
      'FWD': roster.filter(p => p.position === 'FWD')
    };
  }

  static getTeamRosterStats(teamName: string): TeamRosterStats {
    const roster = this.getTeamRoster(teamName);
    
    if (roster.length === 0) {
      return {
        totalPlayers: 0,
        averageAge: 0,
        totalMarketValue: 0,
        averageMarketValue: 0,
        positionCounts: {},
        nationalities: {},
        youngestPlayer: null,
        oldestPlayer: null,
        mostValuablePlayer: null
      };
    }

    const positionCounts = roster.reduce((acc, player) => {
      acc[player.position] = (acc[player.position] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const nationalities = roster.reduce((acc, player) => {
      if (player.nationality) {
        acc[player.nationality] = (acc[player.nationality] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const totalMarketValue = roster.reduce((sum, player) => sum + player.marketValue, 0);
    const averageAge = roster.reduce((sum, player) => sum + player.age, 0) / roster.length;

    const youngestPlayer = roster.reduce((youngest, player) => 
      player.age < youngest.age ? player : youngest
    );

    const oldestPlayer = roster.reduce((oldest, player) => 
      player.age > oldest.age ? player : oldest
    );

    const mostValuablePlayer = roster.reduce((mostValuable, player) => 
      player.marketValue > mostValuable.marketValue ? player : mostValuable
    );

    return {
      totalPlayers: roster.length,
      averageAge: Math.round(averageAge * 10) / 10,
      totalMarketValue,
      averageMarketValue: Math.round(totalMarketValue / roster.length),
      positionCounts,
      nationalities,
      youngestPlayer,
      oldestPlayer,
      mostValuablePlayer
    };
  }

  static getPositionColor(position: string): string {
    switch (position) {
      case 'GK': return 'bg-yellow-600';
      case 'DEF': return 'bg-blue-600';
      case 'MID': return 'bg-green-600';
      case 'FWD': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  }

  static getPositionName(position: string): string {
    switch (position) {
      case 'GK': return 'Goalkeeper';
      case 'DEF': return 'Defender';
      case 'MID': return 'Midfielder';
      case 'FWD': return 'Forward';
      default: return position;
    }
  }

  static formatMarketValue(value: number): string {
    if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `€${(value / 1000).toFixed(0)}K`;
    return `€${value}`;
  }

  static searchPlayers(teamName: string, query: string): RosterPlayer[] {
    const roster = this.getTeamRoster(teamName);
    const searchTerm = query.toLowerCase();
    
    return roster.filter(player => 
      player.name.toLowerCase().includes(searchTerm) ||
      player.position.toLowerCase().includes(searchTerm) ||
      (player.nationality && player.nationality.toLowerCase().includes(searchTerm))
    );
  }

  static getPlayersByAge(teamName: string, minAge?: number, maxAge?: number): RosterPlayer[] {
    const roster = this.getTeamRoster(teamName);
    
    return roster.filter(player => {
      if (minAge && player.age < minAge) return false;
      if (maxAge && player.age > maxAge) return false;
      return true;
    });
  }

  static getPlayersByMarketValue(teamName: string, minValue?: number, maxValue?: number): RosterPlayer[] {
    const roster = this.getTeamRoster(teamName);
    
    return roster.filter(player => {
      if (minValue && player.marketValue < minValue) return false;
      if (maxValue && player.marketValue > maxValue) return false;
      return true;
    });
  }
}

export default TeamRosterService;
