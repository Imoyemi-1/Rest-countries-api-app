const countryContainer = document.getElementById('countries-container');
const dropDownSelected = document.getElementById('selected');
const dropDownOptions = document.querySelector('.options-container');

// fetch country from api

const getCountries = async (endpoint) => {
  const res = await fetch(endpoint);
  const data = await res.json();

  return data;
};

// display all countries

const displayAllCountries = async () => {
  const data = await getCountries('data.json');
  data.forEach((country) => createCountryElement(country));
};
// create element to display country

function createCountryElement(country) {
  const article = document.createElement('article');
  article.classList = 'card-container';
  article.innerHTML = `<a href="/details.html?id=${country.name}">
          <img src= "${country.flags.svg}" alt="country flag" />
          <div class="country-info">
            <h3>${country.name}</h3>
            <div class="country-txt-info">
              <p>Population: <span>${country.population.toLocaleString()}</span></p>
              <p>Region: <span>${country.region}</span></p>
              <p>Capital: <span>${country.capital}</span></p>
            </div>
          </div>
        </a>`;

  countryContainer.appendChild(article);
}

// open drop down filter box

const openDropDown = () => {
  dropDownOptions.classList.toggle('visible');
};

// create and display list options for dropdown

const displayRegion = async () => {
  const data = await getCountries(
    'https://restcountries.com/v3.1/all?fields=region'
  );

  const region = [];

  data.forEach((item) => {
    if (!region.includes(item.region)) {
      region.push(item.region);
    }
  });

  region.forEach((region) => {
    const list = document.createElement('li');
    list.classList = 'options';
    list.textContent = region;

    dropDownOptions.appendChild(list);
  });
};

function Init() {
  if (
    window.location.pathname === '/' ||
    window.location.pathname === '/index.html'
  ) {
    displayAllCountries();
    displayRegion();
    dropDownSelected.addEventListener('click', openDropDown);
  }
}

Init();
