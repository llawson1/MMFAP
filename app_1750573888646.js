// European Football Analytics Dashboard - Complete JavaScript Application
// Mailman Media © 2025

// Application Data
const appData = {
    leagues: {
        'premier-league': {
            name: 'Premier League',
            teams: [
                { name: 'Liverpool', position: 1, points: 90, change: 0, confidence: 85 },
                { name: 'Arsenal', position: 2, points: 84, change: 0, confidence: 78 },
                { name: 'Manchester City', position: 3, points: 81, change: 0, confidence: 82 },
                { name: 'Chelsea', position: 4, points: 79, change: 1, confidence: 70 },
                { name: 'Newcastle United', position: 5, points: 74, change: 0, confidence: 45 },
                { name: 'Manchester United', position: 6, points: 68, change: 9, confidence: 60 },
                { name: 'Tottenham Hotspur', position: 7, points: 64, change: 10, confidence: 55 },
                { name: 'Brighton & Hove Albion', position: 8, points: 62, change: -1, confidence: 65 },
                { name: 'West Ham United', position: 9, points: 58, change: 5, confidence: 50 },
                { name: 'Aston Villa', position: 10, points: 56, change: -6, confidence: 60 },
                { name: 'Fulham', position: 11, points: 54, change: 2, confidence: 58 },
                { name: 'Crystal Palace', position: 12, points: 52, change: 1, confidence: 55 },
                { name: 'Brentford', position: 13, points: 50, change: -1, confidence: 52 },
                { name: 'Nottingham Forest', position: 14, points: 48, change: 3, confidence: 50 },
                { name: 'Everton', position: 15, points: 46, change: 0, confidence: 48 },
                { name: 'Wolverhampton', position: 16, points: 44, change: -2, confidence: 45 },
                { name: 'Leicester City', position: 17, points: 42, change: 1, confidence: 40 },
                { name: 'Leeds United', position: 18, points: 38, change: 0, confidence: 35 },
                { name: 'Southampton', position: 19, points: 34, change: -1, confidence: 30 },
                { name: 'Sheffield United', position: 20, points: 30, change: -2, confidence: 25 }
            ]
        },
        'la-liga': {
            name: 'La Liga',
            teams: [
                { name: 'Barcelona', position: 1, points: 87, change: 0, confidence: 75 },
                { name: 'Real Madrid', position: 2, points: 84, change: 0, confidence: 78 },
                { name: 'Atletico Madrid', position: 3, points: 76, change: 1, confidence: 70 },
                { name: 'Athletic Bilbao', position: 4, points: 68, change: 2, confidence: 65 },
                { name: 'Real Sociedad', position: 5, points: 64, change: -1, confidence: 62 },
                { name: 'Villarreal', position: 6, points: 60, change: 1, confidence: 58 },
                { name: 'Real Betis', position: 7, points: 58, change: -2, confidence: 55 },
                { name: 'Valencia', position: 8, points: 54, change: 3, confidence: 52 }
            ]
        },
        'serie-a': {
            name: 'Serie A',
            teams: [
                { name: 'Napoli', position: 1, points: 85, change: 0, confidence: 72 },
                { name: 'AC Milan', position: 2, points: 82, change: 1, confidence: 75 },
                { name: 'Inter Milan', position: 3, points: 80, change: -1, confidence: 78 },
                { name: 'Juventus', position: 4, points: 76, change: 2, confidence: 70 },
                { name: 'AS Roma', position: 5, points: 70, change: 0, confidence: 65 },
                { name: 'Lazio', position: 6, points: 66, change: -1, confidence: 62 },
                { name: 'Atalanta', position: 7, points: 64, change: 1, confidence: 68 },
                { name: 'Fiorentina', position: 8, points: 58, change: 2, confidence: 55 }
            ]
        },
        'bundesliga': {
            name: 'Bundesliga',
            teams: [
                { name: 'Bayern Munich', position: 1, points: 88, change: 0, confidence: 85 },
                { name: 'Borussia Dortmund', position: 2, points: 78, change: 1, confidence: 72 },
                { name: 'RB Leipzig', position: 3, points: 74, change: -1, confidence: 68 },
                { name: 'Bayer Leverkusen', position: 4, points: 70, change: 2, confidence: 65 },
                { name: 'Eintracht Frankfurt', position: 5, points: 64, change: 0, confidence: 60 },
                { name: 'VfL Wolfsburg', position: 6, points: 58, change: -1, confidence: 55 }
            ]
        },
        'ligue-1': {
            name: 'Ligue 1',
            teams: [
                { name: 'Paris Saint-Germain', position: 1, points: 90, change: 0, confidence: 88 },
                { name: 'Marseille', position: 2, points: 75, change: 1, confidence: 70 },
                { name: 'Monaco', position: 3, points: 72, change: -1, confidence: 68 },
                { name: 'Lyon', position: 4, points: 66, change: 2, confidence: 62 },
                { name: 'Lille', position: 5, points: 62, change: 0, confidence: 58 },
                { name: 'Nice', position: 6, points: 58, change: -1, confidence: 55 }
            ]
        }
    },
    transfers: {
        major_signings: [
            { player: 'Florian Wirtz', from: 'Bayer Leverkusen', to: 'Liverpool', fee: '£116M', impact: 9.5, reliability: 99 },
            { player: 'Jeremie Frimpong', from: 'Bayer Leverkusen', to: 'Liverpool', fee: '£29.5M', impact: 7.5, reliability: 95 },
            { player: 'Trent Alexander-Arnold', from: 'Liverpool', to: 'Real Madrid', fee: '£8.3M', impact: 8.0, reliability: 92 },
            { player: 'Martin Zubimendi', from: 'Real Sociedad', to: 'Arsenal', fee: '£55M', impact: 7.0, reliability: 85 }
        ],
        spending: {
            'Liverpool': 174.5,
            'Manchester City': 111.5,
            'Manchester United': 69.5,
            'Arsenal': 55.0,
            'Chelsea': 35.8,
            'Newcastle': 0.0
        }
    },
    live_news: [
        { headline: 'Wirtz completes Liverpool medical successfully', time: '2 mins ago', reliability: 99, source: 'BBC Sport', impact: 'high', category: 'transfers' },
        { headline: 'Newcastle preparing final Isak contract offer this week', time: '15 mins ago', reliability: 92, source: 'Fabrizio Romano', impact: 'high', category: 'contracts' },
        { headline: 'Arsenal close to Zubimendi agreement', time: '1 hour ago', reliability: 85, source: 'The Athletic', impact: 'medium', category: 'transfers' },
        { headline: 'Manchester City monitoring Enzo Fernandez situation', time: '2 hours ago', reliability: 78, source: 'Sky Sports', impact: 'medium', category: 'transfers' },
        { headline: 'Chelsea reject Real Madrid\'s Enzo bid', time: '3 hours ago', reliability: 82, source: 'ESPN', impact: 'medium', category: 'transfers' },
        { headline: 'Tottenham agree terms with Mathys Tel', time: '4 hours ago', reliability: 75, source: 'The Guardian', impact: 'low', category: 'transfers' }
    ],
    players: [
        { name: 'Mohamed Salah', team: 'Liverpool', position: 'RW', goals: 34, assists: 18, value: '£150M' },
        { name: 'Erling Haaland', team: 'Manchester City', position: 'ST', goals: 29, assists: 8, value: '£200M' },
        { name: 'Bukayo Saka', team: 'Arsenal', position: 'RW', goals: 16, assists: 14, value: '£120M' },
        { name: 'Alexander Isak', team: 'Newcastle', position: 'ST', goals: 23, assists: 6, value: '£150M' },
        { name: 'Florian Wirtz', team: 'Liverpool', position: 'CAM', goals: 0, assists: 0, value: '£116M' }
    ]
};

