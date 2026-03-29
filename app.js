let shows = [];
let filtered = [];

// Archive page elements
const grid = document.getElementById("grid");
const search = document.getElementById("search");
const genre = document.getElementById("genre");
const musicGenre = document.getElementById("musicGenre");
const format = document.getElementById("format");
const tag = document.getElementById("tag");

// THEME SYSTEM - now fully syncs between pages
function setupThemeToggle() {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    const saved = localStorage.getItem("theme") || "dark";
    const isLight = saved === "light";

    document.body.classList.toggle("light", isLight);
    document.body.classList.toggle("dark", !isLight);
    toggle.checked = isLight;

    toggle.addEventListener("change", () => {
        const nowLight = toggle.checked;
        document.body.classList.toggle("light", nowLight);
        document.body.classList.toggle("dark", !nowLight);
        localStorage.setItem("theme", nowLight ? "light" : "dark");
    });

    window.addEventListener("storage", (e) => {
        if (e.key === "theme") location.reload();
    });
}

function renderCards(list) {
    if (!grid) return;
    grid.innerHTML = "";

    list.forEach(s => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${s.poster}" class="poster" alt="${s.title}">
            <div class="cardinfo">
                <h3>${s.title}</h3>
                <p class="meta">${s.genre} • ${s.music_genre}</p>
                <div class="pillrow">${s.tags.map(t => `<span class="pill">${t}</span>`).join("")}</div>
            </div>
        `;
        card.onclick = () => window.location.href = `detail.html?id=${s.id}`;
        grid.appendChild(card);
    });
}

function setOptions(selectEl, values) {
    if (!selectEl) return;
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
    if (!genre || !musicGenre || !format || !tag) return;

    const genres = [...new Set(shows.map(s => s.genre))].sort();
    const musicGenres = [...new Set(shows.map(s => s.music_genre))].sort();
    const formats = [...new Set(shows.map(s => s.format))].sort();
    const tags = [...new Set(shows.flatMap(s => s.tags))].sort();

    setOptions(genre, genres);
    setOptions(musicGenre, musicGenres);
    setOptions(format, formats);
    setOptions(tag, tags);
}

function applyFilters() {
    if (!grid) return;

    const q = (search ? search.value : "").toLowerCase().trim();
    const g = genre ? genre.value : "";
    const mg = musicGenre ? musicGenre.value : "";
    const f = format ? format.value : "";
    const t = tag ? tag.value : "";

    filtered = shows.filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(q);
        const matchesGenre = !g || s.genre === g;
        const matchesMusic = !mg || s.music_genre === mg;
        const matchesFormat = !f || s.format === f;
        const matchesTag = !t || s.tags.includes(t);
        return matchesSearch && matchesGenre && matchesMusic && matchesFormat && matchesTag;
    });

    renderCards(filtered);
}

async function init() {
    const res = await fetch("data.json");
    shows = await res.json();

    populateFilters();
    applyFilters();

    if (search) search.addEventListener("input", applyFilters);
    if (genre) genre.addEventListener("change", applyFilters);
    if (musicGenre) musicGenre.addEventListener("change", applyFilters);
    if (format) format.addEventListener("change", applyFilters);
    if (tag) tag.addEventListener("change", applyFilters);

    setupThemeToggle();
}

init();