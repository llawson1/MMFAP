import TeamNavigationUtil from '@/team-navigation';

export interface Prediction {
  teamName: string;
  position: number;
  points: number;
  confidence: number;
}

interface HeroPredictionsProps {
  predictions: Prediction[];
  league?: string;
}

export default function HeroPredictions({ predictions, league }: HeroPredictionsProps) {
  const handleClick = (teamName: string) => {
    TeamNavigationUtil.navigateToTeam(teamName);
  };

  const suffix = (pos: number) => {
    const remainder = pos % 100;
    if (remainder >= 11 && remainder <= 13) return 'th';
    switch (remainder % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  return (
    <section className="hero-predictions">
      <h3>
        {league ? `Top ${predictions.length} ${league} Predictions` : 'Top Predictions'}
      </h3>
      <div className="predictions-grid">
        {predictions.map((pred, idx) => {
          const medal = idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : '';
          return (
            <div
              key={pred.teamName}
              className={`prediction-card ${medal}`.trim()}
              onClick={() => handleClick(pred.teamName)}
            >
              <div className="position">{pred.position}{suffix(pred.position)}</div>
              <div className="team">{pred.teamName}</div>
              <div className="points">{pred.points} pts</div>
              <div className="confidence">{Math.round(pred.confidence * 100)}% confidence</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