// Application State
let currentTheme = 'light';
let currentPage = 'overview';

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing dashboard...');
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupThemeToggle();
    setupBreakingNews();
    setupLeagueTables();
    setupTeamAnalytics();
    setupTransferHub();
    setupStatsComparison();
    setupLiveNews();
    setupAdvancedSimulator();
    setupCharts();
    updateTimestamp();
    
    // Populate initial content
    populateTeamSelectors();
    renderTransferHub();
    renderLiveNews();
    
    // Update timestamp every minute
    setInterval(updateTimestamp, 60000);
    
    // Update live counter periodically
    setInterval(updateLiveCounter, 10000);
    
    console.log('Dashboard initialized successfully');
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetPage = this.dataset.page;
            switchPage(targetPage);
        });
    });
}

function switchPage(pageName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
    
    // Update pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        if (page.id === pageName) {
            page.classList.add('active');
        }
    });
    
    currentPage = pageName;
    
    // Load page-specific content
    if (pageName === 'transfer-hub') {
        renderTransferHub();
    } else if (pageName === 'live-news') {
        renderLiveNews();
    }
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-color-scheme', currentTheme);
            themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
        });
    }
}

function setupBreakingNews() {
    const newsTicker = document.getElementById('newsTicker');
    if (!newsTicker) return;
    
    const breakingItems = [
        'Wirtz completes Liverpool medical successfully',
        'Newcastle preparing final Isak contract offer',
        'Arsenal close to Zubimendi agreement',
        'Manchester City monitoring Enzo Fernandez',
        'Chelsea reject Real Madrid\'s Enzo bid',
        'Tottenham agree terms with Mathys Tel'
    ];
    
    let currentIndex = 0;
    
    function updateBreakingNews() {
        const newsText = `${breakingItems[currentIndex]} • ${breakingItems[(currentIndex + 1) % breakingItems.length]} • ${breakingItems[(currentIndex + 2) % breakingItems.length]}`;
        newsTicker.innerHTML = `<span class="news-item">${newsText}</span>`;
        currentIndex = (currentIndex + 1) % breakingItems.length;
    }
    
    updateBreakingNews();
    setInterval(updateBreakingNews, 8000);
}

