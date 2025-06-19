const countryContainer = document.getElementById('countries-container');
const dropDownSelected = document.getElementById('selected');
const dropDownOptions = document.querySelector('.options-container');
const searchInput = document.querySelector('input');

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
  article.innerHTML = `<a href="/details.html?id=${
    dropDownSelected.querySelector('p').textContent !== 'Filter by Region'
      ? country.name.common
      : country.name
  }">
          <img src= "${country.flags.svg}" alt="country flag" />
          <div class="country-info">
            <h3>${
              dropDownSelected.querySelector('p').textContent !==
              'Filter by Region'
                ? country.name.common
                : country.name
            }</h3>
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
    data.forEach((country) => createCountryElement(country));
  } else {
    displayAllCountries();
  }
};

// display country by search

const searchCountry = async (e) => {
  countryContainer.innerHTML = '';
  dropDownSelected.querySelector('p').textContent = 'Filter by Region';
  const data = await getCountries('data.json');

  const searchedCountry = data.filter(
    (country) =>
      country.name.toLowerCase().indexOf(e.target.value.trim()) !== -1
  );

  searchedCountry.forEach((item) => {
    createCountryElement(item);
  });
};

// display country details

const displayCountryDetails = async () => {
  const countryID = window.location.search.split('=');
  const res = await getCountries('data.json');
  const data = res.filter((item) => item.name === countryID[1]);
  console.log(data);
  const country = data[0];

  let countryBorders;

  if (country.borders) countryBorders = country.borders;

  const borderContainers = await getBorders(countryBorders);
  const countryEl = borderContainers.map((item) => {
    return `<a href="/details.html?id=${item.name}"><p>${item.name}</p></a>`;
  });

  // creating Element for details page

  const section = document.createElement('section');
  section.classList = 'countries-details-con';
  section.innerHTML = ` 
        <img src="${country.flags.svg}" alt="flag" id="country-img" />
        <div class="country-details">
          <h3 id="country-name">${country.name}</h3>
          <div class="country-txt-details">
            <p>Native Name: <span>${country.nativeName}</span></p>
            <p>Population: <span>${country.population.toLocaleString()}</span></p>
            <p>Region: <span>${country.region}</span></p>
            <p>Sub Region: <span>${country.subregion}</span></p>
            <p>Capital: <span>${country.capital}</span></p>
          </div>
          <div class="country-info-details">
            <p>Top Level Domain: <span>${country.topLevelDomain}</span></p>
            <p>Currencies: <span>${country.currencies[0].name}</span></p>
            <p>Languages: <span>${country.languages.map(
              (item) => item.name
            )}</span></p>
          </div>
          <div class="country-borders-details">
            <p id="country-borders-name">Border Countries:</p>
            <div class="country-borders-txt">
            ${countryEl.map((item) => item).join('')}
            </div>
          </div>
        </div>
      `;

  // creating border element
  const borderCons = document.createElement('div');
  borderCons.classList = 'country-borders-details';
  borderCons.innerHTML = document
    .querySelector('#details-container')
    .appendChild(section);
};

//
async function getBorders(arr) {
  const data = await getCountries('data.json');

  const borderCountry = data.filter((country) =>
    arr.includes(country.alpha3Code)
  );
  return borderCountry;
}

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
  } else {
    displayCountryDetails();
  }
}

Init();
