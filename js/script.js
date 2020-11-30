/**
 * Estado da aplicacao
 */
let tabCountries = null;
let tabFavorites = null;

let allCountries = [];
let favoriteCountries = [];

let countCountries = null;
let countFavorites = null;

let totalPopulationList = null;
let totalFavoriteList = null;

let numberFormat = null;
/**
 * on load
 */
window.addEventListener('load', () => {
  tabCountries = document.querySelector('#tabCountries');
  tabFavorites = document.querySelector('#tabFavorites');

  countCountries  = document.querySelector('#countCountries ');
  countFavorites = document.querySelector('#countFavorites');

  totalPopulationList = document.querySelector('#totalPopulationList');
  totalPopulationFavorites = document.querySelector('#totalPopulationFavorites');

  numberFormat = Intl.NumberFormat('pt-BR');

  fetchCountries();
});

async function fetchCountries() {
  const res = await fetch('https://restcountries.eu/rest/v2/all');
  const json = await res.json();
  allCountries = json.map(country => {
    const {numericCode: id, translations, population, flag} = country;
    return  {
      id,
      name: translations.pt,
      population,
      formatedPopulation: formatNumbers(population),
      flag
    };
  });
  allCountries.sort((a, b) => a.name.localeCompare(b.name));
  render();
};

const render = () => {
  renderCountryList();
  renderFavoriteList();
  renderSummary();
  handleCountryButtons();
}

function renderCountryList() {
  let countriesHTML = '<div>';
  allCountries.forEach(country => {
    const {name, flag, id, formatedPopulation} = country;
    const countryHTML = `
    <div class='country'>
      <div>
        <a id="${id}" class='waves-effect waves-light btn'>+</a>
      </div>
      <div>
        <img src="${flag}" alt="${name.toLowerCase()} flag">
      </div>
      <div>
        <ul>
          <li>${name}</li>
          <li>${formatedPopulation}</li>
        </ul>
      </div>
    </div>
    `;
    countriesHTML += countryHTML;
  });
  countriesHTML += '</div>';

  tabCountries.innerHTML = countriesHTML;
}

function renderFavoriteList() {
  let favoritesHTML = '<div>';
  favoriteCountries.forEach(country => {
    const {name, flag, id, formatedPopulation} = country;
    const favoriteCountryHTML = `
    <div class='country'>
      <div>
        <a id="${id}" class='waves-effect waves-light btn red darken-4'>-</a>
      </div>
      <div>
        <img src="${flag}" alt="${name.toLowerCase()} flag">
      </div>
      <div>
        <ul>
          <li>${name}</li>
          <li>${formatedPopulation}</li>
        </ul>
      </div>
    </div>
    `;
    favoritesHTML += favoriteCountryHTML;
  });
  favoritesHTML += '</div>'

  tabFavorites.innerHTML = favoritesHTML;
}

/**
 * render the countries count, favorite count
 * each total population count 
 */
function renderSummary() {
  countCountries.textContent = allCountries.length;
  countFavorites.textContent = favoriteCountries.length;
  
  let populationCountriesSum = allCountries.reduce((acc, cur) => acc + cur.population,0);
  let populationFavoritesSum = favoriteCountries.reduce((acc, cur) => acc + cur.population,0);

  totalPopulationList.textContent = formatNumbers(populationCountriesSum);
  totalPopulationFavorites.textContent = formatNumbers(populationFavoritesSum);
}

function handleCountryButtons() {
  const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));
  const favoriteButtons = Array.from(tabFavorites.querySelectorAll('.btn'));
  countryButtons.forEach((button) => {
    button.addEventListener('click', () => addToFavorites(button.id));
  });
  favoriteButtons.forEach((button) => {
    button.addEventListener('click', () => removeFromFavorites(button.id));
  });  
}

function addToFavorites(id) {
  const countryToAdd = allCountries.find(country => country.id === id);
  favoriteCountries = [...favoriteCountries, countryToAdd];
  favoriteCountries.sort((a, b) => a.name.localeCompare(b.name));
  allCountries = allCountries.filter(country => country.id !== id);

  render();
}

function removeFromFavorites(id) {
  const countryToRemove = favoriteCountries.find(country => country.id === id);
  allCountries = [...allCountries, countryToRemove];
  allCountries.sort((a, b) => a.name.localeCompare(b.name));
  favoriteCountries = favoriteCountries.filter(country => country.id !== id);

  render();
}

function formatNumbers(number) {
  return numberFormat.format(number);
}
