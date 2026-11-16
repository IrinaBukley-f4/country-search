import { SearchController, SearchState } from './logic/search.js';
import { Country } from './logic/mapCountryResponse.js';

const input = document.getElementById('search-input') as HTMLInputElement;
const loading = document.getElementById('loading')!;
const errorContainer = document.getElementById('error-container')!;
const errorText = document.getElementById('error-text')!;
const retryBtn = document.getElementById('retry-btn')!;
const noResults = document.getElementById('no-results')!;
const resultsList = document.getElementById('results-list')!;
const detailView = document.getElementById('detail-view')!;
const detailContent = document.getElementById('detail-content')!;
const backBtn = document.getElementById('back-btn')!;

function renderCard(country: Country) {
  const card = document.createElement('div');
  card.className = 'card';

  const img = document.createElement('img');
  img.src = country.flag;
  img.alt = `Флаг ${country.name}`;

  const h3 = document.createElement('h3');
  h3.textContent = country.name;

  const capital = document.createElement('p');
  capital.textContent = `Столица: ${country.capital}`;

  const region = document.createElement('p');
  region.textContent = `Регион: ${country.region}`;

  const population = document.createElement('p');
  population.textContent = `Население: ${country.population.toLocaleString()}`;

  card.appendChild(img);
  card.appendChild(h3);
  card.appendChild(capital);
  card.appendChild(region);
  card.appendChild(population);

  card.addEventListener('click', () => {
    resultsList.style.display = 'none';
    detailView.style.display = 'block';

    detailContent.textContent = '';

    const detailTitle = document.createElement('h2');
    detailTitle.textContent = country.name;

    const detailLang = document.createElement('p');
    detailLang.textContent = `Языки: ${country.languages.join(', ') || 'Нет данных'}`;

    const areaP = document.createElement('p');
    areaP.textContent = `Площадь: ${country.area.toLocaleString()} км²`;

    const bordersP = document.createElement('p');
    bordersP.textContent = `Границы: ${country.borders.length ? country.borders.join(', ') : 'Нет (остров)'}`;

    const currencyP = document.createElement('p');
    currencyP.textContent = `Валюта: ${country.currencies.join(', ') || 'Нет данных'}`;

    detailContent.appendChild(detailTitle);
    detailContent.appendChild(detailLang);
    detailContent.appendChild(areaP);
    detailContent.appendChild(bordersP);
    detailContent.appendChild(currencyP);
  });

  return card;
}

function updateUI(state: SearchState) {
  loading.style.display = 'none';
  errorContainer.style.display = 'none';
  noResults.style.display = 'none';
  resultsList.style.display = 'block';
  detailView.style.display = 'none';

  switch (state.status) {
    case 'idle':
      resultsList.textContent = '';
      break;

    case 'loading':
      loading.style.display = 'block';
      resultsList.textContent = '';
      break;

    case 'success':
      resultsList.textContent = '';
      state.data.forEach((country: Country) => {
        resultsList.appendChild(renderCard(country));
      });
      break;

    case 'empty':
      noResults.style.display = 'block';
      break;

    case 'error':
      errorText.textContent = state.message;
      errorContainer.style.display = 'block';
      break;
  }
}

const controller = new SearchController(updateUI);

input.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  controller.handleInput(target.value);
});

retryBtn.addEventListener('click', () => {
  controller.retry();
});

backBtn.addEventListener('click', () => {
  detailView.style.display = 'none';
  resultsList.style.display = 'block';
});
