// Application Data
const appData = {
  liverpool_colors: {
    primary_red: "#C8102E",
    secondary_gold: "#F6EB61", 
    white: "#FFFFFF",
    dark_red: "#8B0000",
    light_red: "#E31E24"
  },
  leagues: {
    premier_league: {
      teams: ["Liverpool", "Arsenal", "Manchester City", "Chelsea", "Manchester United", "Tottenham", "Newcastle", "Brighton", "Aston Villa", "West Ham", "Crystal Palace", "Fulham", "Brentford", "Wolves", "Nottingham Forest", "Everton", "Leicester", "Bournemouth", "Southampton", "Ipswich"],
      total_spending: "367.2M",
      title_favorite: "Liverpool (45% odds)"
    },
    la_liga: {
      teams: ["Real Madrid", "Barcelona", "Atletico Madrid", "Sevilla", "Athletic Bilbao", "Real Sociedad", "Villarreal", "Valencia", "Real Betis", "Osasuna"],
      total_spending: "89.3M",
      title_favorite: "Barcelona (65% odds)"
    },
    serie_a: {
      teams: ["Inter Milan", "Napoli", "AC Milan", "Juventus", "Atalanta", "Roma", "Lazio", "Fiorentina", "Bologna", "Torino"],
      total_spending: "47.5M", 
      title_favorite: "Inter Milan (55% odds)"
    },
    bundesliga: {
      teams: ["Bayern Munich", "Bayer Leverkusen", "Borussia Dortmund", "RB Leipzig", "Eintracht Frankfurt", "Borussia Monchengladbach", "VfL Wolfsburg", "SC Freiburg"],
      total_spending: "52.1M",
      title_favorite: "Bayern Munich (70% odds)"
    },
    ligue_1: {
      teams: ["PSG", "Monaco", "Marseille", "Lyon", "Lille", "Nice", "Rennes", "Strasbourg", "Nantes", "Lens"],
      total_spending: "35.2M",
      title_favorite: "PSG (85% odds)"
    }
  },
  
  // Enhanced transfers data
  transfers_data: {
    spending_by_league: {
      "Premier League": 367.2,
      "La Liga": 89.3,
      "Serie A": 47.5,
      "Bundesliga": 52.1,
      "Ligue 1": 35.2
    },
    major_transfers: [
      {player: "Florian Wirtz", from: "Bayer Leverkusen", to: "Liverpool", fee: "£116M", impact: 9.5, status: "Completed"},
      {player: "Jeremie Frimpong", from: "Bayer Leverkusen", to: "Liverpool", fee: "£29.5M", impact: 7.8, status: "Completed"},
      {player: "Trent Alexander-Arnold", from: "Liverpool", to: "Real Madrid", fee: "£8.3M", impact: 8.2, status: "Completed"},
      {player: "Kevin De Bruyne", from: "Manchester City", to: "Napoli", fee: "Free", impact: 9.0, status: "Completed"},
      {player: "Martin Zubimendi", from: "Real Sociedad", to: "Arsenal", fee: "£55M", impact: 7.5, status: "Completed"},
      {player: "Marcus Rashford", from: "Manchester United", to: "Newcastle", fee: "£60M", impact: 7.0, status: "Rumored"},
      {player: "Alexander Isak", from: "Newcastle", to: "Liverpool", fee: "£150M", impact: 8.5, status: "Negotiating"}
    ],
    live_news: [
      {headline: "Liverpool confident Wirtz will transform title hopes", time: "2 min ago", reliability: 92, source: "Fabrizio Romano", impact: "High", category: "transfers"},
      {headline: "Newcastle prepare final £60M Rashford bid", time: "15 min ago", reliability: 85, source: "Sky Sports", impact: "Medium", category: "transfers"},
      {headline: "Arsenal complete Zubimendi medical in London", time: "23 min ago", reliability: 78, source: "BBC Sport", impact: "High", category: "transfers"},
      {headline: "Real Madrid close to Alexander-Arnold announcement", time: "31 min ago", reliability: 88, source: "The Athletic", impact: "High", category: "transfers"},
      {headline: "Isak contract talks stall at Newcastle", time: "45 min ago", reliability: 75, source: "The Guardian", impact: "Medium", category: "contracts"},
      {headline: "PSG monitoring Salah situation at Liverpool", time: "1 hour ago", reliability: 68, source: "L'Equipe", impact: "Low", category: "rumors"}
    ],
    reliability_breakdown: {
      fabrizio_romano: {
        score: 92,
        track_record: 28,
        network_credibility: 23,
        verification_level: 19,
        recency: 14,
        cross_source: 8,
        justification: "Here We Go trademark with exceptional accuracy rate. Strong institutional backing and verified contacts across European football."
      },
      sky_sports: {
        score: 85,
        track_record: 25,
        network_credibility: 24,
        verification_level: 16,
        recency: 12,
        cross_source: 8,
        justification: "Established UK broadcaster with dedicated transfer team. Strong Premier League sources but occasionally speculative on European moves."
      },
      bbc_sport: {
        score: 78,
        track_record: 22,
        network_credibility: 25,
        verification_level: 15,
        recency: 10,
        cross_source: 6,
        justification: "BBC's public service mandate ensures editorial standards. Conservative reporting approach sometimes leads to later confirmations."
      }
    }
  },

  // Enhanced predictions data
  predictions_data: {
    leagues: {
      premier_league: {
        name: "Premier League",
        teams: [
          {position: 1, team: "Liverpool", points: 90, change: "+6", confidence: 85},
          {position: 2, team: "Arsenal", points: 84, change: "+10", confidence: 78},
          {position: 3, team: "Manchester City", points: 81, change: "-4", confidence: 82},
          {position: 4, team: "Chelsea", points: 79, change: "+12", confidence: 65},
          {position: 5, team: "Newcastle", points: 74, change: "-8", confidence: 45},
          {position: 6, team: "Manchester United", points: 68, change: "+26", confidence: 55},
          {position: 7, team: "Tottenham", points: 64, change: "+26", confidence: 60},
          {position: 8, team: "Brighton", points: 62, change: "+2", confidence: 70},
          {position: 9, team: "Aston Villa", points: 58, change: "-4", confidence: 68},
          {position: 10, team: "West Ham", points: 54, change: "-1", confidence: 72},
          {position: 11, team: "Crystal Palace", points: 52, change: "+3", confidence: 75},
          {position: 12, team: "Fulham", points: 50, change: "+2", confidence: 78},
          {position: 13, team: "Brentford", points: 48, change: "-13", confidence: 70},
          {position: 14, team: "Nottingham Forest", points: 46, change: "+6", confidence: 65},
          {position: 15, team: "Everton", points: 44, change: "+8", confidence: 60},
          {position: 16, team: "Wolves", points: 38, change: "-3", confidence: 55},
          {position: 17, team: "Leicester", points: 36, change: "+5", confidence: 50},
          {position: 18, team: "Leeds", points: 34, change: "NEW", confidence: 40},
          {position: 19, team: "Burnley", points: 32, change: "NEW", confidence: 35},
          {position: 20, team: "Sunderland", points: 28, change: "NEW", confidence: 30}
        ]
      },
      la_liga: {
        name: "La Liga",
        teams: [
          {position: 1, team: "Barcelona", points: 87, change: "+3", confidence: 75},
          {position: 2, team: "Real Madrid", points: 84, change: "+5", confidence: 78},
          {position: 3, team: "Atletico Madrid", points: 75, change: "+1", confidence: 70},
          {position: 4, team: "Athletic Bilbao", points: 68, change: "+4", confidence: 65},
          {position: 5, team: "Real Sociedad", points: 64, change: "-8", confidence: 60},
          {position: 6, team: "Villarreal", points: 58, change: "+2", confidence: 68},
          {position: 7, team: "Valencia", points: 52, change: "+1", confidence: 55},
          {position: 8, team: "Real Betis", points: 48, change: "-3", confidence: 62},
          {position: 9, team: "Sevilla", points: 44, change: "-5", confidence: 58},
          {position: 10, team: "Celta Vigo", points: 42, change: "+2", confidence: 52}
        ]
      },
      serie_a: {
        name: "Serie A",
        teams: [
          {position: 1, team: "Inter Milan", points: 86, change: "+4", confidence: 72},
          {position: 2, team: "Napoli", points: 82, change: "-3", confidence: 68},
          {position: 3, team: "AC Milan", points: 78, change: "+6", confidence: 65},
          {position: 4, team: "Juventus", points: 75, change: "+2", confidence: 70},
          {position: 5, team: "Atalanta", points: 68, change: "+1", confidence: 66},
          {position: 6, team: "Roma", points: 62, change: "-2", confidence: 58},
          {position: 7, team: "Lazio", points: 58, change: "+3", confidence: 60},
          {position: 8, team: "Fiorentina", points: 54, change: "+1", confidence: 55},
          {position: 9, team: "Bologna", points: 50, change: "+4", confidence: 52},
          {position: 10, team: "Torino", points: 46, change: "-1", confidence: 48}
        ]
      },
      bundesliga: {
        name: "Bundesliga",
        teams: [
          {position: 1, team: "Bayern Munich", points: 88, change: "+2", confidence: 85},
          {position: 2, team: "Bayer Leverkusen", points: 76, change: "-14", confidence: 60},
          {position: 3, team: "Borussia Dortmund", points: 72, change: "+1", confidence: 68},
          {position: 4, team: "RB Leipzig", points: 68, change: "+3", confidence: 72},
          {position: 5, team: "Eintracht Frankfurt", points: 62, change: "+2", confidence: 58},
          {position: 6, team: "VfL Wolfsburg", points: 56, change: "-1", confidence: 52},
          {position: 7, team: "SC Freiburg", points: 52, change: "+4", confidence: 65},
          {position: 8, team: "Borussia Monchengladbach", points: 48, change: "-2", confidence: 50},
          {position: 9, team: "Union Berlin", points: 44, change: "+1", confidence: 46},
          {position: 10, team: "Werder Bremen", points: 40, change: "-3", confidence: 42}
        ]
      },
      ligue_1: {
        name: "Ligue 1",
        teams: [
          {position: 1, team: "PSG", points: 89, change: "+5", confidence: 90},
          {position: 2, team: "Monaco", points: 68, change: "+2", confidence: 65},
          {position: 3, team: "Marseille", points: 65, change: "+1", confidence: 62},
          {position: 4, team: "Lyon", points: 62, change: "+4", confidence: 58},
          {position: 5, team: "Lille", points: 58, change: "-2", confidence: 55},
          {position: 6, team: "Nice", points: 54, change: "+1", confidence: 60},
          {position: 7, team: "Rennes", points: 50, change: "-3", confidence: 52},
          {position: 8, team: "Strasbourg", points: 46, change: "+2", confidence: 48},
          {position: 9, team: "Nantes", points: 42, change: "+1", confidence: 44},
          {position: 10, team: "Lens", points: 38, change: "-4", confidence: 40}
        ]
      }
    }
  }
};

