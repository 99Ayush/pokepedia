// 1. SELECT DOM ELEMENTS & INITIALIZE VARIABLES
const pokedex = document.getElementById('pokedex');
const searchbar = document.getElementById('searchbar');
let pokemon = [];
let allGenData = [];

// --- THESE WERE MISSING AND CAUSING THE BLANK SCREEN ---
let isShinyMode = false;
let isItemMode = false; 
let loadedItems = []; 
// -------------------------------------------------------

// 2. LOADING ANIMATION FUNCTION
const showLoading = () => {
    const loadingHTML = `
        <div class="loader-container">
            <img src="https://media.tenor.com/fSsxSHCuJyMAAAAi/pikachu-running.gif" class="running-pika" alt="Loading...">
        </div>
    `;
    pokedex.innerHTML = loadingHTML;
};

// 3. FETCH GLOBAL DATA (For Search)
const initGlobalSearch = async () => {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
    const data = await res.json();
    allGenData = data.results; 
};
initGlobalSearch();

// 4. SEARCH BAR LOGIC (With Animation)
searchbar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();

    // A. Item Search Mode
    if (isItemMode) {
        if(loadedItems.length > 0) {
            const filteredItems = loadedItems.filter(item => 
                item.name.toLowerCase().includes(searchString)
            );
            displayItems(filteredItems);
        }
        return; 
    }

    // B. Empty Search -> Reset
    if (searchString === '') {
        fetchpokemon(1, 50);
        return;
    }

    // C. Running Pikachu Animation
    showLoading();

    // D. Execute Search (with small delay for animation)
    setTimeout(() => {
        const matchNames = allGenData.filter(p => p.name.includes(searchString));
        const topMatches = matchNames.slice(0, 10);

        const promises = topMatches.map(match => fetch(match.url).then(res => res.json()));

        Promise.all(promises).then((results) => {
            const searchResults = results.map((data) => ({
                name: data.name,
                id: data.id,
                base_experience: data.base_experience,
                weight: `${data.weight / 10} kg`,
                height: `${data.height / 10} m`,
                image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
                shiny: data.sprites.other['official-artwork'].front_shiny || data.sprites.front_shiny,
                stat: data.stats.map((s) => `${s.stat.name}: ${s.base_stat}`).join(', '),
                type: data.types.map((t) => t.type.name).join(', '),
                abilities: data.abilities.map((a) => a.ability.name).join(', ')
            }));
            displaypokemon(searchResults);
        });
    }, 500);
});

// 5. MAIN FETCH FUNCTION
const fetchpokemon = (start, end) => {
    isItemMode = false;
    pokemon = [];
    showLoading();

    const promises = [];
    for (let i = start; i <= end; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then((res) => res.json()));
    };

    Promise.all(promises).then((results) => {
        pokemon = results.map((data) => ({
            name: data.name,
            id: data.id,
            base_experience: data.base_experience,
            weight: `${data.weight / 10} kg`,
            height: `${data.height / 10} m`,
            image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
            shiny: data.sprites.other['official-artwork'].front_shiny || data.sprites.front_shiny,
            stat: data.stats.map((stat) => `${stat.stat.name}: ${stat.base_stat}`).join(', '),
            type: data.types.map((type) => type.type.name).join(', '),
            abilities: data.abilities.map((abilities) => abilities.ability.name).join(', ')
        }));
        displaypokemon(pokemon);
    });
};

