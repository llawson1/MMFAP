// OpenAI Integration for Enhanced AI Analysis
import OpenAI from 'openai';

export interface OpenAIAnalysis {
  playerInsight: string;
  performanceNarrative: string;
  transferPotential: string;
  riskAssessment: string;
  marketAnalysis: string;
  confidenceFactors: string[];
}

export interface EnhancedPrediction {
  technicalAnalysis: any; // From existing AI service
  narrativeAnalysis: OpenAIAnalysis;
  combinedInsights: string;
  actionableRecommendations: string[];
}

export class OpenAIIntegrationService {
  private static openai: OpenAI | null = null;

  static initialize() {
    if (typeof window !== 'undefined' && process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true // Only for demo purposes
      });
    }
  }

  static isAvailable(): boolean {
    return this.openai !== null;
  }

  static async generatePlayerInsight(player: any, prediction: any): Promise<OpenAIAnalysis> {
    if (!this.openai) {
      throw new Error('OpenAI not initialized');
    }

    const prompt = this.buildAnalysisPrompt(player, prediction);

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert football analyst specializing in player performance prediction and transfer analysis. Provide detailed, professional insights based on data."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500,
        temperature: 0.7
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      return {
        playerInsight: analysis.playerInsight || 'No insight available',
        performanceNarrative: analysis.performanceNarrative || 'No narrative available',
        transferPotential: analysis.transferPotential || 'No transfer analysis available',
        riskAssessment: analysis.riskAssessment || 'No risk assessment available',
        marketAnalysis: analysis.marketAnalysis || 'No market analysis available',
        confidenceFactors: analysis.confidenceFactors || []
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate AI analysis');
    }
  }

  static async generateTransferRecommendation(player: any, targetTeams: string[]): Promise<{
    recommendations: Array<{
      team: string;
      fitScore: number;
      reasoning: string;
      transferLikelihood: number;
    }>;
    overallAssessment: string;
  }> {
    if (!this.openai) {
      throw new Error('OpenAI not initialized');
    }

    const prompt = `Analyze the transfer potential for ${player.name} (${player.position}, ${player.age} years old, currently at ${player.team}) to the following teams: ${targetTeams.join(', ')}.

    Player stats: ${player.goals} goals, ${player.assists} assists in ${player.appearances} appearances this season. Market value: €${player.marketValue.toLocaleString()}.

    For each team, provide a JSON response with:
    {
      "recommendations": [
        {
          "team": "Team Name",
          "fitScore": 85,
          "reasoning": "Detailed analysis of tactical fit, playing style, and squad needs",
          "transferLikelihood": 65
        }
      ],
      "overallAssessment": "Summary of the player's transfer prospects"
    }`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a football transfer specialist. Analyze tactical fits and provide realistic transfer assessments."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
        temperature: 0.6
      });

      return JSON.parse(response.choices[0].message.content || '{"recommendations": [], "overallAssessment": ""}');
    } catch (error) {
      console.error('OpenAI transfer analysis error:', error);
      throw new Error('Failed to generate transfer analysis');
    }
  }

  static async generateSeasonOutlook(player: any, prediction: any): Promise<{
    keyExpectations: string[];
    potentialChallenges: string[];
    successFactors: string[];
    monitoringPoints: string[];
  }> {
    if (!this.openai) {
      throw new Error('OpenAI not initialized');
    }

    const prompt = `Create a comprehensive season outlook for ${player.name} based on the following prediction data:

    Current season: ${prediction.currentSeason.goals} goals, ${prediction.currentSeason.assists} assists
    Predicted next season: ${prediction.predictedNextSeason.goals} goals, ${prediction.predictedNextSeason.assists} assists
    Confidence: ${prediction.confidenceScore}%
    Career phase: ${prediction.careerPhase.phase}
    Main risks: ${prediction.riskFactors.map((r: any) => r.type).join(', ')}

    Provide a JSON response with:
    {
      "keyExpectations": ["Expected outcome 1", "Expected outcome 2"],
      "potentialChallenges": ["Challenge 1", "Challenge 2"],
      "successFactors": ["Factor 1", "Factor 2"],
      "monitoringPoints": ["Point to monitor 1", "Point to monitor 2"]
    }`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a football performance analyst. Provide practical, actionable insights for player development and monitoring."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800,
        temperature: 0.5
      });

      return JSON.parse(response.choices[0].message.content || '{"keyExpectations": [], "potentialChallenges": [], "successFactors": [], "monitoringPoints": []}');
    } catch (error) {
      console.error('OpenAI season outlook error:', error);
      throw new Error('Failed to generate season outlook');
    }
  }

  private static buildAnalysisPrompt(player: any, prediction: any): string {
    return `Analyze the following football player data and prediction:

    Player: ${player.name}
    Position: ${player.position}
    Age: ${player.age}
    Team: ${player.team}
    League: ${player.league}
    
    Current Season Performance:
    - Goals: ${prediction.currentSeason.goals}
    - Assists: ${prediction.currentSeason.assists}
    - Appearances: ${prediction.currentSeason.appearances}
    - Market Value: €${prediction.currentSeason.marketValue.toLocaleString()}
    
    Predicted Next Season:
    - Goals: ${prediction.predictedNextSeason.goals}
    - Assists: ${prediction.predictedNextSeason.assists}
    - Market Value: €${prediction.predictedNextSeason.marketValue.toLocaleString()}
    
    AI Confidence: ${prediction.confidenceScore}%
    Career Phase: ${prediction.careerPhase.phase}
    Performance Trend: ${prediction.trendAnalysis.performance}
    
    Key Factors: ${prediction.predictionFactors.map((f: any) => `${f.name} (${f.impact > 0 ? '+' : ''}${f.impact})`).join(', ')}
    
    Risk Factors: ${prediction.riskFactors.map((r: any) => `${r.type} (${r.probability}%)`).join(', ')}

    Provide a comprehensive analysis in JSON format with these fields:
    {
      "playerInsight": "Overall assessment of the player's current status and potential",
      "performanceNarrative": "Detailed explanation of expected performance trajectory",
      "transferPotential": "Analysis of transfer prospects and market appeal",
      "riskAssessment": "Professional evaluation of key risks and mitigation strategies",
      "marketAnalysis": "Market value projection reasoning and factors",
      "confidenceFactors": ["Factor 1", "Factor 2", "Factor 3"]
    }`;
  }
}

// Initialize on module load
if (typeof window !== 'undefined') {
  OpenAIIntegrationService.initialize();
}