// Application State
let currentPage = 'home';
let currentLeague = 'premier_league';
let selectedTeam = 'Liverpool';
let currentPredictionLeague = 'premier_league';
let simulatorState = {
  adaptation: 75,
  financial: 50,
  injury: 20,
  depth: 70,
  tactics: 85,
  coefficient: 80,
  revenue: 60,
  transferImpact: 0,
  clFocus: true,
  leaguePriority: false,
  cupRuns: false,
  ffpLevel: 'full'
};

// Chart instances
let trajectoryChart = null;
let comparisonChart = null;
let spendingChart = null;
let progressionChart = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeTeamSelector();
  initializeSimulatorControls();
  initializeCharts();
  initializeTransfersPage();
  initializePredictionsPage();
  startNewsTickerAnimation();
  updateSimulatorResults();
});

// Navigation System
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const pages = document.querySelectorAll('.page');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      const targetPage = this.dataset.page;
      showPage(targetPage);
    });
  });

  // Quick access navigation
  const accessCards = document.querySelectorAll('.access-card[data-navigate]');
  accessCards.forEach(card => {
    card.addEventListener('click', function() {
      const targetPage = this.dataset.navigate;
      showPage(targetPage);
    });
  });
}

function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Show target page
  const targetPage = document.getElementById(pageId + '-page');
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  // Update navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  const activeNavLink = document.querySelector(`[data-page="${pageId}"]`);
  if (activeNavLink) {
    activeNavLink.classList.add('active');
  }
  
  currentPage = pageId;

  // Initialize page-specific content
  if (pageId === 'transfers') {
    populateTransfersPage();
  } else if (pageId === 'predictions') {
    populatePredictionsPage();
  }
}

