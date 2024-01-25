const backIcon = document.querySelector('#back-icon');
const pokemonModal = document.querySelector('#pokemon-modal');
const tabs = document.querySelectorAll('.modal-tabs ul li');
const sections = document.querySelectorAll('.pokemon-content section')

function openModal(pokemonNumber) {
    pokemonModal.classList.remove('hidden');
    console.log(`Clicou no Pokemon #${pokemonNumber}`);
}

function switchTabs(tabNumber) {
    tabs.forEach((tab) => tab.classList.remove('selected-tab'));
    sections.forEach((section) => section.classList.add('hidden'));
    tabs[tabNumber].classList.add('selected-tab');
    sections[tabNumber].classList.remove('hidden');
}

tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => switchTabs(i));
});

backIcon.addEventListener('click', () => {
    pokemonModal.classList.add('hidden');
});