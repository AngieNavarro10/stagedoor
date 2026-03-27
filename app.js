let shows = [];
let filtered = [];

const grid = document.getElementById("grid");
const search = document.getElementById("search");
const genre = document.getElementById("genre");
const musicGenre = document.getElementById("musicGenre");
const format = document.getElementById("format");
const tag = document.getElementById("tag");

function renderCards(list) {
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
    const q = search.value.toLowerCase().trim();
    const g = genre.value;
    const mg = musicGenre.value;
    const f = format.value;
    const t = tag.value;

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

/* Theme toggle (used on both pages) */
function setupThemeToggle() {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    // Load saved preference
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.body.classList.toggle("light", savedTheme === "light");
    document.body.classList.toggle("dark", savedTheme === "dark");
    toggle.checked = savedTheme === "light";

    toggle.addEventListener("change", () => {
        const isLight = toggle.checked;
        document.body.classList.toggle("light", isLight);
        document.body.classList.toggle("dark", !isLight);
        localStorage.setItem("theme", isLight ? "light" : "dark");
    });
}

async function init() {
    const res = await fetch("data.json");
    shows = await res.json();
    populateFilters();
    applyFilters();
    setupThemeToggle();   // ← this makes light mode work everywhere
}

init();