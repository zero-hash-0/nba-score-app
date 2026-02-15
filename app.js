let currentSport = "nba";

function setSport(sport) {
  currentSport = sport;

  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.classList.remove("active");
  });

  event.target.classList.add("active");

  fetchScores();
}

async function fetchScores() {
  const container = document.getElementById("scores");
  container.innerHTML = "Loading...";

  const url = `https://site.api.espn.com/apis/v2/sports/${currentSport}/scoreboard`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.events || data.events.length === 0) {
      container.innerHTML = "No games today.";
      return;
    }

    container.innerHTML = "";

    data.events.forEach(game => {
      const home = game.competitions[0].competitors.find(t => t.homeAway === "home");
      const away = game.competitions[0].competitors.find(t => t.homeAway === "away");

      const status = game.status.type.description;
      const isLive = game.status.type.state === "in";

      const card = document.createElement("div");
      card.className = "match-card";

      card.innerHTML = `
        <div class="teams">
          <div class="team">
            <img src="${away.team.logo}" />
            <span>${away.team.abbreviation}</span>
          </div>

          <div class="score">
            ${away.score} - ${home.score}
          </div>

          <div class="team" style="justify-content:flex-end;">
            <span>${home.team.abbreviation}</span>
            <img src="${home.team.logo}" />
          </div>
        </div>

        <div class="status ${isLive ? "live" : ""}">
          ${status}
        </div>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    container.innerHTML = "Error loading games.";
  }
}

fetchScores();
setInterval(fetchScores, 60000);