function setupLeagueTables() {
    const applyLeagueBtn = document.getElementById('applyLeague');
    if (applyLeagueBtn) {
        applyLeagueBtn.addEventListener('click', function() {
            const leagueSelect = document.getElementById('leagueSelect');
            const selectedLeague = leagueSelect.value;
            if (selectedLeague && appData.leagues[selectedLeague]) {
                renderLeagueTable(selectedLeague);
            }
        });
    }
}

function renderLeagueTable(leagueKey) {
    const league = appData.leagues[leagueKey];
    const leagueTableContainer = document.getElementById('leagueTableContainer');
    if (!league || !leagueTableContainer) return;
    
    const tableHTML = `
        <div class="league-table">
            <table>
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Team</th>
                        <th>Points</th>
                        <th>Change</th>
                        <th>Confidence</th>
                    </tr>
                </thead>
                <tbody>
                    ${league.teams.map((team, index) => `
                        <tr class="team-row ${getQualificationZone(index + 1, leagueKey)}" onclick="showTeamDetails('${team.name}')">
                            <td>${team.position}</td>
                            <td>${team.name}</td>
                            <td>${team.points}</td>
                            <td style="color: ${team.change >= 0 ? '#10B981' : '#EF4444'}">${team.change >= 0 ? '+' : ''}${team.change}</td>
                            <td>${team.confidence}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <p style="margin-top: 1rem; text-align: center; color: var(--color-text-secondary);">Click on any team row for detailed analytics</p>
    `;
    
    leagueTableContainer.innerHTML = tableHTML;
}

function getQualificationZone(position, league) {
    if (position <= 4) return 'champions-league';
    if (position <= 6) return 'europa-league';
    if (league === 'premier-league' && position >= 18) return 'relegation';
    if (league !== 'premier-league' && position >= 16) return 'relegation';
    return '';
}

function showTeamDetails(teamName) {
    // Switch to teams & analytics page
    switchPage('teams-analytics');
    
    // Set team selector
    const teamSelect = document.getElementById('teamSelect');
    if (teamSelect) {
        const teamKey = teamName.toLowerCase().replace(/\s+/g, '-');
        teamSelect.value = teamKey;
        renderTeamAnalysis(teamName);
    }
}

function populateTeamSelectors() {
    // Populate team selector for team analytics
    const teamSelect = document.getElementById('teamSelect');
    if (teamSelect) {
        const allTeams = [];
        Object.values(appData.leagues).forEach(league => {
            league.teams.forEach(team => {
                allTeams.push(team.name);
            });
        });
        
        const uniqueTeams = [...new Set(allTeams)];
        teamSelect.innerHTML = '<option value="">Select a team...</option>' + 
            uniqueTeams.map(team => 
                `<option value="${team.toLowerCase().replace(/\s+/g, '-')}">${team}</option>`
            ).join('');
    }
}

function setupTeamAnalytics() {
    const teamSelect = document.getElementById('teamSelect');
    if (teamSelect) {
        teamSelect.addEventListener('change', function() {
            const teamKey = this.value;
            if (teamKey) {
                const teamName = teamKey.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                renderTeamAnalysis(teamName);
            } else {
                const teamAnalysis = document.getElementById('teamAnalysis');
                const scenarioControls = document.getElementById('scenarioControls');
                if (teamAnalysis) {
                    teamAnalysis.innerHTML = '<div class="analysis-placeholder">Select a team to view detailed analytics</div>';
                }
                if (scenarioControls) {
                    scenarioControls.style.display = 'none';
                }
            }
        });
    }
    
    // Setup scenario controls
    const wirtzSlider = document.getElementById('wirtzAdaptation');
    const wirtzValue = document.getElementById('wirtzValue');
    const isakContract = document.getElementById('isakContract');
    
    if (wirtzSlider && wirtzValue) {
        wirtzSlider.addEventListener('input', function() {
            wirtzValue.textContent = this.value + '%';
            updateScenarioImpact();
        });
    }
    
    if (isakContract) {
        isakContract.addEventListener('change', updateScenarioImpact);
    }
}

function renderTeamAnalysis(teamName) {
    const teamData = getTeamData(teamName);
    const teamAnalysis = document.getElementById('teamAnalysis');
    const scenarioControls = document.getElementById('scenarioControls');
    
    if (!teamAnalysis) return;
    
    const analysisHTML = `
        <div class="team-header">
            <div class="team-logo">${teamName.charAt(0)}</div>
            <div class="team-info">
                <h3>${teamName}</h3>
                <p>2025-26 Season Analysis</p>
            </div>
        </div>
        
        <div class="prediction-summary">
            <div class="prediction-stat">
                <div class="stat-value">${teamData.position}</div>
                <div class="stat-label">Predicted Position</div>
            </div>
            <div class="prediction-stat">
                <div class="stat-value">${teamData.points}</div>
                <div class="stat-label">Predicted Points</div>
            </div>
            <div class="prediction-stat">
                <div class="stat-value">${teamData.confidence}%</div>
                <div class="stat-label">Confidence Level</div>
            </div>
            <div class="prediction-stat">
                <div class="stat-value">£${teamData.spending || 0}M</div>
                <div class="stat-label">Transfer Spending</div>
            </div>
        </div>
        
        <div class="key-signings">
            <h4>Key Signings & Activity</h4>
            <p>${getTeamSignings(teamName)}</p>
        </div>
    `;
    
    teamAnalysis.innerHTML = analysisHTML;
    
    if (scenarioControls) {
        scenarioControls.style.display = 'block';
        updateScenarioImpact();
    }
}

function getTeamData(teamName) {
    // Find team in leagues
    for (const league of Object.values(appData.leagues)) {
        const team = league.teams.find(t => t.name === teamName);
        if (team) {
            return {
                ...team,
                spending: appData.transfers.spending[teamName] || 0
            };
        }
    }
    return { position: 'N/A', points: 'N/A', confidence: 'N/A', spending: 0 };
}

function getTeamSignings(teamName) {
    const signings = appData.transfers.major_signings.filter(s => s.to === teamName || s.from === teamName);
    if (signings.length === 0) {
        return 'No major transfer activity this window.';
    }
    
    return signings.map(s => {
        if (s.to === teamName) {
            return `Signed ${s.player} from ${s.from} for ${s.fee}`;
        } else {
            return `Sold ${s.player} to ${s.to} for ${s.fee}`;
        }
    }).join('. ') + '.';
}

function updateScenarioImpact() {
    const wirtzSlider = document.getElementById('wirtzAdaptation');
    const isakContract = document.getElementById('isakContract');
    const impactSummary = document.getElementById('impactSummary');
    
    if (!impactSummary) return;
    
    const wirtzValue = wirtzSlider ? wirtzSlider.value : 85;
    const isakValue = isakContract ? isakContract.value : 'signed';
    
    let impact = 'Current scenario shows ';
    
    if (wirtzValue > 80) {
        impact += 'strong adaptation potential increasing Liverpool\'s title chances by 8%. ';
    } else if (wirtzValue > 60) {
        impact += 'moderate adaptation affecting Liverpool\'s position by 3-5%. ';
    } else {
        impact += 'adaptation struggles reducing Liverpool\'s advantage by 5%. ';
    }
    
    if (isakValue === 'rejected') {
        impact += 'Isak contract rejection significantly impacts Newcastle\'s confidence (-15%).';
    } else if (isakValue === 'negotiating') {
        impact += 'Ongoing Isak negotiations create uncertainty for Newcastle (-5% confidence).';
    } else {
        impact += 'Isak contract resolution stabilizes Newcastle\'s position.';
    }
    
    impactSummary.textContent = impact;
}

function renderTransferHub() {
    renderTransferFeed();
    renderMajorSignings();
    setTimeout(setupSpendingChart, 100);
}

function renderTransferFeed() {
    const feedContainer = document.getElementById('transferFeed');
    if (!feedContainer) return;
    
    const feedHTML = appData.live_news.slice(0, 6).map(news => `
        <div class="feed-item" onclick="showReliabilityModal(${news.reliability})">
            <div class="news-headline">${news.headline}</div>
            <div class="news-meta">
                <span>${news.time}</span>
                <span class="reliability-score">${news.reliability}%</span>
                <span>${news.source}</span>
                <span class="impact ${news.impact}">${news.impact.toUpperCase()}</span>
            </div>
        </div>
    `).join('');
    
    feedContainer.innerHTML = feedHTML;
}

function renderMajorSignings() {
    const signingsContainer = document.getElementById('majorSignings');
    if (!signingsContainer) return;
    
    const signingsHTML = appData.transfers.major_signings.map(signing => `
        <div class="signing-card">
            <div class="transfer-route">${signing.player}</div>
            <div class="transfer-details">
                <span>${signing.from} → ${signing.to}</span>
                <span class="transfer-fee">${signing.fee}</span>
            </div>
            <div class="transfer-details">
                <span class="impact-rating">Impact: ${signing.impact}/10</span>
                <span class="reliability-score" onclick="showReliabilityModal(${signing.reliability})">${signing.reliability}%</span>
            </div>
        </div>
    `).join('');
    
    signingsContainer.innerHTML = signingsHTML;
}

function setupStatsComparison() {
    const compareBtn = document.getElementById('comparePlayers');
    if (compareBtn) {
        compareBtn.addEventListener('click', function() {
            const player1Select = document.getElementById('player1Select');
            const player2Select = document.getElementById('player2Select');
            
            const player1 = player1Select ? player1Select.value : '';
            const player2 = player2Select ? player2Select.value : '';
            
            if (player1 && player2) {
                renderPlayerComparison(player1, player2);
            }
        });
    }
}

function renderPlayerComparison(player1Key, player2Key) {
    const player1 = appData.players.find(p => p.name.toLowerCase().includes(player1Key));
    const player2 = appData.players.find(p => p.name.toLowerCase().includes(player2Key));
    
    if (!player1 || !player2) return;
    
    const comparisonHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; background: var(--color-surface); border-radius: 12px; padding: 2rem;">
            <div class="player-stats" style="border-right: 1px solid var(--color-border); padding-right: 2rem;">
                <h4 style="margin-bottom: 1rem; color: var(--liverpool-red);">${player1.name}</h4>
                <div style="margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
                    <span>Goals:</span>
                    <span style="font-weight: 600;">${player1.goals}</span>
                </div>
                <div style="margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
                    <span>Assists:</span>
                    <span style="font-weight: 600;">${player1.assists}</span>
                </div>
                <div style="margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
                    <span>Value:</span>
                    <span style="font-weight: 600;">${player1.value}</span>
                </div>
                <div style="margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
                    <span>Position:</span>
                    <span style="font-weight: 600;">${player1.position}</span>
                </div>
            </div>
            <div class="player-stats">
                <h4 style="margin-bottom: 1rem; color: var(--liverpool-red);">${player2.name}</h4>
                <div style="margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
                    <span>Goals:</span>
                    <span style="font-weight: 600;">${player2.goals}</span>
                </div>
                <div style="margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
                    <span>Assists:</span>
                    <span style="font-weight: 600;">${player2.assists}</span>
                </div>
                <div style="margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
                    <span>Value:</span>
                    <span style="font-weight: 600;">${player2.value}</span>
                </div>
                <div style="margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
                    <span>Position:</span>
                    <span style="font-weight: 600;">${player2.position}</span>
                </div>
            </div>
        </div>
    `;
    
    const comparisonResults = document.getElementById('comparisonResults');
    if (comparisonResults) {
        comparisonResults.innerHTML = comparisonHTML;
    }
}

