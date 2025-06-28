// Advanced Transfer Market Simulation with AI-Powered Predictive Modeling
import { type Player } from "@/data/players-data";
import { aiValuationEngine, type ValuationMetrics } from "./ai-valuation-engine";

export interface TransferPrediction {
  playerId: number;
  playerName: string;
  currentTeam: string;
  predictedDestinations: DestinationPrediction[];
  transferProbability: number;
  timeframe: "immediate" | "summer" | "winter" | "longterm";
  confidenceScore: number;
  keyFactors: string[];
  predictedFee: {
    min: number;
    max: number;
    mostLikely: number;
  };
  marketForces: MarketForce[];
}

export interface DestinationPrediction {
  team: string;
  league: string;
  probability: number;
  reasoning: string[];
  fitScore: number;
  financialViability: number;
}

export interface MarketForce {
  factor: string;
  impact: "positive" | "negative" | "neutral";
  strength: number;
  description: string;
}

export interface TransferScenario {
  scenario: string;
  probability: number;
  expectedOutcome: {
    transferFee: number;
    destination: string;
    timeline: string;
    playerImpact: number;
    teamImpact: number;
  };
  confidenceInterval: {
    lower: number;
    upper: number;
  };
}

export interface LeagueTransferTrends {
  league: string;
  totalSpending: number;
  avgTransferFee: number;
  mostActivePositions: string[];
  trendDirection: "increasing" | "decreasing" | "stable";
  keyMetrics: {
    transferVolume: number;
    priceInflation: number;
    demandIndex: number;
    supplyConstraint: number;
  };
}

class TransferPredictionEngine {
  private historicalData: Map<string, any[]> = new Map();
  private marketConditions: Map<string, number> = new Map();
  
  constructor() {
    this.initializeMarketConditions();
    this.loadHistoricalPatterns();
  }

  private initializeMarketConditions() {
    // Current market conditions affecting transfers
    this.marketConditions.set("globalInflation", 1.15);
    this.marketConditions.set("premierLeagueWealth", 1.35);
    this.marketConditions.set("ffpRestrictions", 0.85);
    this.marketConditions.set("postPandemicRecovery", 1.08);
    this.marketConditions.set("youngPlayerPremium", 1.25);
    this.marketConditions.set("experiencePremium", 0.95);
  }

  private loadHistoricalPatterns() {
    // Simulate loading historical transfer patterns
    const patterns = [
      {
        fromLeague: "Ligue 1",
        toLeague: "Premier League",
        avgInflation: 1.45,
        successRate: 0.78,
        timeline: "summer"
      },
      {
        fromLeague: "Serie A",
        toLeague: "Premier League", 
        avgInflation: 1.32,
        successRate: 0.71,
        timeline: "summer"
      },
      {
        fromLeague: "La Liga",
        toLeague: "Premier League",
        avgInflation: 1.28,
        successRate: 0.65,
        timeline: "summer"
      }
    ];
    
    patterns.forEach(pattern => {
      const key = `${pattern.fromLeague}->${pattern.toLeague}`;
      this.historicalData.set(key, [pattern]);
    });
  }