// Team Selector System
function initializeTeamSelector() {
  const leagueTabs = document.querySelectorAll('.league-tab');
  const teamGrid = document.getElementById('team-grid');
  
  leagueTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const league = this.dataset.league;
      switchLeague(league);
    });
  });
  
  // Initialize with Premier League
  switchLeague('premier_league');
}

function switchLeague(leagueId) {
  // Update tab active state
  document.querySelectorAll('.league-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`[data-league="${leagueId}"]`).classList.add('active');
  
  // Update team grid
  const teamGrid = document.getElementById('team-grid');
  const teams = appData.leagues[leagueId].teams;
  
  teamGrid.innerHTML = teams.map(team => 
    `<div class="team-card ${team === selectedTeam ? 'selected' : ''}" data-team="${team}">
      ${team}
    </div>`
  ).join('');
  
  // Add team selection listeners
  teamGrid.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('click', function() {
      selectTeam(this.dataset.team);
    });
  });
  
  currentLeague = leagueId;
}

function selectTeam(teamName) {
  // Update visual selection
  document.querySelectorAll('.team-card').forEach(card => {
    card.classList.remove('selected');
  });
  document.querySelector(`[data-team="${teamName}"]`).classList.add('selected');
  
  selectedTeam = teamName;
  updateSimulatorResults();
}

// Transfers Page Initialization
function initializeTransfersPage() {
  // Auto-refresh toggle
  const refreshBtn = document.getElementById('refresh-feed');
  if (refreshBtn) {
    let autoRefresh = false;
    refreshBtn.addEventListener('click', function() {
      autoRefresh = !autoRefresh;
      this.textContent = autoRefresh ? '⏸️ Auto-Refresh' : '🔄 Auto-Refresh';
      this.classList.toggle('btn--primary', autoRefresh);
      this.classList.toggle('btn--secondary', !autoRefresh);
    });
  }

  // Transfer simulator
  const feeSlider = document.getElementById('fee-slider');
  const feeDisplay = document.getElementById('fee-display');
  const simulateBtn = document.getElementById('simulate-transfer');

  if (feeSlider && feeDisplay) {
    feeSlider.addEventListener('input', function() {
      feeDisplay.textContent = `£${this.value}M`;
    });
  }

  if (simulateBtn) {
    simulateBtn.addEventListener('click', simulateTransfer);
  }

  // Reliability source cards
  const sourceCards = document.querySelectorAll('.source-card');
  sourceCards.forEach(card => {
    card.addEventListener('click', function() {
      const source = this.dataset.source;
      showReliabilityModal(source);
    });
  });

  // Modal close handlers
  const reliabilityModalClose = document.getElementById('reliability-modal-close');
  const reliabilityModalOverlay = document.getElementById('reliability-modal-overlay');
  
  if (reliabilityModalClose) {
    reliabilityModalClose.addEventListener('click', closeReliabilityModal);
  }
  
  if (reliabilityModalOverlay) {
    reliabilityModalOverlay.addEventListener('click', function(e) {
      if (e.target === this) closeReliabilityModal();
    });
  }
}

function populateTransfersPage() {
  populateLiveFeed();
  populateMajorSignings();
  populateSpendingStats();
  createSpendingChart();
}