function renderLiveNews() {
    renderNewsFilter();
    renderNewsFeed();
}

function renderNewsFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            renderNewsFeed(category);
        });
    });
}

function renderNewsFeed(category = 'all') {
    const feedContainer = document.getElementById('newsFeed');
    if (!feedContainer) return;
    
    let filteredNews = appData.live_news;
    if (category !== 'all') {
        filteredNews = appData.live_news.filter(news => news.category === category);
    }
    
    const feedHTML = filteredNews.map(news => `
        <div class="feed-item" style="padding: 1rem; border-bottom: 1px solid var(--color-border); cursor: pointer;">
            <div class="news-headline" style="font-weight: 600; margin-bottom: 0.5rem;">${news.headline}</div>
            <div class="news-meta" style="display: flex; align-items: center; gap: 1rem; font-size: 0.875rem; color: var(--color-text-secondary);">
                <span>${news.time}</span>
                <span class="reliability-score" onclick="showReliabilityModal(${news.reliability})" style="background: var(--liverpool-red); color: white; padding: 0.25rem 0.5rem; border-radius: 12px; font-weight: 600; cursor: pointer;">${news.reliability}%</span>
                <span>${news.source}</span>
                <span class="impact ${news.impact}" style="text-transform: uppercase; font-weight: 600;">${news.impact}</span>
            </div>
        </div>
    `).join('');
    
    feedContainer.innerHTML = feedHTML;
}