  // AI-powered transfer probability calculation
  private async calculateTransferProbability(player: Player, valuation: ValuationMetrics): Promise<number> {
    let probability = 0.1; // Base probability
    
    // Age factor
    if (player.age >= 18 && player.age <= 23) probability += 0.25; // Young talents
    else if (player.age >= 24 && player.age <= 28) probability += 0.15; // Prime years
    else if (player.age >= 29 && player.age <= 32) probability += 0.05; // Experienced
    else probability -= 0.1; // Very young or aging
    
    // Performance factor
    if (valuation.performanceScore > 85) probability += 0.2;
    else if (valuation.performanceScore > 70) probability += 0.1;
    else if (valuation.performanceScore < 50) probability -= 0.05;
    
    // Market value factor
    if (player.marketValue > 100000000) probability += 0.15; // High-value targets
    else if (player.marketValue > 50000000) probability += 0.1;
    else if (player.marketValue < 20000000) probability += 0.05; // Bargains
    
    // League mobility factor
    const leagueMobility = {
      'Liga Portugal': 0.3,
      'Ligue 1': 0.25,
      'Serie A': 0.15,
      'Bundesliga': 0.12,
      'La Liga': 0.08,
      'Premier League': 0.05
    };
    
    probability += leagueMobility[player.league] || 0.1;
    
    // Contract situation (simulated)
    const contractYearsLeft = 2 + 0.5 * 3; // 2-5 years
    if (contractYearsLeft <= 1.5) probability += 0.3;
    else if (contractYearsLeft <= 2.5) probability += 0.15;
    
    // Trending factor
    if (valuation.trending === "up") probability += 0.1;
    else if (valuation.trending === "down") probability -= 0.05;
    
    return Math.min(0.95, Math.max(0.05, probability));
  }

  // Predict likely destinations using AI analysis
  private async predictDestinations(player: Player, valuation: ValuationMetrics): Promise<DestinationPrediction[]> {
    const destinations: DestinationPrediction[] = [];
    
    // Premier League destinations (always attractive)
    if (player.league !== "Premier League") {
      const plTeams = ["Manchester City", "Arsenal", "Liverpool", "Manchester United", "Chelsea", "Tottenham"];
      const selectedTeams = plTeams.slice(0, 2 + Math.floor(0.5 * 2));
      
      for (const team of selectedTeams) {
        const probability = this.calculateDestinationProbability(player, team, "Premier League", valuation);
        destinations.push({
          team,
          league: "Premier League",
          probability,
          reasoning: this.generateReasoningForDestination(player, team, "Premier League"),
          fitScore: this.calculateFitScore(player, team),
          financialViability: this.assessFinancialViability(player, team, valuation)
        });
      }
    }
    
    // La Liga destinations
    if (player.league !== "La Liga" && valuation.performanceScore > 70) {
      const laLigaTeams = ["Real Madrid", "Barcelona", "Atlético Madrid"];
      const team = laLigaTeams[Math.floor(0.5 * laLigaTeams.length)];
      
      destinations.push({
        team,
        league: "La Liga",
        probability: this.calculateDestinationProbability(player, team, "La Liga", valuation),
        reasoning: this.generateReasoningForDestination(player, team, "La Liga"),
        fitScore: this.calculateFitScore(player, team),
        financialViability: this.assessFinancialViability(player, team, valuation)
      });
    }
    
    // Serie A destinations
    if (player.league !== "Serie A" && player.marketValue > 25000000) {
      const serieATeams = ["Inter Milan", "AC Milan", "Juventus", "Napoli"];
      const team = serieATeams[Math.floor(0.5 * serieATeams.length)];
      
      destinations.push({
        team,
        league: "Serie A",
        probability: this.calculateDestinationProbability(player, team, "Serie A", valuation),
        reasoning: this.generateReasoningForDestination(player, team, "Serie A"),
        fitScore: this.calculateFitScore(player, team),
        financialViability: this.assessFinancialViability(player, team, valuation)
      });
    }
    
    return destinations.sort((a, b) => b.probability - a.probability).slice(0, 5);
  }

  private calculateDestinationProbability(player: Player, team: string, league: string, valuation: ValuationMetrics): number {
    let probability = 0.1;
    
    // League prestige factor
    const leaguePrestige = {
      'Premier League': 0.4,
      'La Liga': 0.35,
      'Serie A': 0.25,
      'Bundesliga': 0.3,
      'Ligue 1': 0.2
    };
    
    probability += leaguePrestige[league] || 0.1;
    
    // Team prestige factor
    const topTierTeams = ["Manchester City", "Real Madrid", "Barcelona", "Liverpool", "Bayern Munich", "PSG"];
    if (topTierTeams.includes(team)) probability += 0.2;
    
    // Performance compatibility
    if (valuation.performanceScore > 80) probability += 0.15;
    
    // Financial compatibility
    if (player.marketValue <= 80000000) probability += 0.1; // More realistic targets
    
    // Position need simulation
    const positionDemand = 0.5 * 0.2; // Simulate position-specific demand
    probability += positionDemand;
    
    return Math.min(0.9, probability);
  }

