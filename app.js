let shows = [];
let filtered = [];

const grid = document.getElementById("grid");
const search = document.getElementById("search");
const genre = document.getElementById("genre");

const detail = document.getElementById("detail");
const backBtn = document.getElementById("back");
const dTitle = document.getElementById("d-title");
const dTagline = document.getElementById("d-tagline");
const dOverview = document.getElementById("d-overview");
const dTags = document.getElementById("d-tags");
const dCast = document.getElementById("d-cast");
const dSongs = document.getElementById("d-songs");

function renderCards(list) {
  grid.innerHTML = "";
  list.forEach(s => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${s.title}</h3>
      <p class="meta">${s.genre}</p>
      <div class="pillrow">
        ${s.tags.slice(0, 4).map(t => `<span class="pill">${t}</span>`).join("")}
      </div>
    `;
    card.addEventListener("click", () => openDetail(s.id));
    grid.appendChild(card);
  });
}

function populateGenres() {
  const genres = [...new Set(shows.map(s => s.genre))].sort();
  genres.forEach(g => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g;
    genre.appendChild(opt);
  });
}

function applyFilters() {
  const q = search.value.trim().toLowerCase();
  const g = genre.value;

  filtered = shows.filter(s => {
    const matchesTitle = s.title.toLowerCase().includes(q);
    const matchesGenre = g ? s.genre === g : true;
    return matchesTitle && matchesGenre;
  });

  renderCards(filtered);
}

function openDetail(id) {
  const s = shows.find(x => x.id === id);
  if (!s) return;

  dTitle.textContent = s.title;
  dTagline.textContent = s.tagline;
  dOverview.textContent = s.overview;

  dTags.innerHTML = "";
  s.tags.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    dTags.appendChild(li);
  });

  dCast.innerHTML = "";
  s.cast.forEach(c => {
    const li = document.createElement("li");
    li.textContent = `${c.role} — ${c.actor}`;
    dCast.appendChild(li);
  });

  dSongs.innerHTML = "";
  s.songs.forEach(song => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${song.name}:</strong> ${song.note}`;
    dSongs.appendChild(li);
  });

  detail.classList.remove("hidden");
  grid.classList.add("hidden");
}

backBtn.addEventListener("click", () => {
  detail.classList.add("hidden");
  grid.classList.remove("hidden");
});

search.addEventListener("input", applyFilters);
genre.addEventListener("change", applyFilters);

async function init() {
  const res = await fetch("data.json");
  shows = await res.json();
  populateGenres();
  applyFilters();
}

init();
