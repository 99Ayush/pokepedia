
const pokedex = document.getElementById('pokedex');
const searchbar = document.getElementById('searchbar');
let pokemon = [];
let allGenData = []; 


const initGlobalSearch = async () => {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
    const data = await res.json();
    allGenData = data.results; // 
};

initGlobalSearch(); 
searchbar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();
    if(searchString === '') {
        fetchpokemon(1, 151);
        return;
    }   
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
            image: data.sprites.other['official-artwork'].front_default,
            stat: data.stats.map((s) => `${s.stat.name}: ${s.base_stat}`).join(', '),
            type: data.types.map((t) => t.type.name).join(', '),
            abilities: data.abilities.map((a) => a.ability.name).join(', ')
        }));
        
        displaypokemon(searchResults);
    });
});

const fetchpokemon = (start,end) =>{
    pokemon = [];
    pokedex.innerHTML = `<h2 style ="color:white; text-align:center;">Loading...</h2>`;
    const promises =[];
    for(let i=start;i<=end;i++){
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then((res)=>res.json()));
    };
    Promise.all(promises).then((results) => {

        pokemon = results.map((data) => ({
            name: data.name,
            id: data.id,
            base_experience: data.base_experience,
            weight: `${data.weight / 10} kg`,
            height: `${data.height / 10} m`,
            image: data.sprites.other['official-artwork'].front_default,
            stat: data.stats.map((stat) => `${stat.stat.name}: ${stat.base_stat}`).join(', '),
            type: data.types.map((type) => type.type.name).join(', '),
            abilities: data.abilities.map((abilities) => abilities.ability.name).join(', ')
        }));
        displaypokemon(pokemon);
    });
};


  

const displaypokemon = (pokemonlist) => {
    if (!pokemonlist) return;

    const pokemonhtmlstring = pokemonlist.map((pokemun) => `
        <li class="card">
            <img class="card-image" src="${pokemun.image}" loading="lazy"/>
            <h2 class="card-title">${pokemun.id}. ${pokemun.name}</h2>
            <p class="card-subtitle">Type: ${pokemun.type}</p>
            <p class="card-subtitle" style="font-size: 10px; color: #555; margin-top:5px;">${pokemun.stat}</p>
            <p class="card-subtitle" style="font-size: 12px;">Abilities: ${pokemun.abilities}</p>
        </li>
    `).join('');
    
    pokedex.innerHTML = pokemonhtmlstring;
};
fetchpokemon(1,151);