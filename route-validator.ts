
import { existsSync } from 'fs';
import { resolve } from 'path';

interface RouteMapping {
  path: string;
  componentPath: string;
}

const routes: RouteMapping[] = [
  { path: '/dashboard', componentPath: './pages/dashboard.tsx' },
  { path: '/transfers', componentPath: './pages/transfers.tsx' },
  { path: '/teams', componentPath: './pages/teams.tsx' },
  { path: '/players', componentPath: './pages/players.tsx' },
  { path: '/leagues', componentPath: './pages/leagues.tsx' },
  { path: '/team/:teamName', componentPath: './pages/team-overview.tsx' },
  { path: '/performance-dashboard', componentPath: './pages/performance-dashboard.tsx' },
  { path: '/financial-dashboard', componentPath: './pages/financial-dashboard.tsx' },
  { path: '/cross-league-comparison', componentPath: './pages/cross-league-comparison.tsx' },
  { path: '/ffp-compliance', componentPath: './pages/ffp-compliance.tsx' },
  { path: '/live-updates', componentPath: './pages/live-updates.tsx' },
  { path: '/fixtures', componentPath: './pages/fixtures.tsx' },
  { path: '/system-health', componentPath: './pages/system-health.tsx' },
  { path: '/news-sources', componentPath: './pages/news-sources.tsx' },
  { path: '/newsapi', componentPath: './pages/newsapi.tsx' },
  { path: '/authentic-database', componentPath: './pages/authentic-database.tsx' },
  { path: '/api-sports-pro', componentPath: './pages/api-sports-pro.tsx' },
  { path: '/premier-league-salaries', componentPath: './pages/premier-league-salaries.tsx' },
  { path: '/team-confidence', componentPath: './pages/team-confidence.tsx' },
  { path: '/reliability-analysis', componentPath: './pages/reliability-analysis.tsx' },
  { path: '/prediction-methodology', componentPath: './pages/prediction-methodology.tsx' },
  { path: '/compliance-explained', componentPath: './pages/compliance-explained.tsx' },
  { path: '/youtube-channel', componentPath: './pages/youtube-channel.tsx' },
  { path: '/teams-browse', componentPath: './pages/teams-browse.tsx' },
  { path: '/team-roster', componentPath: './pages/team-roster.tsx' },
  { path: '/navigation-audit', componentPath: './pages/navigation-audit.tsx' },
  { path: '/team-page-audit', componentPath: './pages/team-page-audit.tsx' }
];

export function validateRoutes(): { valid: RouteMapping[]; missing: RouteMapping[] } {
  const valid: RouteMapping[] = [];
  const missing: RouteMapping[] = [];

  routes.forEach(route => {
    const fullPath = resolve(__dirname, '..', route.componentPath);
    if (existsSync(fullPath)) {
      valid.push(route);
    } else {
      missing.push(route);
      console.error(`Missing route component: ${route.path} -> ${route.componentPath}`);
    }
  });

  return { valid, missing };
}

export function checkRoutesOnBuild(): void {
  const { valid, missing } = validateRoutes();
  
  console.log(`✅ Valid routes: ${valid.length}`);
  
  if (missing.length > 0) {
    console.error(`❌ Missing routes: ${missing.length}`);
    missing.forEach(route => {
      console.error(`  - ${route.path} -> ${route.componentPath}`);
    });
    process.exit(1);
  }
}