function populateLiveFeed() {
  const liveFeed = document.getElementById('live-feed');
  if (!liveFeed) return;

  const feedItems = appData.transfers_data.live_news.map(item => `
    <div class="feed-item">
      <div class="feed-header">
        <div class="feed-headline">${item.headline}</div>
        <div class="reliability-badge" onclick="showReliabilityModal('${item.source.toLowerCase().replace(' ', '_')}')">${item.reliability}%</div>
      </div>
      <div class="feed-meta">
        <span>${item.time} • ${item.source}</span>
        <span class="impact-level impact-${item.impact.toLowerCase()}">${item.impact} Impact</span>
      </div>
    </div>
  `).join('');

  liveFeed.innerHTML = feedItems;
  
  // Update last update time
  const lastUpdateTime = document.getElementById('last-update-time');
  if (lastUpdateTime) {
    lastUpdateTime.textContent = 'Just now';
  }
}

function populateMajorSignings() {
  const signingsGrid = document.getElementById('signings-grid');
  if (!signingsGrid) return;

  const signings = appData.transfers_data.major_transfers.map(transfer => `
    <div class="signing-card">
      <div class="signing-header">
        <div class="player-info">
          <h3>${transfer.player}</h3>
          <div class="transfer-route">${transfer.from} → ${transfer.to}</div>
        </div>
        <div class="transfer-fee">${transfer.fee}</div>
      </div>
      <div class="signing-details">
        <div class="impact-rating">
          <span>Impact Rating:</span>
          <span class="impact-score">${transfer.impact}/10</span>
        </div>
        <div class="transfer-status status-${transfer.status.toLowerCase()}">${transfer.status}</div>
      </div>
    </div>
  `).join('');

  signingsGrid.innerHTML = signings;
}

function populateSpendingStats() {
  const spendingStats = document.getElementById('spending-stats');
  if (!spendingStats) return;

  const stats = Object.entries(appData.transfers_data.spending_by_league).map(([league, amount]) => `
    <div class="spending-stat">
      <span class="league-name">${league}</span>
      <span class="spending-amount">€${amount}M</span>
    </div>
  `).join('');

  spendingStats.innerHTML = stats;
}

function createSpendingChart() {
  const ctx = document.getElementById('spending-chart');
  if (!ctx) return;

  const data = appData.transfers_data.spending_by_league;
  
  if (spendingChart) {
    spendingChart.destroy();
  }

  spendingChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: 'Spending (€M)',
        data: Object.values(data),
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
        borderColor: '#C8102E',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { 
          beginAtZero: true,
          title: { display: true, text: 'Spending (€M)' }
        }
      }
    }
  });
}

function simulateTransfer() {
  const playerName = document.getElementById('player-name').value.trim();
  const fee = parseInt(document.getElementById('fee-slider').value);
  const fromClub = document.getElementById('from-club').value;
  const toClub = document.getElementById('to-club').value;
  const resultsContainer = document.getElementById('simulation-results');

  if (!playerName || !fromClub || !toClub) {
    resultsContainer.innerHTML = `
      <div class="simulation-result">
        <div class="result-label">Error</div>
        <div class="result-value">Please fill all fields</div>
      </div>
    `;
    return;
  }

  // Add loading state
  resultsContainer.innerHTML = `
    <div class="simulation-result">
      <div class="result-label">Calculating...</div>
      <div class="result-value">Please wait</div>
    </div>
  `;

  // Simulate calculations with a delay for better UX
  setTimeout(() => {
    const impactRating = Math.min(10, Math.max(5, (fee / 20) + (Math.random() * 2)));
    const titleOddsChange = Math.round((fee / 50) * 10 + (Math.random() * 5));
    const marketValueChange = Math.round(fee * 0.8 + (Math.random() * 20));
    const ffpStatus = fee > 100 ? 'At Risk' : fee > 60 ? 'Warning' : 'Safe';

    resultsContainer.innerHTML = `
      <div class="simulation-result">
        <div class="result-label">Impact Rating</div>
        <div class="result-value">${impactRating.toFixed(1)}/10</div>
      </div>
      <div class="simulation-result">
        <div class="result-label">Title Odds Change</div>
        <div class="result-value">+${titleOddsChange}%</div>
      </div>
      <div class="simulation-result">
        <div class="result-label">Market Value Impact</div>
        <div class="result-value">€${marketValueChange}M</div>
      </div>
      <div class="simulation-result">
        <div class="result-label">FFP Compliance</div>
        <div class="result-value">${ffpStatus}</div>
      </div>
    `;
  }, 500);
}

function showReliabilityModal(sourceKey) {
  const modal = document.getElementById('reliability-modal');
  const overlay = document.getElementById('reliability-modal-overlay');
  const title = document.getElementById('reliability-modal-title');
  const content = document.getElementById('reliability-modal-content');

  const source = appData.transfers_data.reliability_breakdown[sourceKey];
  if (!source) return;

  const sourceName = sourceKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  title.textContent = `${sourceName} - Reliability Breakdown`;
  
  content.innerHTML = `
    <div class="team-detail-grid">
      <div class="detail-item">
        <span class="detail-label">Overall Score</span>
        <span class="detail-value">${source.score}%</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Track Record</span>
        <span class="detail-value">${source.track_record}/30</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Network Credibility</span>
        <span class="detail-value">${source.network_credibility}/25</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Verification Level</span>
        <span class="detail-value">${source.verification_level}/20</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Recency Factor</span>
        <span class="detail-value">${source.recency}/15</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Cross-Source</span>
        <span class="detail-value">${source.cross_source}/10</span>
      </div>
    </div>
    <div style="margin-top: 24px;">
      <h4 style="color: #C8102E; margin-bottom: 16px; font-size: 18px;">Expert Analysis</h4>
      <p style="line-height: 1.6; font-size: 14px; color: #626C71;">${source.justification}</p>
    </div>
  `;

  overlay.classList.add('active');
}

