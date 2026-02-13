let shows = [];
let filtered = [];

const grid = document.getElementById("grid");
const search = document.getElementById("search");

const genre = document.getElementById("genre");
const musicGenre = document.getElementById("musicGenre");
const format = document.getElementById("format");
const tag = document.getElementById("tag");

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

    // Show more than just "genre" now that we have 3 primary categories
    card.innerHTML = `
      <h3>${s.title}</h3>
      <p class="meta">${s.genre} • ${s.music_genre} • ${s.format}</p>
      <div class="pillrow">
        ${Array.isArray(s.tags) ? s.tags.slice(0, 4).map(t => `<span class="pill">${t}</span>`).join("") : ""}
      </div>
    `;

    card.addEventListener("click", () => openDetail(s.id));
    grid.appendChild(card);
  });
}

function setOptions(selectEl, values) {
  // Keep the first option ("All ___") and replace the rest
  const first = selectEl.options[0];
  selectEl.innerHTML = "";
  selectEl.appendChild(first);

  values.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    selectEl.appendChild(opt);
  });
}

function populateFilters() {
  const genres = [...new Set(shows.map(s => s.genre).filter(Boolean))].sort();
  const musicGenres = [...new Set(shows.map(s => s.music_genre).filter(Boolean))].sort();
  const formats = [...new Set(shows.map(s => s.format).filter(Boolean))].sort();

  // Tags come from arrays, so flatten first
  const allTags = shows
    .flatMap(s => Array.isArray(s.tags) ? s.tags : [])
    .filter(Boolean);
  const tags = [...new Set(allTags)].sort((a, b) => a.localeCompare(b));

  setOptions(genre, genres);
  setOptions(musicGenre, musicGenres);
  setOptions(format, formats);
  setOptions(tag, tags);
}

function applyFilters() {
  const q = search.value.trim().toLowerCase();

  const g = genre.value;
  const mg = musicGenre.value;
  const f = format.value;
  const t = tag.value;

  filtered = shows.filter(s => {
    const matchesTitle = s.title?.toLowerCase().includes(q);

    const matchesGenre = g ? s.genre === g : true;
    const matchesMusicGenre = mg ? s.music_genre === mg : true;
    const matchesFormat = f ? s.format === f : true;

    const matchesTag = t
      ? (Array.isArray(s.tags) && s.tags.includes(t))
      : true;

    return matchesTitle && matchesGenre && matchesMusicGenre && matchesFormat && matchesTag;
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
  (Array.isArray(s.tags) ? s.tags : []).forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    dTags.appendChild(li);
  });

  dCast.innerHTML = "";
  (Array.isArray(s.cast) ? s.cast : []).forEach(c => {
    const li = document.createElement("li");
    li.textContent = `${c.role} — ${c.actor}`;
    dCast.appendChild(li);
  });

  dSongs.innerHTML = "";
  (Array.isArray(s.songs) ? s.songs : []).forEach(song => {
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
musicGenre.addEventListener("change", applyFilters);
format.addEventListener("change", applyFilters);
tag.addEventListener("change", applyFilters);

async function init() {
  const res = await fetch("data.json");
  shows = await res.json();

  populateFilters();
  applyFilters();
}

init();
