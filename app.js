const scoresContainer = document.getElementById("scores");

function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(tab).classList.add("active");
}

function getTodayDate() {
  const today = new Date();
  return today.toISOString().split("T")[0].replace(/-/g, "");
}

async function loadScores() {
  const today = getTodayDate();
  scoresContainer.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(`https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_${today}.json`);
    const data = await res.json();

    scoresContainer.innerHTML = "";

    const games = data.scoreboard.games;

    if (!games || games.length === 0) {
      scoresContainer.innerHTML = "<p>No games today.</p>";
      return;
    }

    games.forEach(game => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <strong>${game.homeTeam.teamName}</strong> ${game.homeTeam.score}
        <br/>
        <strong>${game.awayTeam.teamName}</strong> ${game.awayTeam.score}
        <br/>
        Status: ${game.gameStatusText}
      `;

      scoresContainer.appendChild(card);
    });

  } catch (error) {
    scoresContainer.innerHTML = "<p>Error loading scores.</p>";
    console.error(error);
  }
}

loadScores();
setInterval(loadScores, 60000);
