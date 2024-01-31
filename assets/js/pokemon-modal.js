const mainContent = document.querySelector('.main-content');
const pokemonModal = document.querySelector('#pokemon-modal');
const pokemonHeader = document.querySelector('#pokemon-modal header');
const tabs = document.querySelectorAll('.modal-tabs ul li');
const sections = document.querySelectorAll('.pokemon-content section');
const aboutSection = document.querySelector('section#about');
const baseStatsSection = document.querySelector('section#base-stats');

const fetchPokemon = (url) => {
    return fetch(url)
    .then(response => response.json())
}

const loadModal = (id) => {

    const urls = [`https://pokeapi.co/api/v2/pokemon/${id}`,`https://pokeapi.co/api/v2/pokemon-species/${id}`];

    Promise.all(urls.map(fetchPokemon))
    .then((results) => createDetailedPokemon(results))
    .then((pokemon) => {
        const headerHTML = displayPokemonHeader(pokemon);
        const aboutHTML = displayPokemonAbout(pokemon);
        const baseStatsHTML = displayPokemonBaseStats(pokemon);
        pokemonHeader.innerHTML = headerHTML;
        aboutSection.innerHTML = aboutHTML;
        baseStatsSection.innerHTML = baseStatsHTML;
        addClickEvents();
    })
    .catch((err) => console.error(err));
}

const convertPokemonGender = (gender_rate) => {
    const femalePercent = 100 / (8 / gender_rate);
    const malePercent = 100 - femalePercent;
    return {
        male: malePercent,
        female: femalePercent
    }
}

const displayPokemonHeader = (pokemon) => {
    pokemonHeader.className = "";
    pokemonHeader.classList.add(`${pokemon.type}`);
    return `<div id="pokemon-icons">
            <i class="fa-solid fa-arrow-left" id="back-icon"></i>
            <i class="fa-regular fa-heart" id="fav-pokemon-icon"></i>
        </div>
        <div id="pokemon-title">
            <div id="pokemon-subtitle">
                <h2>${pokemon.name}</h2>
                <ol class="pokemon-types">
                    ${pokemon.types.map((type) => `<li class="capitalize">${type}</li>`).join('')}
                </ol>
            </div>
            <span class="pokemon-id">#${pokemon.number < 10 ? '00'+ pokemon.number : pokemon.number}</span>
        </div>
        <img src="${pokemon.photo}" alt="${pokemon.name}}">`;
}

const displayPokemonAbout = (pokemon) => {
    return `<table>
        <tr>
            <td>Species</td>
            <td>${pokemon.species.split(' ',1)}</td>
        </tr>
        <tr>
            <td>Height</td>
            <td>${pokemon.height * 10} cm</td>
        </tr>
        <tr>
            <td>Weight</td>
            <td>${((pokemon.weight / 10) * 2.20462).toFixed(1)} lbs (${pokemon.weight / 10} kg)</td>
        </tr>
        <tr>
            <td>Abilities</td>
            <td><span class='capitalize'>${pokemon.abilities.join(', ')}</span></td>
        </tr>
    </table>

    <h2>Breeding</h2>

    <table>
        <tr>
            <td>Gender</td>
            <td>
                <span class="male"><i class="fa-solid fa-mars"></i>${pokemon.gender.male}%</span>
                <span class="female"><i class="fa-solid fa-venus"></i>${pokemon.gender.female}%</span>
            </td>
        </tr>
        <tr>
            <td>Egg Groups</td>
            <td><span class="capitalize">${pokemon.eggGroups.join(', ')}</span></td>
        </tr>
        <tr>
            <td>Egg Cycles</td>
            <td>${pokemon.eggCycles}</td>
        </tr>
    </table>`;
}

const createStatBarCSS = (statValue, statMax) => {
    let color = '';
    statValue > (statMax / 2) ? color = '#46BF7A' : color = '#FC6F6F';
    statValue = (statValue / statMax) * 100;
    return `background: linear-gradient(to right, ${color} ${statValue}%, ${statValue}%, #ddd)`
}

const displayPokemonBaseStats = (pokemon) => {

    let tr = '';

    pokemon.stats.forEach((el) => {
        tr += `
            <tr>
                <td>${el.name}</td>
                <td>${el.value}</td>
                <td><span class="stats-bar" style="${createStatBarCSS(el.value, el.max_value)}"></span></td>
            </tr>
            `
    });

    return `
    <table>${tr}</table>

    <h2>Type defenses</h2>
    <p>The effectiveness of each type on Charmander.</p>`;
}

function createDetailedPokemon(results = []) {

    const [pokemonStats, pokemonSpecies] = results;

    const pokemon = new DetailedPokemon();

    pokemon.number = pokemonStats.id;
    pokemon.name = pokemonStats.name;

    pokemon.types = pokemonStats.types.map((typeSlot) => typeSlot.type.name);
    pokemon.type = pokemon.types[0];
    pokemon.photo = pokemonStats.sprites.other.dream_world.front_default;

    pokemon.species = pokemonSpecies.genera[7].genus;
    pokemon.height = pokemonStats.height;
    pokemon.weight = pokemonStats.weight;
    pokemon.abilities = pokemonStats.abilities.map((abilitySlot) => abilitySlot.ability.name);
    pokemon.gender = convertPokemonGender(pokemonSpecies.gender_rate);
    pokemon.eggGroups = pokemonSpecies.egg_groups.map((group) => group.name);
    pokemon.eggCycles = pokemonSpecies.hatch_counter;
    pokemon.stats = pokemonStats.stats.map((el) => {
        return {
            name: el.stat.name,
            value: el.base_stat,
            max_value: 100
        }
    })
    const newStatsName = ['HP','Attack','Defense','Sp. Atk','Sp. Def','Speed','Total'];

    for (x in pokemon.stats) {
        pokemon.stats[x].name = newStatsName[x];
    };
    
    let total = 0;
    let maxTotal = 0;
    pokemon.stats.forEach((el) => {
        total += el.value;
        maxTotal += el.max_value;
    });

    pokemon.stats.push({name: 'total', value: total, max_value: maxTotal});
    return pokemon;
}

function openModal(pokemonNumber) {
    pokemonModal.classList.remove('hidden');
    mainContent.classList.add('hidden');
    loadModal(pokemonNumber);
    window.scrollTo(0,0);
}

function switchTabs(tabNumber) {
    tabs.forEach((tab) => tab.classList.remove('selected-tab'));
    sections.forEach((section) => section.classList.add('hidden'));
    tabs[tabNumber].classList.add('selected-tab');
    sections[tabNumber].classList.remove('hidden');
}

// Events
function addClickEvents() {
    const backIcon = document.querySelector('#back-icon');

    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => switchTabs(i));
    });

    backIcon.addEventListener('click', () => {
        pokemonModal.classList.add('hidden');
        mainContent.classList.remove('hidden');
        window.scrollTo(0,document.body.scrollHeight);
    });
}