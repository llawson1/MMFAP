// AUTHENTIC DATA VALIDATION SERVICE
// Enforces zero-tolerance policy for generated data

export interface AuthenticDataValidator {
  source: 'sportmonks' | 'matchday-finance' | 'sports-reference' | 'official-club' | 'verified-journalist';
  verificationUrl: string;
  lastVerified: Date;
  confidence: 100; // Only 100% verified data permitted
}

export class AuthenticDataEnforcement {
  private static readonly PROHIBITED_KEYWORDS = [
    'generateFake', 'simulateData', 'mockData', 'generateTransfers', 
    'generatePlayers', 'generateNews', 'Math.random', 'fake', 'mock', 
    'generated', 'simulate', 'placeholder'
  ];

  public static validateDataSource(data: any, validator: AuthenticDataValidator): boolean {
    // Ensure data comes from authentic source only
    if (validator.confidence !== 100) {
      throw new Error('Only 100% verified authentic data permitted');
    }

    // Check for prohibited content
    const dataString = JSON.stringify(data);
    for (const keyword of this.PROHIBITED_KEYWORDS) {
      if (dataString.includes(keyword)) {
        throw new Error(`Prohibited keyword found: ${keyword}. No generated data allowed.`);
      }
    }

    return true;
  }

  public static enforceAuthenticOnly(component: string, data: any[]): any[] {
    if (data.length === 0) {
      console.warn(`${component}: No authentic data available. Displaying "Data unavailable" message.`);
      return [];
    }

    // Verify each data item has authentic source
    return data.filter(item => {
      return item.source && item.verificationUrl && item.lastVerified;
    });
  }

  public static getNoDataMessage(dataType: string): string {
    return `${dataType} data unavailable from verified authentic sources. Please ensure API keys are configured for Sportmonks or MatchdayFinance APIs.`;
  }
}

// Export for use in components requiring authentic data validation
export default AuthenticDataEnforcement;