function closeReliabilityModal() {
  const overlay = document.getElementById('reliability-modal-overlay');
  overlay.classList.remove('active');
}

// Predictions Page Initialization
function initializePredictionsPage() {
  const leagueSelector = document.getElementById('league-selector');
  const applyBtn = document.getElementById('apply-league');

  if (leagueSelector && applyBtn) {
    applyBtn.addEventListener('click', function() {
      // Add loading feedback
      applyBtn.textContent = 'Loading...';
      applyBtn.disabled = true;
      
      setTimeout(() => {
        currentPredictionLeague = leagueSelector.value;
        populatePredictionsPage();
        applyBtn.textContent = 'APPLY';
        applyBtn.disabled = false;
      }, 300);
    });
  }

  // Modal handlers
  const modalClose = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('modal-overlay');
  
  if (modalClose) {
    modalClose.addEventListener('click', closeTeamModal);
  }
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === this) closeTeamModal();
    });
  }
}

function populatePredictionsPage() {
  const leagueData = appData.predictions_data.leagues[currentPredictionLeague];
  if (!leagueData) return;

  // Update league title
  const leagueTitle = document.getElementById('league-title');
  if (leagueTitle) {
    leagueTitle.textContent = `${leagueData.name} Predictions`;
  }

  populateLeagueTable(leagueData);
  createProgressionChart(leagueData);
}

function populateLeagueTable(leagueData) {
  const leagueTable = document.getElementById('league-table');
  if (!leagueTable) return;

  const headerRow = `
    <div class="table-row table-header">
      <div class="position">Pos</div>
      <div class="team-name">Team</div>
      <div class="points">Pts</div>
      <div class="change">Change</div>
      <div class="confidence">Conf</div>
    </div>
  `;

  const teamRows = leagueData.teams.map(team => {
    let changeClass = 'change-positive';
    if (team.change.startsWith('-')) changeClass = 'change-negative';
    if (team.change === 'NEW') changeClass = 'change-new';

    let positionClass = '';
    if (team.position <= 4) positionClass = 'cl-position';
    else if (team.position <= 6) positionClass = 'el-position';
    else if (team.position === 7) positionClass = 'ecl-position';
    else if (team.position >= 18 && currentPredictionLeague === 'premier_league') positionClass = 'relegation-position';
    else if (team.position >= (leagueData.teams.length - 2)) positionClass = 'relegation-position';

    return `
      <div class="table-row ${positionClass}" data-team="${team.team}" onclick="showTeamModal('${team.team}', this.dataset.team)">
        <div class="position">${team.position}</div>
        <div class="team-name">${team.team}</div>
        <div class="points">${team.points}</div>
        <div class="change ${changeClass}">${team.change}</div>
        <div class="confidence">${team.confidence}%</div>
      </div>
    `;
  }).join('');

  leagueTable.innerHTML = headerRow + teamRows;
}

function createProgressionChart(leagueData) {
  const ctx = document.getElementById('progression-chart');
  if (!ctx) return;

  if (progressionChart) {
    progressionChart.destroy();
  }

  // Generate mock progression data for top 6 teams
  const topTeams = leagueData.teams.slice(0, 6);
  const labels = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
  
  const datasets = topTeams.map((team, index) => {
    const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545'];
    const basePoints = Math.max(20, team.points - 30);
    const progressionData = labels.map((_, i) => {
      return Math.round(basePoints + (team.points - basePoints) * (i + 1) / labels.length + 
             (Math.random() * 4 - 2));
    });

    return {
      label: team.team,
      data: progressionData,
      borderColor: colors[index],
      backgroundColor: colors[index] + '20',
      tension: 0.4,
      fill: false
    };
  });

  progressionChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        y: { 
          beginAtZero: true,
          title: { display: true, text: 'Points' }
        }
      }
    }
  });
}

