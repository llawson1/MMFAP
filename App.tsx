import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import ReliabilityBreakdown from "@/pages/reliability-breakdown";
import PredictionMethodology from "@/pages/prediction-methodology";
import PerformanceDashboardPage from "@/pages/performance-dashboard";
import TeamProfilePage from "@/pages/team-profile";
import YouTubeChannel from "@/pages/youtube-channel";
import Leagues from "@/pages/leagues";
import TeamsBrowsePage from "@/pages/teams-browse";
import Players from "@/pages/players";
import Transfers from "@/pages/transfers";
import Fixtures from "@/pages/fixtures";
import NewsSources from "@/pages/news-sources";
import LiveUpdates from "@/pages/live-updates";
import TransferArticle from "@/pages/transfer-article";
import ComplianceExplained from "@/pages/compliance-explained";
import SystemHealth from "@/pages/system-health";
import TransferRumorsDetail from "@/pages/transfer-rumors-detail";
import ConfirmedDealsDetail from "@/pages/confirmed-deals-detail";
import MarketValueDetail from "@/pages/market-value-detail";
import ActiveUsersDetail from "@/pages/active-users-detail";
import TeamConfidencePage from "@/pages/team-confidence";
import ErrorBoundary from "@/components/error-boundary-wrapper";
import ReliabilityAnalysis from "@/pages/reliability-analysis";
import AuthenticDatabasePage from "@/pages/authentic-database";
import TeamOverview from '@/pages/team-overview'; // Import TeamOverview component
import TeamChemistryPage from "@/pages/team-chemistry";

// Missing component placeholders
const FinancialDashboardPage = () => <div className="p-8 text-white">Financial Dashboard Page</div>;
const NavigationAuditPage = () => <div className="p-8 text-white">Navigation Audit Page</div>;
const NotFound = () => <div className="p-8 text-white">Page Not Found</div>;

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/prediction-methodology" component={PredictionMethodology} />
      <Route path="/reliability/:sourceName" component={ReliabilityBreakdown} />
      <Route path="/youtube" component={YouTubeChannel} />
      <Route path="/leagues" component={Leagues} />
      <Route path="/teams" component={TeamsBrowsePage} />
      <Route path="/teams/browse" component={TeamsBrowsePage} />
      <Route path="/teams/:league" component={TeamsBrowsePage} />
      <Route path="/team/:teamName" component={TeamProfilePage} />
      <Route path="/players" component={Players} />
      <Route path="/transfers" component={Transfers} />
      <Route path="/fixtures" component={Fixtures} />
      <Route path="/news-sources" component={NewsSources} />
      <Route path="/live-updates" component={LiveUpdates} />
      <Route path="/transfer-article/:id" component={TransferArticle} />
      <Route path="/compliance-explained" component={ComplianceExplained} />
      <Route path="/system-health" component={SystemHealth} />
      <Route path="/transfer-rumors-detail" component={TransferRumorsDetail} />
      <Route path="/confirmed-deals-detail" component={ConfirmedDealsDetail} />
      <Route path="/market-value-detail" component={MarketValueDetail} />
      <Route path="/active-users-detail" component={ActiveUsersDetail} />
      <Route path="/reliability-analysis/:category" component={ReliabilityAnalysis} />
      <Route path="/performance-dashboard" component={PerformanceDashboardPage} />
      <Route path="/authentic-database" component={AuthenticDatabasePage} />
      <Route path="/team-chemistry" component={TeamChemistryPage} />
      <Route path="/financial-dashboard" component={FinancialDashboardPage} />
      <Route path="/navigation-audit" component={NavigationAuditPage} />
      <Route component={NotFound} />
    </Switch>
  );
}



// Initialize issue prevention service - disabled to prevent startup errors
// if (process.env.NODE_ENV === 'development') {
//   IssuePreventionService.initialize();
// }

function App() {
  return (
    <ErrorBoundary componentName="App">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-black text-white">
            <Toaster />
            <ErrorBoundary componentName="Router">
              <Router />
            </ErrorBoundary>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
