async function loadNBAGames() {
  const today = new Date().toISOString().split('T')[0];

  const response = await fetch(
    `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${today}&l=NBA`
  );

  const data = await response.json();
  const gamesContainer = document.getElementById("games");
  gamesContainer.innerHTML = "";

  if (!data.events) {
    gamesContainer.innerHTML = "<p>No games today.</p>";
    return;
  }

  data.events.forEach(game => {
    const div = document.createElement("div");
    div.classList.add("game");

    div.innerHTML = `
      <div class="team">
        <span>${game.strHomeTeam}</span>
        <span>${game.intHomeScore || 0}</span>
      </div>
      <div class="team">
        <span>${game.strAwayTeam}</span>
        <span>${game.intAwayScore || 0}</span>
      </div>
      <div class="status">
        ${game.strStatus || "Scheduled"}
      </div>
    `;

    gamesContainer.appendChild(div);
  });
}

loadNBAGames();