// 6. GENERATION BUTTONS
const genbuttons = document.querySelectorAll('.gen-btn button');
genbuttons.forEach(button => {
    button.addEventListener('click', function () {
        genbuttons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});
if (genbuttons.length > 0) {
    genbuttons[0].classList.add('active');
}

// 7. MODAL (POPUP) LOGIC
const modal = document.getElementById('modal');

const openModal = async (id) => {
    modal.classList.add('visible');
    document.getElementById('modal-name').innerText = "Loading...";
    document.getElementById('modal-img').src = "";
    document.getElementById('modal-stats-content').innerHTML = "";
    document.getElementById('evolution-chain').innerHTML = "";

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();
    
    // Check Shiny Mode for Modal Image
    const modalImage = (isShinyMode && data.sprites.other['official-artwork'].front_shiny)
        ? data.sprites.other['official-artwork'].front_shiny
        : data.sprites.other['official-artwork'].front_default;

    document.getElementById('modal-img').src = modalImage;
    document.getElementById('modal-name').innerText = data.name;
    document.getElementById('modal-height-weight').innerText = `Height: ${data.height / 10}m | Weight: ${data.weight / 10}kg`;

    // Audio / Cry
    const cryURL = data.cries.latest;
    if (cryURL) {
        const audio = new Audio(cryURL);
        audio.volume = 0.2;
        audio.play();
        const cryBtn = document.getElementById('play-cry-btn');
        if(cryBtn) {
            cryBtn.onclick = () => audio.play();
            cryBtn.style.display = "inline-block";
        }
    } else {
        const cryBtn = document.getElementById('play-cry-btn');
        if(cryBtn) cryBtn.style.display = "none";
    }

    // Stats
    const statsHTML = data.stats.map(s =>
        `<p>${s.stat.name}: <b>${s.base_stat}</b></p>`
    ).join('');
    document.getElementById('modal-stats-content').innerHTML = statsHTML;

    // Evolution Chain
    const speciesRes = await fetch(data.species.url);
    const speciesData = await speciesRes.json();
    const evoRes = await fetch(speciesData.evolution_chain.url);
    const evoData = await evoRes.json();

    let evoHTML = '';
    let current = evoData.chain;

    do {
        const evoName = current.species.name;
        const evoId = current.species.url.split('/')[6];
        const evoImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evoId}.png`;

        evoHTML += `
            <div style="text-align:center;">
                <img src="${evoImage}" class="evo-img">
                <p>${evoName}</p>
            </div>
            ${current.evolves_to.length > 0 ? '<span>➡️</span>' : ''} 
        `;
        current = current.evolves_to[0];
    } while (current && current.hasOwnProperty('evolves_to'));

    document.getElementById('evolution-chain').innerHTML = evoHTML;
};

const closeModal = () => {
    modal.classList.remove('visible');
};

window.onclick = (event) => {
    if (event.target == modal) {
        closeModal();
    }
};

// 8. ITEM FETCHING
const fetchItems = () => {
    isItemMode = true; // Works now because variable is declared at top
    pokemon = [];
    showLoading();

    const promises = [];
    for (let i = 1; i <= 100; i++) {
        const url = `https://pokeapi.co/api/v2/item/${i}`;
        promises.push(fetch(url).then((res) => res.json()));
    }

    Promise.all(promises).then((results) => {
        const items = results.map((data) => ({
            name: data.name,
            id: data.id,
            image: data.sprites.default,
            effect: data.effect_entries.find(e => e.language.name === 'en')?.short_effect || "No description available."
        }));
        
        loadedItems = items; // Save items for search
        displayItems(items);
    });
};

const displayItems = (itemList) => {
    const itemHTMLString = itemList.map((item) => `
        <li class="card" style="min-height: 250px;"> 
            <img class="card-image" src="${item.image}" style="width:80px; height:80px; margin-top:20px;"/>
            <h2 class="card-title">${item.id}. ${item.name}</h2>
            <p class="card-subtitle" style="font-size:12px; padding: 0 10px; color:#555;">
                ${item.effect}
            </p>
        </li>
    `).join('');
    pokedex.innerHTML = itemHTMLString;
};

// 9. TOGGLE SHINY
const toggleShiny = () => {
    isShinyMode = !isShinyMode;
    displaypokemon(pokemon);
};

// 10. DISPLAY POKEMON
const displaypokemon = (pokemonlist) => {
    if (!pokemonlist) return;

    const pokemonhtmlstring = pokemonlist.map((pokemun) => {
        const sprite = (isShinyMode && pokemun.shiny) ? pokemun.shiny : pokemun.image;

        return `
        <li class="card" onclick="openModal(${pokemun.id})">
            <img class="card-image" src="${sprite}" loading="lazy"/>
            <h2 class="card-title">${pokemun.id}. ${pokemun.name}</h2>
            <p class="card-subtitle">Type: ${pokemun.type}</p>
            <p class="card-subtitle" style="font-size: 12px; color: #ddd;">
                ${pokemun.weight} | ${pokemun.height}
            </p>
        </li>
        `;
    }).join('');

    pokedex.innerHTML = pokemonhtmlstring;
};

// 11. START APP
fetchpokemon(1, 51);

