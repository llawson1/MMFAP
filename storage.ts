import { 
  users, transfers, teams, scenarios, reliabilitySources, liveStats,
  type User, type InsertUser, type Transfer, type InsertTransfer,
  type Team, type InsertTeam, type Scenario, type InsertScenario,
  type ReliabilitySource, type InsertReliabilitySource,
  type LiveStats, type InsertLiveStats
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Transfer methods
  getTransfers(limit?: number): Promise<Transfer[]>;
  createTransfer(transfer: InsertTransfer): Promise<Transfer>;
  getTransfersByTeam(teamName: string): Promise<Transfer[]>;
  
  // Team methods
  getTeams(league?: string): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, updates: Partial<Team>): Promise<Team | undefined>;
  
  // Scenario methods
  getScenarios(): Promise<Scenario[]>;
  createScenario(scenario: InsertScenario): Promise<Scenario>;
  getScenariosByTeam(teamId: number): Promise<Scenario[]>;
  
  // Reliability source methods
  getReliabilitySources(): Promise<ReliabilitySource[]>;
  getReliabilitySource(sourceName: string): Promise<ReliabilitySource | undefined>;
  createReliabilitySource(source: InsertReliabilitySource): Promise<ReliabilitySource>;
  
  // Live stats methods
  getLiveStats(): Promise<LiveStats | undefined>;
  updateLiveStats(stats: InsertLiveStats): Promise<LiveStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transfers: Map<number, Transfer>;
  private teams: Map<number, Team>;
  private scenarios: Map<number, Scenario>;
  private reliabilitySources: Map<string, ReliabilitySource>;
  private liveStats: LiveStats | undefined;
  private currentUserId: number;
  private currentTransferId: number;
  private currentTeamId: number;
  private currentScenarioId: number;

  constructor() {
    this.users = new Map();
    this.transfers = new Map();
    this.teams = new Map();
    this.scenarios = new Map();
    this.reliabilitySources = new Map();
    this.currentUserId = 1;
    this.currentTransferId = 1;
    this.currentTeamId = 1;
    this.currentScenarioId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize teams
    const premierLeagueTeams = [
      { name: "Liverpool", league: "Premier League", position: 1, played: 38, won: 29, drawn: 5, lost: 4, goalDifference: 63, points: 92 },
      { name: "Arsenal", league: "Premier League", position: 2, played: 38, won: 27, drawn: 6, lost: 5, goalDifference: 58, points: 87 },
      { name: "Manchester City", league: "Premier League", position: 3, played: 38, won: 25, drawn: 9, lost: 4, goalDifference: 53, points: 84 },
      { name: "Aston Villa", league: "Premier League", position: 4, played: 38, won: 22, drawn: 7, lost: 9, goalDifference: 29, points: 73 },
    ];

    premierLeagueTeams.forEach(team => {
      const newTeam = { ...team, id: this.currentTeamId++ };
      this.teams.set(newTeam.id, newTeam);
    });

    // Initialize reliability sources
    const sources = [
      {
        sourceName: "Fabrizio Romano",
        trackRecord: 28,
        networkCredibility: 23,
        verificationLevel: 19,
        recencyFactor: 14,
        overallScore: 92,
        description: "Fabrizio Romano maintains exceptional accuracy with his 'Here We Go' trademark. Strong institutional backing and verified contacts across European football."
      },
      {
        sourceName: "David Ornstein",
        trackRecord: 22,
        networkCredibility: 20,
        verificationLevel: 17,
        recencyFactor: 12,
        overallScore: 78,
        description: "Respected BBC journalist with strong Premier League connections and reliable transfer reporting."
      },
      {
        sourceName: "Guillem Balague",
        trackRecord: 18,
        networkCredibility: 16,
        verificationLevel: 14,
        recencyFactor: 10,
        overallScore: 65,
        description: "Spanish football expert with extensive La Liga knowledge and Real Sociedad connections."
      },
      {
        sourceName: "Matt Law",
        trackRecord: 25,
        networkCredibility: 22,
        verificationLevel: 18,
        recencyFactor: 13,
        overallScore: 88,
        description: "Telegraph correspondent with excellent Premier League sources and Chelsea expertise."
      }
    ];

    sources.forEach(source => {
      this.reliabilitySources.set(source.sourceName, source);
    });

    // Initialize live stats (June 22, 2025)
    this.liveStats = {
      id: 1,
      transferRumors: 156,
      confirmedDeals: 67,
      activeUsers: 18943,
      lastUpdate: new Date()
    };

    // Initialize current transfer data for June 23, 2025
    const initialTransfers = [
      {
        fromTeam: "Napoli",
        toTeam: "Arsenal", 
        playerName: "Victor Osimhen",
        fee: 120,
        description: "Arsenal agree €120M deal for Napoli striker Victor Osimhen. Medical scheduled for tomorrow.",
        source: "David Ornstein",
        sourceUrl: "https://theathletic.com/5612847/2025/06/23/victor-osimhen-arsenal-medical-napoli",
        reliabilityScore: 92,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        fromTeam: "Napoli",
        toTeam: "Chelsea",
        playerName: "Khvicha Kvaratskhelia",
        fee: 90,
        description: "Chelsea complete €90M signing of Khvicha Kvaratskhelia from Napoli. Five-year contract agreed.",
        source: "Matt Law",
        sourceUrl: "https://www.telegraph.co.uk/football/2025/06/23/kvaratskhelia-chelsea-napoli-complete",
        reliabilityScore: 88,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      },
      {
        fromTeam: "Bayern Munich",
        toTeam: "Manchester City",
        playerName: "Jamal Musiala",
        fee: 100,
        description: "Manchester City in advanced talks with Bayern Munich for Jamal Musiala. €100M package being discussed.",
        source: "Fabrizio Romano",
        sourceUrl: "https://twitter.com/FabrizioRomano/status/1673892341567",
        reliabilityScore: 95,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      },
      {
        fromTeam: "AC Milan",
        toTeam: "Paris Saint-Germain",
        playerName: "Rafael Leão",
        fee: 95,
        description: "PSG in negotiations with AC Milan for Rafael Leão. €95M bid submitted and under consideration.",
        source: "L'Équipe",
        sourceUrl: "https://www.lequipe.fr/Football/Actualites/rafael-leao-psg-milan-negotiations",
        reliabilityScore: 80,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
      }
    ];

    initialTransfers.forEach(transfer => {
      const newTransfer = { ...transfer, id: this.currentTransferId++ };
      this.transfers.set(newTransfer.id, newTransfer);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTransfers(limit?: number): Promise<Transfer[]> {
    const allTransfers = Array.from(this.transfers.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return limit ? allTransfers.slice(0, limit) : allTransfers;
  }

  async createTransfer(transfer: InsertTransfer): Promise<Transfer> {
    const id = this.currentTransferId++;
    const newTransfer: Transfer = { 
      ...transfer, 
      id, 
      timestamp: new Date(),
      fee: transfer.fee ?? null
    };
    this.transfers.set(id, newTransfer);
    return newTransfer;
  }

  async getTransfersByTeam(teamName: string): Promise<Transfer[]> {
    return Array.from(this.transfers.values())
      .filter(transfer => transfer.fromTeam === teamName || transfer.toTeam === teamName)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getTeams(league?: string): Promise<Team[]> {
    const allTeams = Array.from(this.teams.values());
    return league 
      ? allTeams.filter(team => team.league === league)
      : allTeams;
  }

  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const id = this.currentTeamId++;
    const newTeam: Team = { ...team, id };
    this.teams.set(id, newTeam);
    return newTeam;
  }

  async updateTeam(id: number, updates: Partial<Team>): Promise<Team | undefined> {
    const team = this.teams.get(id);
    if (!team) return undefined;
    
    const updatedTeam = { ...team, ...updates };
    this.teams.set(id, updatedTeam);
    return updatedTeam;
  }

  async getScenarios(): Promise<Scenario[]> {
    return Array.from(this.scenarios.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createScenario(scenario: InsertScenario): Promise<Scenario> {
    const id = this.currentScenarioId++;
    const newScenario: Scenario = { 
      ...scenario, 
      id, 
      timestamp: new Date() 
    };
    this.scenarios.set(id, newScenario);
    return newScenario;
  }

  async getScenariosByTeam(teamId: number): Promise<Scenario[]> {
    return Array.from(this.scenarios.values())
      .filter(scenario => scenario.teamId === teamId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getReliabilitySources(): Promise<ReliabilitySource[]> {
    return Array.from(this.reliabilitySources.values());
  }

  async getReliabilitySource(sourceName: string): Promise<ReliabilitySource | undefined> {
    return this.reliabilitySources.get(sourceName);
  }

  async createReliabilitySource(source: InsertReliabilitySource): Promise<ReliabilitySource> {
    const newSource: ReliabilitySource = {
      ...source,
      description: source.description ?? null
    };
    this.reliabilitySources.set(source.sourceName, newSource);
    return newSource;
  }

  async getLiveStats(): Promise<LiveStats | undefined> {
    return this.liveStats;
  }

  async updateLiveStats(stats: InsertLiveStats): Promise<LiveStats> {
    this.liveStats = { 
      id: 1, 
      ...stats, 
      lastUpdate: new Date() 
    };
    return this.liveStats;
  }
}

export const storage = new MemStorage();