  private generateReasoningForDestination(player: Player, team: string, league: string): string[] {
    const reasons = [];
    
    if (league === "Premier League") {
      reasons.push("Premier League's financial power and global appeal");
      reasons.push("Higher salary potential and commercial opportunities");
    }
    
    if (["Real Madrid", "Barcelona"].includes(team)) {
      reasons.push("Opportunity to play for a historic club");
      reasons.push("Champions League ambitions");
    }
    
    if (player.age < 25) {
      reasons.push("Ideal age for a step-up move");
      reasons.push("Long-term development opportunity");
    }
    
    if (player.marketValue > 50000000) {
      reasons.push("Profile matches club's ambition");
      reasons.push("Proven track record at high level");
    }
    
    return reasons.slice(0, 3);
  }

  private calculateFitScore(player: Player, team: string): number {
    let fitScore = 60; // Base fit score
    
    // Position fit (simulated based on team needs)
    const positionFit = 70 + 0.5 * 25;
    fitScore += (positionFit - 70) * 0.3;
    
    // Age fit
    if (player.age >= 22 && player.age <= 28) fitScore += 15;
    else if (player.age < 22) fitScore += 10; // Young talent
    else if (player.age > 30) fitScore -= 10;
    
    // Performance fit
    if (player.goals + player.assists > 15) fitScore += 10;
    
    // Style fit (simulated)
    const styleFit = 60 + 0.5 * 30;
    fitScore += (styleFit - 75) * 0.2;
    
    return Math.min(100, Math.max(0, fitScore));
  }

  private assessFinancialViability(player: Player, team: string, valuation: ValuationMetrics): number {
    let viability = 50; // Base viability
    
    // Team financial strength (simulated)
    const teamFinances = {
      "Manchester City": 95,
      "PSG": 95,
      "Real Madrid": 90,
      "Barcelona": 75, // Financial constraints
      "Liverpool": 85,
      "Bayern Munich": 88,
      "Manchester United": 90,
      "Chelsea": 85,
      "Arsenal": 80,
      "Tottenham": 75
    };
    
    const teamStrength = teamFinances[team] || 70;
    viability += (teamStrength - 70) * 0.5;
    
    // Transfer fee viability
    if (valuation.finalValuation < 50000000) viability += 20;
    else if (valuation.finalValuation < 100000000) viability += 10;
    else if (valuation.finalValuation > 150000000) viability -= 15;
    
    // FFP considerations
    const ffpImpact = this.marketConditions.get("ffpRestrictions") || 1;
    viability *= ffpImpact;
    
    return Math.min(100, Math.max(0, viability));
  }

  // Main prediction function
  public async generateTransferPrediction(player: Player): Promise<TransferPrediction> {
    const valuation = await aiValuationEngine.evaluatePlayer(player);
    const transferProbability = await this.calculateTransferProbability(player, valuation);
    const destinations = await this.predictDestinations(player, valuation);
    
    // Determine timeframe
    let timeframe: "immediate" | "summer" | "winter" | "longterm" = "summer";
    if (transferProbability > 0.7) timeframe = "immediate";
    else if (transferProbability > 0.4) timeframe = "summer";
    else if (transferProbability > 0.2) timeframe = "winter";
    else timeframe = "longterm";
    
    // Generate key factors
    const keyFactors = this.generateKeyFactors(player, valuation, transferProbability);
    
    // Predict transfer fee range
    const predictedFee = this.predictTransferFee(player, valuation);
    
    // Generate market forces
    const marketForces = this.analyzeMarketForces(player, valuation);
    
    // Calculate confidence score
    const confidenceScore = this.calculatePredictionConfidence(valuation, transferProbability, destinations);
    
    return {
      playerId: player.id,
      playerName: player.name,
      currentTeam: player.team,
      predictedDestinations: destinations,
      transferProbability,
      timeframe,
      confidenceScore,
      keyFactors,
      predictedFee,
      marketForces
    };
  }