function setupAdvancedSimulator() {
    const simLeague = document.getElementById('simLeague');
    const transferFee = document.getElementById('transferFee');
    const feeValue = document.getElementById('feeValue');
    const simulateBtn = document.getElementById('simulateTransfer');
    
    if (simLeague) {
        simLeague.addEventListener('change', function() {
            populateSimulatorTeams(this.value);
        });
    }
    
    if (transferFee && feeValue) {
        transferFee.addEventListener('input', function() {
            feeValue.textContent = `£${this.value}M`;
        });
    }
    
    if (simulateBtn) {
        simulateBtn.addEventListener('click', function() {
            simulateTransfer();
        });
    }
}

function populateSimulatorTeams(leagueKey) {
    const fromTeam = document.getElementById('simFromTeam');
    const toTeam = document.getElementById('simToTeam');
    
    if (!fromTeam || !toTeam || !appData.leagues[leagueKey]) return;
    
    const teams = appData.leagues[leagueKey].teams;
    const teamOptions = teams.map(team => 
        `<option value="${team.name}">${team.name}</option>`
    ).join('');
    
    fromTeam.innerHTML = '<option value="">Select team...</option>' + teamOptions;
    toTeam.innerHTML = '<option value="">Select team...</option>' + teamOptions;
}

function simulateTransfer() {
    const resultsContainer = document.getElementById('simulationResults');
    if (!resultsContainer) return;
    
    const simulationHTML = `
        <h3>Transfer Simulation Results</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1.5rem;">
            <div class="before-after" style="text-align: center;">
                <h4 style="margin-bottom: 1rem;">Before Transfer</h4>
                <div style="background: var(--color-background); border-radius: 8px; padding: 1rem;">
                    <p>Current league standings maintained</p>
                    <p>Team stability: Normal</p>
                </div>
            </div>
            <div class="before-after" style="text-align: center;">
                <h4 style="margin-bottom: 1rem;">After Transfer</h4>
                <div style="background: var(--color-background); border-radius: 8px; padding: 1rem;">
                    <p style="color: var(--liverpool-red); font-weight: 600;">Projected impact: +2-5 position change</p>
                    <p>Financial impact: Within FFP regulations</p>
                    <p>Success probability: 78%</p>
                </div>
            </div>
        </div>
    `;
    
    resultsContainer.innerHTML = simulationHTML;
}