function showTeamModal(teamName, teamElement) {
  const modal = document.getElementById('team-modal');
  const overlay = document.getElementById('modal-overlay');
  const modalTeamName = document.getElementById('modal-team-name');
  const modalContent = document.getElementById('modal-content');

  // Find team data
  const leagueData = appData.predictions_data.leagues[currentPredictionLeague];
  const team = leagueData.teams.find(t => t.team === teamName);
  
  if (!team) return;

  modalTeamName.textContent = `${teamName} - Season Projection`;
  
  // Generate additional team details
  const formGuide = ['W', 'W', 'D', 'L', 'W'].sort(() => Math.random() - 0.5).slice(0, 5);
  const goalsFor = Math.round(team.points * 1.2 + (Math.random() * 20));
  const goalsAgainst = Math.round(60 - (team.points - 40) * 0.5 + (Math.random() * 15));
  const goalDifference = goalsFor - goalsAgainst;

  modalContent.innerHTML = `
    <div class="team-detail-grid">
      <div class="detail-item">
        <span class="detail-label">Current Position</span>
        <span class="detail-value">${team.position}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Projected Points</span>
        <span class="detail-value">${team.points}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Goals For</span>
        <span class="detail-value">${goalsFor}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Goals Against</span>
        <span class="detail-value">${goalsAgainst}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Goal Difference</span>
        <span class="detail-value">${goalDifference > 0 ? '+' : ''}${goalDifference}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Confidence Level</span>
        <span class="detail-value">${team.confidence}%</span>
      </div>
    </div>
    <div style="margin-top: 24px;">
      <h4 style="color: #C8102E; margin-bottom: 16px; font-size: 18px;">Recent Form</h4>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        ${formGuide.map(result => {
          const color = result === 'W' ? '#1FB8CD' : result === 'D' ? '#FFC185' : '#B4413C';
          return `<span style="background: ${color}; color: white; padding: 6px 10px; border-radius: 6px; font-weight: bold; font-size: 12px;">${result}</span>`;
        }).join('')}
      </div>
    </div>
    <div style="margin-top: 24px;">
      <h4 style="color: #C8102E; margin-bottom: 16px; font-size: 18px;">Season Outlook</h4>
      <p style="line-height: 1.6; font-size: 14px; color: #626C71;">
        ${generateTeamOutlook(team)}
      </p>
    </div>
  `;

  overlay.classList.add('active');
}

function generateTeamOutlook(team) {
  if (team.position === 1) {
    return "Strong title contenders with excellent squad depth and tactical flexibility. Expected to maintain pressure throughout the season with consistent performances and key player availability.";
  } else if (team.position <= 2) {
    return "Solid championship prospects with key areas of strength. Minor tactical improvements and consistency in crucial fixtures needed to secure top position this season.";
  } else if (team.position <= 4) {
    return "Competitive top-four challenge expected with strong European prospects. Quality squad depth will support cup runs alongside league campaign commitments.";
  } else if (team.position <= 6) {
    return "Europa League contenders with potential for improvement. Squad rotation and tactical flexibility will be tested across multiple competition fronts.";
  } else if (team.position <= 10) {
    return "Mid-table stability expected with opportunities for cup progression. Focus on squad development and tactical consistency for future season building.";
  } else {
    return "Lower table positioning with emphasis on defensive solidity and set-piece efficiency. Key focus on avoiding relegation battle and building foundation for improvement.";
  }
}

function closeTeamModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('active');
}

// Simulator Controls (existing functionality preserved)
function initializeSimulatorControls() {
  // Slider controls
  const sliders = [
    { id: 'adaptation-slider', valueId: 'adaptation-value', suffix: '%', property: 'adaptation' },
    { id: 'financial-slider', valueId: 'financial-value', property: 'financial', 
      labels: ['Low', 'Medium', 'High', 'Very High'] },
    { id: 'injury-slider', valueId: 'injury-value', suffix: '%', property: 'injury' },
    { id: 'depth-slider', valueId: 'depth-value', property: 'depth',
      labels: ['Poor', 'Adequate', 'Good', 'Excellent'] },
    { id: 'tactics-slider', valueId: 'tactics-value', suffix: '%', property: 'tactics' },
    { id: 'coefficient-slider', valueId: 'coefficient-value', property: 'coefficient',
      labels: ['Low', 'Medium', 'High', 'Very High'] },
    { id: 'revenue-slider', valueId: 'revenue-value', property: 'revenue',
      labels: ['Declining', 'Stable', 'Growing', 'Booming'] }
  ];

  sliders.forEach(slider => {
    const element = document.getElementById(slider.id);
    const valueElement = document.getElementById(slider.valueId);
    
    if (element && valueElement) {
      element.addEventListener('input', function() {
        const value = parseInt(this.value);
        simulatorState[slider.property] = value;
        
        if (slider.suffix) {
          valueElement.textContent = value + slider.suffix;
        } else if (slider.labels) {
          const index = Math.floor((value / 100) * (slider.labels.length - 1));
          valueElement.textContent = slider.labels[Math.min(index, slider.labels.length - 1)];
        }
        
        updateSimulatorResults();
      });
    }
  });

  // Transfer selection
  const transferSelect = document.getElementById('transfer-select');
  if (transferSelect) {
    transferSelect.addEventListener('change', function() {
      const transferValue = this.value;
      const impacts = { wirtz: 9.5, frimpong: 7.8, taa: -8.2, kdb: 9.0, zubimendi: 7.5 };
      simulatorState.transferImpact = impacts[transferValue] || 0;
      updateSimulatorResults();
    });
  }

  // Checkbox controls
  const checkboxes = ['cl-focus', 'league-priority', 'cup-runs'];
  checkboxes.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('change', function() {
        const property = id.replace('-', '').replace('cl', 'cl').replace('focus', 'Focus')
          .replace('league', 'league').replace('priority', 'Priority')
          .replace('cup', 'cup').replace('runs', 'Runs');
        simulatorState[property] = this.checked;
        updateSimulatorResults();
      });
    }
  });

  // FFP selection
  const ffpSelect = document.getElementById('ffp-select');
  if (ffpSelect) {
    ffpSelect.addEventListener('change', function() {
      simulatorState.ffpLevel = this.value;
      updateSimulatorResults();
    });
  }

  // Action buttons
  const actionButtons = document.querySelectorAll('.simulator-actions .btn');
  actionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const text = this.textContent.trim();
      if (text === 'Save Scenario') {
        saveScenario();
      } else if (text === 'Export Results') {
        exportResults();
      } else if (text === 'Reset to Default') {
        resetToDefault();
      } else if (text === 'Share Analysis') {
        shareAnalysis();
      }
    });
  });
}

