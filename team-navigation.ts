// Utility for handling team navigation across the app
import { useLocation } from "wouter";
import { getTeamNameMapping, encodeTeamName } from "./team-name-mapping";

export class TeamNavigationUtil {

  // Convert team name to URL slug
  static getTeamSlug(teamName: string): string {
    return encodeTeamName(teamName);
  }

  // Get team name from URL slug
  static getTeamBySlug(slug: string): string | null {
    return getTeamNameMapping(slug);
  }

  // Get team URL for navigation
  static getTeamUrl(teamName: string): string {
    return `/team/${this.getTeamSlug(teamName)}`;
  }

  // Check if team has individual profile page
  static hasTeamPage(teamName: string): boolean {
    const mappedName = getTeamNameMapping(teamName);
    return mappedName !== teamName; // If mapping exists, team has a page
  }

  // Get all available teams (will be populated from API)
  static getAllTeams(): string[] {
    return []; // Teams will be fetched from API
  }

  // Navigate to team page (method that was missing)
  static navigateToTeam(teamName: string): void {
    const teamUrl = this.getTeamUrl(teamName);
    console.log(`Navigating to team: ${teamName} → ${teamUrl}`);
    
    // Use browser navigation for client-side routing
    if (typeof window !== 'undefined') {
      window.location.href = teamUrl;
    }
  }

  // Alternative navigation method using wouter's programmatic navigation
  static createNavigateToTeam() {
    return (teamName: string) => {
      const teamUrl = this.getTeamUrl(teamName);
      console.log(`Navigating to team: ${teamName} → ${teamUrl}`);
      return teamUrl;
    };
  }
}

export default TeamNavigationUtil;