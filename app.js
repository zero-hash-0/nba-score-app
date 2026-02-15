let currentSport = "basketball/nba";

function showScores() {
  document.getElementById("scores").style.display = "block";
  document.getElementById("news").style.display = "none";
  document.getElementById("scoresTab").classList.add("active");
  document.getElementById("newsTab").classList.remove("active");
  fetchScores();
}

function showNews() {
  document.getElementById("scores").style.display = "none";
  document.getElementById("news").style.display = "block";
  document.getElementById("scoresTab").classList.remove("active");
  document.getElementById("newsTab").classList.add("active");
  fetchNews();
}

function setSport(sport) {
  currentSport = sport;
  fetchScores();
}

async function fetchScores() {
  const container = document.getElementById("scores");
  container.innerHTML = "Loading...";

  try {
    const res = await fetch(`https://site.api.espn.com/apis/v2/sports/${currentSport}/scoreboard`);
    const data = await res.json();

    if (!data.events || data.events.length === 0) {
      container.innerHTML = "No games today.";
      return;
    }

    container.innerHTML = "";

    data.events.forEach(game => {
      const comp = game.competitions[0];
      const home = comp.competitors.find(t => t.homeAway === "home");
      const away = comp.competitors.find(t => t.homeAway === "away");

      const card = document.createElement("div");
      card.className = "match-card";

      card.innerHTML = `
        <div class="teams">
          <div class="team">
            <img src="${away.team.logo}">
            <span>${away.team.abbreviation}</span>
          </div>

          <div class="score">
            ${away.score} - ${home.score}
          </div>

          <div class="team" style="justify-content:flex-end;">
            <span>${home.team.abbreviation}</span>
            <img src="${home.team.logo}">
          </div>
        </div>

        <div class="status ${game.status.type.state === "in" ? "live" : ""}">
          ${game.status.type.description}
        </div>
      `;

      container.appendChild(card);
    });

  } catch {
    container.innerHTML = "Error loading games.";
  }
}

async function fetchNews() {
  const container = document.getElementById("news");
  container.innerHTML = "Loading news...";

  try {
    const res = await fetch(`https://site.api.espn.com/apis/v2/sports/${currentSport}/news`);
    const data = await res.json();

    container.innerHTML = "";

    data.articles.slice(0, 10).forEach(article => {
      const card = document.createElement("div");
      card.className = "news-card";
      card.onclick = () => window.open(article.links.web.href, "_blank");

      card.innerHTML = `
        <img src="${article.images?.[0]?.url || ''}">
        <div>
          <div class="news-title">${article.headline}</div>
          <div class="news-source">${article.source}</div>
        </div>
      `;

      container.appendChild(card);
    });

  } catch {
    container.innerHTML = "Error loading news.";
  }
}

fetchScores();
setInterval(fetchScores, 60000);
