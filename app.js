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

        card.innerHTML = `
            <img src="${s.poster}" class="poster" alt="${s.title} poster">
            <div class="cardinfo">
                <h3>${s.title}</h3>
                <p class="meta">${s.genre} • ${s.music_genre}</p>
                <div class="pillrow">
                    ${s.tags.map(t => `<span class="pill">${t}</span>`).join("")}
                </div>
            </div>
        `;

        card.onclick = () => openDetail(s.id);
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
    const q = search.value.toLowerCase();
    const g = genre.value;
    const mg = musicGenre.value;
    const f = format.value;
    const t = tag.value;

    filtered = shows.filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(q);
        const matchesGenre = g ? s.genre === g : true;
        const matchesMusicGenre = mg ? s.music_genre === mg : true;
        const matchesFormat = f ? s.format === f : true;
        const matchesTag = t ? s.tags.includes(t) : true;

        return matchesSearch && matchesGenre && matchesMusicGenre && matchesFormat && matchesTag;
    });

    renderCards(filtered);
}

function openDetail(id) {
    const s = shows.find(x => x.id === id);
    
    grid.classList.add("hidden");
    detail.classList.remove("hidden");

    dTitle.textContent = s.title;
    dTagline.textContent = s.tagline || "";
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
        li.innerHTML = `<strong>${song.name}</strong>: ${song.note}`;
        dSongs.appendChild(li);
    });

    const alsoDiv = document.getElementById("also");
    alsoDiv.innerHTML = "";

    if (s.also && s.also.length > 0) {
        s.also.forEach(a => {
            const show = shows.find(x => x.id === a);
            if (!show) return;
            const card = document.createElement("div");
            card.className = "alsoCard";
            card.innerHTML = `
                <img src="${show.poster}">
                <p>${show.title}</p>
            `;
            card.onclick = () => openDetail(show.id);
            alsoDiv.appendChild(card);
        });
    }
}

backBtn.addEventListener("click", () => {
    detail.classList.add("hidden");
    grid.classList.remove("hidden");
});

// Event listeners
search.addEventListener("input", applyFilters);
genre.addEventListener("change", applyFilters);
musicGenre.addEventListener("change", applyFilters);
format.addEventListener("change", applyFilters);
tag.addEventListener("change", applyFilters);

// Theme toggle
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("light");
    document.body.classList.toggle("dark");
});

// Simple active nav highlighting on scroll
function highlightNav() {
    const sections = ['home', 'about', 'archive'];
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = 'home';
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                if (scrollY >= sectionTop - 150) {
                    current = sectionId;
                }
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

async function init() {
    const res = await fetch("data.json");
    shows = await res.json();
    populateFilters();
    applyFilters();
    highlightNav();
}

init();