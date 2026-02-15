const scoresContainer = document.getElementById("scores");
let currentSport = "nba";

function setSport(sport) {
  currentSport = sport;
  loadScores();
}

function getTodayDate() {
  const today = new Date();
  return today.toISOString().split("T")[0].replace(/-/g, "");
}

async function loadScores() {
  scoresContainer.innerHTML = "<p>Loading...</p>";

  try {
    if (currentSport === "nba") {
      await loadNBA();
    } else if (currentSport === "nhl") {
      await loadNHL();
    }
  } catch (error) {
    scoresContainer.innerHTML = "<p>Error loading scores.</p>";
    console.error(error);
  }
}

async function loadNBA() {
  const today = getTodayDate();
  const res = await fetch(`https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_${today}.json`);
  const data = await res.json();

  renderGames(data.scoreboard.games, "nba");
}

async function loadNHL() {
  const res = await fetch("https://api-web.nhle.com/v1/scoreboard/now");
  const data = await res.json();

  renderGames(data.games, "nhl");
}

function renderGames(games, sport) {
  scoresContainer.innerHTML = "";

  if (!games || games.length === 0) {
    scoresContainer.innerHTML = "<p>No games today.</p>";
    return;
  }

  games.forEach(game => {
    const card = document.createElement("div");
    card.className = "card";

    if (sport === "nba") {
      card.innerHTML = `
        <strong>${game.homeTeam.teamName}</strong> ${game.homeTeam.score}
        <br/>
        <strong>${game.awayTeam.teamName}</strong> ${game.awayTeam.score}
        <br/>
        ${game.gameStatusText}
      `;
    }

    if (sport === "nhl") {
      card.innerHTML = `
        <strong>${game.homeTeam.name.default}</strong> ${game.homeTeam.score}
        <br/>
        <strong>${game.awayTeam.name.default}</strong> ${game.awayTeam.score}
        <br/>
        ${game.gameState}
      `;
    }

    scoresContainer.appendChild(card);
  });
}

loadScores();
setInterval(loadScores, 60000);
