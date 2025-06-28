import React from 'react';
import TeamNavigationUtil from '../../team-navigation';

const predictions = [
  { team: 'Liverpool', position: '1st' },
  { team: 'Arsenal', position: '2nd' },
  { team: 'Manchester City', position: '3rd' },
];

function HeroPredictions() {
  return (
    <div className="hero-predictions">
      {predictions.map(p => (
        <div
          key={p.team}
          className="prediction-card"
          onClick={() => TeamNavigationUtil.navigateToTeam(p.team)}
        >
          <div className="position">{p.position}</div>
          <div className="team">{p.team}</div>
        </div>
      ))}
    </div>
  );
}

export default HeroPredictions;