  private generateKeyFactors(player: Player, valuation: ValuationMetrics, probability: number): string[] {
    const factors = [];
    
    if (player.age < 25) factors.push("Young age increases transfer appeal");
    if (valuation.performanceScore > 80) factors.push("Outstanding recent performance");
    if (valuation.trending === "up") factors.push("Rising market value trend");
    if (player.marketValue > 75000000) factors.push("High-value transfer target");
    if (probability > 0.5) factors.push("Strong transfer speculation");
    if (valuation.confidence > 85) factors.push("High valuation confidence");
    
    return factors.slice(0, 4);
  }

  private predictTransferFee(player: Player, valuation: ValuationMetrics): {
    min: number;
    max: number;
    mostLikely: number;
  } {
    const baseValue = valuation.finalValuation;
    const volatility = valuation.volatility;
    
    const min = Math.round(baseValue * (1 - volatility));
    const max = Math.round(baseValue * (1 + volatility + 0.2)); // Transfer premium
    const mostLikely = Math.round(baseValue * 1.1); // 10% transfer premium
    
    return { min, max, mostLikely };
  }

  private analyzeMarketForces(player: Player, valuation: ValuationMetrics): MarketForce[] {
    const forces: MarketForce[] = [];
    
    forces.push({
      factor: "Age Profile",
      impact: player.age < 26 ? "positive" : player.age > 30 ? "negative" : "neutral",
      strength: Math.abs(26 - player.age) * 10,
      description: player.age < 26 ? "Young age premium in current market" : 
                  player.age > 30 ? "Age concerns may limit interest" :
                  "Optimal age for transfer"
    });
    
    forces.push({
      factor: "Performance Trend",
      impact: valuation.trending === "up" ? "positive" : 
              valuation.trending === "down" ? "negative" : "neutral",
      strength: 70,
      description: `Performance metrics are trending ${valuation.trending}`
    });
    
    forces.push({
      factor: "League Premium",
      impact: player.league === "Premier League" ? "negative" : "positive",
      strength: 60,
      description: player.league === "Premier League" ? 
                  "Already in top league, limited upward mobility" :
                  "Potential for league upgrade increases appeal"
    });
    
    forces.push({
      factor: "Market Inflation",
      impact: "positive",
      strength: 50,
      description: "Current market inflation favors seller"
    });
    
    return forces;
  }

  private calculatePredictionConfidence(
    valuation: ValuationMetrics, 
    probability: number, 
    destinations: DestinationPrediction[]
  ): number {
    let confidence = valuation.confidence * 0.4; // Base from valuation confidence
    
    // Probability consistency factor
    if (probability > 0.3 && probability < 0.7) confidence += 20; // Moderate probability
    else if (probability > 0.7) confidence += 15; // High probability
    else confidence += 10; // Low probability
    
    // Destination consistency
    const avgDestinationProb = destinations.reduce((sum, dest) => sum + dest.probability, 0) / destinations.length;
    confidence += avgDestinationProb * 30;
    
    // Market stability
    confidence += 15; // Assume stable market conditions
    
    return Math.min(100, Math.max(50, Math.round(confidence)));
  }

