import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeroPredictions, { Prediction } from './hero-predictions';
import TeamNavigationUtil from './team-navigation';
import { jest } from '@jest/globals';

jest.mock('./team-navigation');

const mockedNavigate = jest.fn();
(TeamNavigationUtil as any).navigateToTeam = mockedNavigate;

describe('HeroPredictions', () => {
  const predictions: Prediction[] = [
    { teamName: 'Team A', position: 1, points: 50, confidence: 0.8 },
    { teamName: 'Team B', position: 2, points: 45, confidence: 0.7 },
  ];

  it('renders prediction cards and handles click', async () => {
    render(<HeroPredictions predictions={predictions} league="League" />);
    expect(screen.getByText('Team A')).toBeInTheDocument();
    const card = screen.getByText('Team A').closest('.prediction-card');
    await userEvent.click(card!);
    expect(mockedNavigate).toHaveBeenCalledWith('Team A');
  });
});