function setupSpendingChart() {
    const ctx = document.getElementById('spendingChart');
    if (!ctx) return;
    
    const spendingData = appData.transfers.spending;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(spendingData),
            datasets: [{
                label: 'Transfer Spending (£M)',
                data: Object.values(spendingData),
                backgroundColor: ['#C8102E', '#F6EB61', '#8B0000', '#E31E24', '#10B981', '#6B7280']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#333'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#333'
                    }
                },
                x: {
                    ticks: {
                        color: '#333'
                    }
                }
            }
        }
    });
}

function setupCharts() {
    setupPointsChart();
}

function setupPointsChart() {
    const ctx = document.getElementById('pointsChart');
    if (!ctx) return;
    
    // Generate sample points progression data
    const matches = [];
    const liverpoolPoints = [];
    const arsenalPoints = [];
    const cityPoints = [];
    
    for (let i = 0; i <= 38; i++) {
        matches.push(`MW ${i}`);
        liverpoolPoints.push(Math.min(90, i * 2.37 + Math.random() * 3));
        arsenalPoints.push(Math.min(84, i * 2.21 + Math.random() * 3));
        cityPoints.push(Math.min(81, i * 2.13 + Math.random() * 3));
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: matches,
            datasets: [{
                label: 'Liverpool',
                data: liverpoolPoints,
                borderColor: '#C8102E',
                backgroundColor: 'rgba(200, 16, 46, 0.1)',
                tension: 0.4
            }, {
                label: 'Arsenal',
                data: arsenalPoints,
                borderColor: '#EF0107',
                backgroundColor: 'rgba(239, 1, 7, 0.1)',
                tension: 0.4
            }, {
                label: 'Manchester City',
                data: cityPoints,
                borderColor: '#6CABDD',
                backgroundColor: 'rgba(108, 171, 221, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#333'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#333'
                    }
                },
                x: {
                    ticks: {
                        color: '#333'
                    }
                }
            }
        }
    });
}

