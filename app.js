const scoresContainer = document.getElementById("scores");
let currentSport = "nba";

function setSport(sport) {
  currentSport = sport;
  loadScores();
}

async function loadScores() {
  scoresContainer.innerHTML = "<p>Loading...</p>";

  try {
    if (currentSport === "nba") {
      await loadESPN("basketball/nba");
    } else if (currentSport === "nhl") {
      await loadESPN("hockey/nhl");
    }
  } catch (error) {
    scoresContainer.innerHTML = "<p>Error loading scores.</p>";
    console.error(error);
  }
}

async function loadESPN(path) {
  const res = await fetch(`https://site.api.espn.com/apis/v2/sports/${path}/scoreboard`);
  const data = await res.json();

  const games = data.events;
  scoresContainer.innerHTML = "";

  if (!games || games.length === 0) {
    scoresContainer.innerHTML = "<p>No games today.</p>";
    return;
  }

  games.forEach(game => {
    const home = game.competitions[0].competitors.find(c => c.homeAway === "home");
    const away = game.competitions[0].competitors.find(c => c.homeAway === "away");

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <strong>${home.team.displayName}</strong> ${home.score}
      <br/>
      <strong>${away.team.displayName}</strong> ${away.score}
      <br/>
      ${game.status.type.description}
    `;

    scoresContainer.appendChild(card);
  });
}

loadScores();
setInterval(loadScores, 60000);