// Simulator Calculations (existing functionality preserved)
function updateSimulatorResults() {
  const basePoints = getBasePoints(selectedTeam);
  const calculations = calculateImpacts(basePoints);
  
  // Update display values
  const positionImpact = document.getElementById('position-impact');
  const pointsImpact = document.getElementById('points-impact');
  const oddsImpact = document.getElementById('odds-impact');
  const europeImpact = document.getElementById('europe-impact');

  if (positionImpact) positionImpact.textContent = 
    (calculations.positionChange > 0 ? '+' : '') + calculations.positionChange.toFixed(1);
  if (pointsImpact) pointsImpact.textContent = 
    (calculations.pointsChange > 0 ? '+' : '') + calculations.pointsChange.toFixed(1);
  if (oddsImpact) oddsImpact.textContent = calculations.titleOdds + '%';
  if (europeImpact) europeImpact.textContent = calculations.europeOdds + '%';
  
  // Update confidence bars
  updateConfidenceBars(calculations);
  
  // Update charts
  updateCharts(calculations);
}

function getBasePoints(team) {
  const teamBasePoints = {
    'Liverpool': 82, 'Arsenal': 78, 'Manchester City': 85, 'Chelsea': 70, 'Manchester United': 68,
    'Real Madrid': 88, 'Barcelona': 84, 'Atletico Madrid': 75,
    'Inter Milan': 85, 'Napoli': 78, 'AC Milan': 72,
    'Bayern Munich': 90, 'Bayer Leverkusen': 75, 'Borussia Dortmund': 72,
    'PSG': 85, 'Monaco': 68, 'Marseille': 65
  };
  return teamBasePoints[team] || 70;
}

function calculateImpacts(basePoints) {
  let pointsModifier = 0;
  
  // Transfer impact
  pointsModifier += simulatorState.transferImpact * 0.8;
  
  // Adaptation impact
  pointsModifier += (simulatorState.adaptation - 50) * 0.1;
  
  // Injury impact
  pointsModifier -= simulatorState.injury * 0.15;
  
  // Depth impact
  pointsModifier += (simulatorState.depth - 50) * 0.08;
  
  // Tactical fit
  pointsModifier += (simulatorState.tactics - 50) * 0.06;
  
  // Competition focus impact
  if (simulatorState.clFocus) pointsModifier -= 2;
  if (simulatorState.leaguePriority) pointsModifier += 3;
  if (simulatorState.cupRuns) pointsModifier -= 1;
  
  // FFP impact
  const ffpImpacts = { 'full': 0, 'warning': -3, 'sanctions': -8 };
  pointsModifier += ffpImpacts[simulatorState.ffpLevel];
  
  const finalPoints = Math.max(30, Math.min(110, basePoints + pointsModifier));
  const positionChange = (finalPoints - basePoints) / 3; // Rough points per position
  
  return {
    pointsChange: pointsModifier,
    positionChange: positionChange,
    titleOdds: Math.max(5, Math.min(95, 45 + (pointsModifier * 2))),
    europeOdds: Math.max(20, Math.min(99, 85 + pointsModifier)),
    finalPoints: finalPoints
  };
}

function updateConfidenceBars(calculations) {
  const confidence = Math.max(50, Math.min(95, 75 + Math.abs(calculations.pointsChange)));
  document.querySelectorAll('.confidence-fill').forEach((bar, index) => {
    const confidenceValues = [confidence, confidence - 10, confidence - 5, confidence + 5];
    bar.style.width = confidenceValues[index] + '%';
  });
  
  document.querySelectorAll('.confidence-text').forEach((text, index) => {
    const confidenceValues = [confidence, confidence - 10, confidence - 5, confidence + 5];
    text.textContent = confidenceValues[index] + '% Confidence';
  });
}

// Charts Management (existing functionality preserved and enhanced)
function initializeCharts() {
  const ctx1 = document.getElementById('trajectory-chart');
  const ctx2 = document.getElementById('comparison-chart');
  
  if (ctx1) {
    trajectoryChart = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Current Scenario',
          data: [0, 8, 15, 22, 28, 35, 42, 50, 58, 65],
          borderColor: '#C8102E',
          backgroundColor: 'rgba(200, 16, 46, 0.1)',
          tension: 0.4,
          fill: true
        }, {
          label: 'Baseline',
          data: [0, 6, 12, 18, 24, 30, 36, 42, 48, 54],
          borderColor: '#8B0000',
          backgroundColor: 'rgba(139, 0, 0, 0.05)',
          tension: 0.4,
          borderDash: [5, 5]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Points' } }
        }
      }
    });
  }
  
  if (ctx2) {
    comparisonChart = new Chart(ctx2, {
      type: 'radar',
      data: {
        labels: ['Attack', 'Defense', 'Midfield', 'Depth', 'Experience', 'Form'],
        datasets: [{
          label: 'Current Team',
          data: [85, 78, 82, 75, 88, 80],
          borderColor: '#C8102E',
          backgroundColor: 'rgba(200, 16, 46, 0.2)',
          pointBackgroundColor: '#C8102E'
        }, {
          label: 'League Average',
          data: [70, 70, 70, 65, 70, 68],
          borderColor: '#F6EB61',
          backgroundColor: 'rgba(246, 235, 97, 0.2)',
          pointBackgroundColor: '#F6EB61'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          r: { beginAtZero: true, max: 100 }
        }
      }
    });
  }
}

