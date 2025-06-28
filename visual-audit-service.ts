// Visual Audit Service for Player Images and Team Logos
import { comprehensivePlayersData } from "@/data/comprehensive-players-data";
import { teamsFinancialData } from "@/data/teams-data";

export interface ImageValidationResult {
  url: string;
  isValid: boolean;
  error?: string;
  responseTime?: number;
}

export interface TeamLogoAudit {
  teamName: string;
  logoUrl: string;
  isValid: boolean;
  fallbackUsed: boolean;
}

export interface PlayerImageAudit {
  playerName: string;
  team: string;
  imageUrl: string;
  isValid: boolean;
  isPlaceholder: boolean;
}

class VisualAuditService {
  private logoCache = new Map<string, boolean>();
  private imageCache = new Map<string, boolean>();

  async validatePlayerImages(sampleSize: number = 20): Promise<PlayerImageAudit[]> {
    const results: PlayerImageAudit[] = [];
    const sample = this.getRandomSample(comprehensivePlayersData, sampleSize);

    for (const player of sample) {
      const isValid = await this.validateImageUrl(player.imageUrl);
      const isPlaceholder = this.isPlaceholderImage(player.imageUrl);

      results.push({
        playerName: player.name,
        team: player.team,
        imageUrl: player.imageUrl,
        isValid,
        isPlaceholder
      });
    }

    return results;
  }

  async validateTeamLogos(): Promise<TeamLogoAudit[]> {
    const results: TeamLogoAudit[] = [];
    
    // Import team logos dynamically
    try {
      const { getTeamLogo } = await import("@/lib/team-logos");
      
      const sampleTeams = [
        "Liverpool", "Arsenal", "Manchester City", "Chelsea", "Manchester United",
        "Barcelona", "Real Madrid", "Bayern Munich", "AC Milan", "Inter Milan",
        "Paris Saint-Germain", "Juventus", "Atletico Madrid", "Borussia Dortmund"
      ];

      for (const teamName of sampleTeams) {
        const logoUrl = getTeamLogo(teamName);
        const isValid = await this.validateImageUrl(logoUrl);
        const fallbackUsed = logoUrl.includes('placeholder') || logoUrl === '/default-logo.png';

        results.push({
          teamName,
          logoUrl,
          isValid,
          fallbackUsed
        });
      }
    } catch (error) {
      console.warn("Could not load team logos module:", error);
    }

    return results;
  }

  private async validateImageUrl(url: string): Promise<boolean> {
    if (!url || url.trim() === '') return false;
    
    // Check cache first
    if (this.imageCache.has(url)) {
      return this.imageCache.get(url)!;
    }

    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        this.imageCache.set(url, false);
        resolve(false);
      }, 5000); // 5 second timeout

      img.onload = () => {
        clearTimeout(timeout);
        // Additional check for minimum dimensions
        const isValid = img.naturalWidth > 10 && img.naturalHeight > 10;
        this.imageCache.set(url, isValid);
        resolve(isValid);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        this.imageCache.set(url, false);
        resolve(false);
      };
      
      // Handle CORS and other issues
      img.crossOrigin = "anonymous";
      img.src = url;
    });
  }

  private isPlaceholderImage(url: string): boolean {
    const placeholderIndicators = [
      'placeholder',
      'default',
      'fallback',
      'no-image',
      'avatar-placeholder',
      'generic'
    ];

    return placeholderIndicators.some(indicator => 
      url.toLowerCase().includes(indicator)
    );
  }

  private getRandomSample<T>(array: T[], size: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - 0.5);
    return shuffled.slice(0, size);
  }

  async validateTransfermarktImages(): Promise<{ valid: number; invalid: number; total: number }> {
    // Specifically validate Transfermarkt images which should be the most reliable
    const transfermarktImages = comprehensivePlayersData
      .filter(player => player.imageUrl.includes('transfermarkt'))
      .slice(0, 10); // Test 10 Transfermarkt images

    let valid = 0;
    let invalid = 0;

    for (const player of transfermarktImages) {
      const isValid = await this.validateImageUrl(player.imageUrl);
      if (isValid) {
        valid++;
      } else {
        invalid++;
      }
    }

    return {
      valid,
      invalid,
      total: transfermarktImages.length
    };
  }

  async detectBrokenImages(): Promise<{ players: string[]; teams: string[] }> {
    const brokenPlayerImages: string[] = [];
    const brokenTeamLogos: string[] = [];

    // Check a sample of player images
    const playerSample = this.getRandomSample(comprehensivePlayersData, 50);
    for (const player of playerSample) {
      const isValid = await this.validateImageUrl(player.imageUrl);
      if (!isValid) {
        brokenPlayerImages.push(player.name);
      }
    }

    // Check team logos
    const teamLogos = await this.validateTeamLogos();
    for (const logo of teamLogos) {
      if (!logo.isValid) {
        brokenTeamLogos.push(logo.teamName);
      }
    }

    return {
      players: brokenPlayerImages,
      teams: brokenTeamLogos
    };
  }

  clearCache(): void {
    this.logoCache.clear();
    this.imageCache.clear();
  }

  getCacheStats(): { logoCache: number; imageCache: number } {
    return {
      logoCache: this.logoCache.size,
      imageCache: this.imageCache.size
    };
  }
}

export const visualAuditService = new VisualAuditService();
export default visualAuditService;