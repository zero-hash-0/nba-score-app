const scoresContainer = document.getElementById("scores");
const standingsContainer = document.getElementById("standings");

function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(tab).classList.add("active");
}

async function loadScores() {
  const res = await fetch("https://www.balldontlie.io/api/v1/games?dates[]=2026-02-14");
  const data = await res.json();

  scoresContainer.innerHTML = "";

  if (data.data.length === 0) {
    scoresContainer.innerHTML = "<p>No games today.</p>";
    return;
  }

  data.data.forEach(game => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <strong>${game.home_team.full_name}</strong> ${game.home_team_score}
      <br/>
      <strong>${game.visitor_team.full_name}</strong> ${game.visitor_team_score}
      <br/>
      Status: ${game.status}
    `;
    scoresContainer.appendChild(card);
  });
}

loadScores();
setInterval(loadScores, 60000);