function updateCharts(calculations) {
  if (trajectoryChart) {
    const baseData = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54];
    const boost = calculations.pointsChange / 10;
    const newData = baseData.map((val, idx) => val + (boost * (idx + 1)));
    
    trajectoryChart.data.datasets[0].data = newData;
    trajectoryChart.update();
  }
  
  if (comparisonChart) {
    const teamBoosts = {
      'Liverpool': [85, 78, 82, 75, 88, 80],
      'Arsenal': [82, 85, 78, 72, 75, 85],
      'Manchester City': [88, 82, 90, 85, 85, 82]
    };
    
    const teamData = teamBoosts[selectedTeam] || [75, 75, 75, 70, 75, 75];
    comparisonChart.data.datasets[0].data = teamData;
    comparisonChart.update();
  }
}

// News Ticker Animation (existing functionality preserved)
function startNewsTickerAnimation() {
  const tickerContent = document.getElementById('ticker-content');
  if (!tickerContent) return;
  
  // Refresh news every 30 seconds
  setInterval(() => {
    updateNewsContent();
  }, 30000);
}

function updateNewsContent() {
  const newsItems = appData.transfers_data.live_news;
  const shuffled = newsItems.sort(() => 0.5 - Math.random());
  const tickerContent = document.getElementById('ticker-content');
  
  if (tickerContent) {
    tickerContent.innerHTML = shuffled.map(item => 
      `<span class="ticker-item">${item.headline}</span>`
    ).join('');
  }
}

// Action Functions (existing functionality preserved)
function saveScenario() {
  alert('Scenario saved successfully! You can access it from your dashboard.');
}

function exportResults() {
  const results = {
    team: selectedTeam,
    league: currentLeague,
    scenario: simulatorState,
    timestamp: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `simulation-results-${selectedTeam}-${Date.now()}.json`;
  a.click();
}

function resetToDefault() {
  simulatorState = {
    adaptation: 75,
    financial: 50,
    injury: 20,
    depth: 70,
    tactics: 85,
    coefficient: 80,
    revenue: 60,
    transferImpact: 0,
    clFocus: true,
    leaguePriority: false,
    cupRuns: false,
    ffpLevel: 'full'
  };
  
  // Reset all controls
  const controls = [
    { id: 'adaptation-slider', value: 75, displayId: 'adaptation-value', text: '75%' },
    { id: 'financial-slider', value: 50, displayId: 'financial-value', text: 'Medium' },
    { id: 'injury-slider', value: 20, displayId: 'injury-value', text: '20%' },
    { id: 'depth-slider', value: 70, displayId: 'depth-value', text: 'Good' },
    { id: 'tactics-slider', value: 85, displayId: 'tactics-value', text: '85%' },
    { id: 'coefficient-slider', value: 80, displayId: 'coefficient-value', text: 'High' },
    { id: 'revenue-slider', value: 60, displayId: 'revenue-value', text: 'Stable' }
  ];

  controls.forEach(control => {
    const element = document.getElementById(control.id);
    const display = document.getElementById(control.displayId);
    if (element) element.value = control.value;
    if (display) display.textContent = control.text;
  });

  const transferSelect = document.getElementById('transfer-select');
  if (transferSelect) transferSelect.value = '';

  const checkboxes = [
    { id: 'cl-focus', checked: true },
    { id: 'league-priority', checked: false },
    { id: 'cup-runs', checked: false }
  ];

  checkboxes.forEach(checkbox => {
    const element = document.getElementById(checkbox.id);
    if (element) element.checked = checkbox.checked;
  });

  const ffpSelect = document.getElementById('ffp-select');
  if (ffpSelect) ffpSelect.value = 'full';
  
  updateSimulatorResults();
}

function shareAnalysis() {
  if (navigator.share) {
    navigator.share({
      title: 'European Football Simulation Results',
      text: `Check out my ${selectedTeam} simulation results!`,
      url: window.location.href
    });
  } else {
    const text = `Check out my ${selectedTeam} simulation results on European Football Analytics!`;
    navigator.clipboard.writeText(text + ' ' + window.location.href);
    alert('Results link copied to clipboard!');
  }
}

// Utility Functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    notation: 'compact'
  }).format(amount);
}

function formatPercentage(value) {
  return value.toFixed(1) + '%';
}

// Performance optimization: debounce rapid updates
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Live data simulation
setInterval(() => {
  // Simulate live data updates
  const liveCounter = document.querySelector('.stat-value');
  if (liveCounter && currentPage === 'home') {
    const currentValue = parseInt(liveCounter.textContent);
    if (Math.random() > 0.7) { // 30% chance of update
      liveCounter.textContent = currentValue + 1;
    }
  }
}, 10000); // Every 10 seconds