import { SearchController } from './logic/search.js';
const input = document.createElement('input');
input.type = 'text';
input.id = 'search-input';
input.className = 'search-input';
input.placeholder = 'Поиск страны...';
input.autocomplete = 'off';
const loading = document.createElement('div');
loading.id = 'loading';
loading.className = 'loading';
loading.textContent = 'Загрузка...';
const errorContainer = document.createElement('div');
errorContainer.id = 'error-container';
errorContainer.className = 'error-message';
const errorText = document.createElement('span');
errorText.id = 'error-text';
const retryBtn = document.createElement('button');
retryBtn.id = 'retry-btn';
retryBtn.className = 'retry-btn';
retryBtn.textContent = 'Повторить';
errorContainer.appendChild(errorText);
errorContainer.appendChild(retryBtn);
const noResults = document.createElement('div');
noResults.id = 'no-results';
noResults.className = 'no-results';
noResults.textContent = 'Ничего не найдено';
const resultsList = document.createElement('div');
resultsList.id = 'results-list';
resultsList.className = 'card-list';
const detailView = document.createElement('div');
detailView.id = 'detail-view';
detailView.className = 'detail-view';
const backBtn = document.createElement('button');
backBtn.id = 'back-btn';
backBtn.className = 'back-btn';
backBtn.textContent = '← Назад к поиску';
const detailContent = document.createElement('div');
detailContent.id = 'detail-content';
detailView.appendChild(backBtn);
detailView.appendChild(detailContent);
document.body.appendChild(input);
document.body.appendChild(loading);
document.body.appendChild(errorContainer);
document.body.appendChild(noResults);
document.body.appendChild(resultsList);
document.body.appendChild(detailView);
function renderCard(country) {
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
function updateUI(state) {
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
            state.data.forEach((country) => {
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
    const target = e.target;
    controller.handleInput(target.value);
});
retryBtn.addEventListener('click', () => {
    controller.retry();
});
backBtn.addEventListener('click', () => {
    detailView.style.display = 'none';
    resultsList.style.display = 'block';
});
//# sourceMappingURL=main.js.map