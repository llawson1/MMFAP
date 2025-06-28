import HeroPredictions, { Prediction } from '@/hero-predictions';
import { DashboardProvider, useDashboardContext } from '@/DashboardProvider';

function Dashboard() {
  const { data, isLoading } = useDashboardContext();

  const predictions: Prediction[] = data?.heroPredictions?.predictions || [];
  const league = data?.heroPredictions?.league || 'Premier League';

  if (isLoading) return <div className="p-4 text-white">Loading...</div>;

  return (
    <div className="p-4">
      <HeroPredictions predictions={predictions} league={league} />
      {/* other dashboard widgets would go here */}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
}