  // Generate multiple transfer scenarios
  public async generateTransferScenarios(player: Player): Promise<TransferScenario[]> {
    const prediction = await this.generateTransferPrediction(player);
    const scenarios: TransferScenario[] = [];
    
    // Optimistic scenario
    scenarios.push({
      scenario: "Best Case Transfer",
      probability: 0.25,
      expectedOutcome: {
        transferFee: prediction.predictedFee.max,
        destination: prediction.predictedDestinations[0]?.team || "Top-tier club",
        timeline: "Summer 2025",
        playerImpact: 85,
        teamImpact: 80
      },
      confidenceInterval: { lower: 70, upper: 95 }
    });
    
    // Most likely scenario
    scenarios.push({
      scenario: "Most Likely Transfer",
      probability: 0.5,
      expectedOutcome: {
        transferFee: prediction.predictedFee.mostLikely,
        destination: prediction.predictedDestinations[1]?.team || "Mid-tier upgrade",
        timeline: prediction.timeframe === "immediate" ? "January 2025" : "Summer 2025",
        playerImpact: 75,
        teamImpact: 70
      },
      confidenceInterval: { lower: 60, upper: 85 }
    });
    
    // Conservative scenario
    scenarios.push({
      scenario: "Stays at Current Club",
      probability: 1 - prediction.transferProbability,
      expectedOutcome: {
        transferFee: 0,
        destination: player.team,
        timeline: "No transfer",
        playerImpact: 65,
        teamImpact: 75
      },
      confidenceInterval: { lower: 50, upper: 90 }
    });
    
    return scenarios;
  }

  // Analyze league-wide transfer trends
  public analyzeLeagueTransferTrends(): LeagueTransferTrends[] {
    const leagues = ["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1", "Liga Portugal"];
    
    return leagues.map(league => ({
      league,
      totalSpending: this.estimateLeagueSpending(league),
      avgTransferFee: this.calculateAvgTransferFee(league),
      mostActivePositions: this.getMostActivePositions(league),
      trendDirection: this.analyzeTrendDirection(league),
      keyMetrics: {
        transferVolume: this.calculateTransferVolume(league),
        priceInflation: this.calculatePriceInflation(league),
        demandIndex: this.calculateDemandIndex(league),
        supplyConstraint: this.calculateSupplyConstraint(league)
      }
    }));
  }

  private estimateLeagueSpending(league: string): number {
    const estimates = {
      "Premier League": 2200000000,
      "La Liga": 850000000,
      "Serie A": 650000000,
      "Bundesliga": 750000000,
      "Ligue 1": 400000000,
      "Liga Portugal": 120000000
    };
    
    return estimates[league] || 100000000;
  }

  private calculateAvgTransferFee(league: string): number {
    const averages = {
      "Premier League": 45000000,
      "La Liga": 28000000,
      "Serie A": 22000000,
      "Bundesliga": 25000000,
      "Ligue 1": 18000000,
      "Liga Portugal": 8000000
    };
    
    return averages[league] || 15000000;
  }

  private getMostActivePositions(league: string): string[] {
    // Simulate based on current market trends
    return ["CF", "CAM", "CM", "CB", "LW"];
  }

  private analyzeTrendDirection(league: string): "increasing" | "decreasing" | "stable" {
    // Simulate trend analysis
    const trends = ["increasing", "stable", "decreasing"];
    return trends[Math.floor(0.5 * trends.length)] as any;
  }

  private calculateTransferVolume(league: string): number {
    const volumes = {
      "Premier League": 120,
      "La Liga": 95,
      "Serie A": 85,
      "Bundesliga": 78,
      "Ligue 1": 65,
      "Liga Portugal": 45
    };
    
    return volumes[league] || 30;
  }

  private calculatePriceInflation(league: string): number {
    return 1.05 + 0.5 * 0.15; // 5-20% inflation
  }

  private calculateDemandIndex(league: string): number {
    const demand = {
      "Premier League": 0.95,
      "La Liga": 0.85,
      "Serie A": 0.75,
      "Bundesliga": 0.80,
      "Ligue 1": 0.70,
      "Liga Portugal": 0.60
    };
    
    return demand[league] || 0.5;
  }

  private calculateSupplyConstraint(league: string): number {
    return 0.3 + 0.5 * 0.4; // 30-70% constraint
  }
}

export const transferPredictionEngine = new TransferPredictionEngine();
export default transferPredictionEngine;