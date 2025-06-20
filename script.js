const countryContainer = document.getElementById('countries-container');
const dropDownSelected = document.getElementById('selected');
const dropDownOptions = document.querySelector('.options-container');
const searchInput = document.querySelector('input');
const DarkModeBtn = document.getElementById('dark-mode-btn');

// fetch country from api

const getCountries = async (endpoint) => {
  const res = await fetch(endpoint);
  const data = await res.json();

  return data;
};

// display all countries

const displayAllCountries = async () => {
  const data = await getCountries(
    `https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca3`
  );
  const sortData = data.sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );
  sortData.forEach((country) => createCountryElement(country));
};
// create element to display country

function createCountryElement(country) {
  const article = document.createElement('article');
  article.classList = 'card-container';
  article.innerHTML = `<a href="/details.html?id=${country.cca3}">
          <img src= "${country.flags.svg}" alt="country flag" />
          <div class="country-info">
            <h3>${country.name.common}</h3>
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

const closeDropDown = (e) => {
  if (!document.getElementById('drop-down').contains(e.target)) {
    dropDownOptions.classList.remove('visible');
  }
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

// select region from dropDown

const selectRegionOption = (e) => {
  const selectTxt = dropDownSelected.querySelector('p');
  if (e.target.tagName === 'LI') {
    if (e.target.textContent === 'All') {
      selectTxt.textContent = 'Filter by Region';
    } else {
      selectTxt.textContent = e.target.textContent;
    }
  }

  e.currentTarget.classList.remove('visible');
  searchInput.value = '';
  filterByRegions();
};

// filter countries by region

const filterByRegions = async () => {
  const selectedtxt = dropDownSelected.querySelector('p').textContent;

  countryContainer.innerHTML = '';

  if (selectedtxt !== 'Filter by Region') {
    const data = await getCountries(
      `https://restcountries.com/v3.1/region/${selectedtxt}`
    );
    const sortData = data.sort((a, b) =>
      a.name.common.localeCompare(b.name.common)
    );
    sortData.forEach((country) => createCountryElement(country));
  } else {
    displayAllCountries();
  }
};

// display country by search

const searchCountry = async (e) => {
  countryContainer.innerHTML = '';
  dropDownSelected.querySelector('p').textContent = 'Filter by Region';
  const data = await getCountries(
    `https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca3`
  );

  const sortData = data.sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );

  const searchedCountry = sortData.filter(
    (country) =>
      country.name.common.toLowerCase().indexOf(e.target.value.trim()) !== -1
  );

  searchedCountry.forEach((item) => {
    createCountryElement(item);
  });
};

// display country details

const displayCountryDetails = async () => {
  const countryID = window.location.search.split('=');
  const data = await getCountries(
    `https://restcountries.com/v3.1/alpha/${countryID[1]}`
  );
  const country = data[0];

  let countryBorders;

  if (country.borders) countryBorders = country.borders;

  const borderContainers = await getBorders(countryBorders);

  let countryEl;
  if (borderContainers.length !== 0) {
    countryEl = borderContainers.map((item) => {
      return `<a href="/details.html?id=${item.cca3}"><p>${item.name.common}</p></a>`;
    });
  } else {
    countryEl = '<p>none</p>';
  }

  //set info more than one

  const nativeName = Object.values(country.name.nativeName || {});
  const currencies = Object.values(country.currencies || {});
  const languages = Object.values(country.languages || {});

  // creating Element for details page

  const section = document.createElement('section');
  section.classList = 'countries-details-con';
  section.innerHTML = ` 
        <img src="${country.flags.svg}" alt="flag" id="country-img" />
        <div class="country-details">
          <h3 id="country-name">${country.name.common}</h3>
          <div class="country-txt-details">
            <p>Native Name: <span>${
              nativeName.length !== 0
                ? nativeName[nativeName.length - 1].common
                : 'none'
            }</span></p>
            <p>Population: <span>${country.population.toLocaleString()}</span></p>
            <p>Region: <span>${country.region}</span></p>
            <p>Sub Region: <span>${country.subregion}</span></p>
            <p>Capital: <span>${country.capital}</span></p>
          </div>
          <div class="country-info-details">
            <p>Top Level Domain: <span>${country.tld}</span></p>
            <p>Currencies: <span>${
              currencies.length !== 0 ? currencies[0].name : 'none'
            }</span></p>
            <p>Languages: <span>${languages
              .map((item) => item)
              .join(',  ')}</span></p>
          </div>
          <div class="country-borders-details">
            <p id="country-borders-name">Border Countries:</p>
            <div class="country-borders-txt">
            ${
              Array.isArray(countryEl)
                ? countryEl.map((item) => item).join('')
                : countryEl
            }
            </div>
          </div>
        </div>
      `;

  document.querySelector('#details-container').appendChild(section);
};

//
async function getBorders(arr = []) {
  const data = await getCountries(
    `https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca3`
  );

  const borderCountry = data.filter((country) => arr.includes(country.cca3));
  return borderCountry;
}

// dark and light mode

const darkMode = () => {
  const html = document.documentElement;
  html.classList.toggle('dark-mode');
  html.classList.contains('dark-mode')
    ? localStorage.setItem('darkMode', 'light')
    : localStorage.setItem('darkMode', 'dark');
};

function Init() {
  if (
    window.location.pathname === '/' ||
    window.location.pathname === '/index.html'
  ) {
    displayAllCountries();
    displayRegion();
    dropDownSelected.addEventListener('click', openDropDown);
    dropDownOptions.addEventListener('click', selectRegionOption);
    searchInput.addEventListener('input', searchCountry);
    document.addEventListener('click', closeDropDown);
  } else {
    displayCountryDetails();
  }
  DarkModeBtn.addEventListener('click', darkMode);
  document.addEventListener('DOMContentLoaded', () => {
    const storageDarkMode = localStorage.getItem('darkMode');
    if (storageDarkMode === 'light') {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  });
}

Init();
