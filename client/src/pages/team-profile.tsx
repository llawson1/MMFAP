import React from 'react';
import { useRoute } from 'wouter';
import TeamNavigationUtil from '../../team-navigation';

function TeamProfilePage() {
  const [, params] = useRoute('/team/:teamName');
  const slug = params?.teamName || '';
  const teamName = TeamNavigationUtil.getTeamBySlug(slug) || slug;

  return (
    <div className="p-4 text-white">
      <h1>Team Profile: {teamName}</h1>
    </div>
  );
}

export default TeamProfilePage;