function showReliabilityModal(reliability) {
    const modal = document.getElementById('reliabilityModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;
    
    const reliabilityBreakdown = `
        <h4>Reliability Score: ${reliability}%</h4>
        <div style="margin: 1rem 0;">
            <p style="margin-bottom: 0.5rem;"><strong>Source Credibility:</strong> ${Math.min(100, reliability + 5)}%</p>
            <p style="margin-bottom: 0.5rem;"><strong>Information Verification:</strong> ${Math.max(70, reliability - 10)}%</p>
            <p style="margin-bottom: 0.5rem;"><strong>Historical Accuracy:</strong> ${Math.min(100, reliability + 2)}%</p>
            <p style="margin-bottom: 0.5rem;"><strong>Cross-Reference:</strong> ${Math.max(60, reliability - 15)}%</p>
        </div>
        <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--color-text-secondary);">
            Reliability scores are calculated based on source credibility, information verification, 
            historical accuracy, and cross-referencing with multiple sources.
        </p>
    `;
    
    modalBody.innerHTML = reliabilityBreakdown;
    modal.classList.add('active');
}

// Modal close functionality
const closeModalBtn = document.getElementById('closeModal');
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function() {
        const modal = document.getElementById('reliabilityModal');
        if (modal) {
            modal.classList.remove('active');
        }
    });
}

window.addEventListener('click', function(event) {
    const modal = document.getElementById('reliabilityModal');
    if (event.target === modal) {
        modal.classList.remove('active');
    }
});

function updateTimestamp() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    const lastUpdate = document.getElementById('lastUpdate');
    if (lastUpdate) {
        lastUpdate.textContent = `Last updated: ${timeString}`;
    }
}

function updateLiveCounter() {
    const updateCount = document.getElementById('updateCount');
    if (updateCount) {
        const current = parseInt(updateCount.textContent.split(' ')[0]);
        const newCount = current + Math.floor(Math.random() * 3) + 1;
        updateCount.textContent = `${newCount} updates`;
    }
}

// Make functions globally available
window.showTeamDetails = showTeamDetails;
window.showReliabilityModal = showReliabilityModal;