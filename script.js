const countryContainer = document.getElementById('countries-container');

// fetch country from api

const getCountries = async (endpoint) => {
  const res = await fetch(endpoint);
  const data = await res.json();

  return data;
};

// create element to display country

function createCountryElement(country) {
  const article = document.createElement('article');
  article.classList = 'card-container';
  article.innerHTML = `<a href="/details.html?id=${country.name}">
          <img src="download.png" alt="country flag" />
          <div class="country-info">
            <h3>United States of America</h3>
            <div class="country-txt-info">
              <p>Population: <span>81,383,838</span></p>
              <p>Region: <span>Americas</span></p>
              <p>Capital: <span>Washington D.C</span></p>
            </div>
          </div>
        </a>`;

  countryContainer.appendChild(article);
}
