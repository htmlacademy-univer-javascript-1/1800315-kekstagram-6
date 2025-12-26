import { renderThumbnails } from './thumbnails.js';

// Функция для устранения дребезга
const debounce = (callback, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(null, args), delay);
  };
};

// Фильтры
const FilterType = {
  DEFAULT: 'default',
  RANDOM: 'random',
  DISCUSSED: 'discussed'
};

const DEBOUNCE_DELAY = 500;

let allPhotos = [];

// Функция для получения случайных неповторяющихся фотографий
const getRandomPhotos = (photos, count = 10) => {
  const shuffled = [...photos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, photos.length));
};

// Функция для получения обсуждаемых фотографий (по убыванию комментариев)
const getDiscussedPhotos = (photos) => [...photos].sort((a, b) => b.comments.length - a.comments.length);

// Функция применения фильтра
const applyFilter = (filterType) => {
  let filteredPhotos = [];

  switch (filterType) {
    case FilterType.DEFAULT:
      filteredPhotos = allPhotos;
      break;
    case FilterType.RANDOM:
      filteredPhotos = getRandomPhotos(allPhotos);
      break;
    case FilterType.DISCUSSED:
      filteredPhotos = getDiscussedPhotos(allPhotos);
      break;
    default:
      filteredPhotos = allPhotos;
  }

  renderThumbnails(filteredPhotos);
};

// Debounced версия функции применения фильтра
const debouncedApplyFilter = debounce(applyFilter, DEBOUNCE_DELAY);

// Инициализация фильтров
const initFilters = (photos) => {
  allPhotos = photos;

  const filterButtons = document.querySelectorAll('.img-filters__button');
  const filterDefault = document.querySelector('#filter-default');
  const filterRandom = document.querySelector('#filter-random');
  const filterDiscussed = document.querySelector('#filter-discussed');

  // Обработчик клика на кнопки фильтров
  const filterButtonClickHandler = (evt) => {
    const clickedButton = evt.target;

    // Убираем активный класс у всех кнопок
    filterButtons.forEach((button) => {
      button.classList.remove('img-filters__button--active');
    });

    // Добавляем активный класс к нажатой кнопке
    clickedButton.classList.add('img-filters__button--active');

    // Определяем тип фильтра и применяем его
    if (clickedButton === filterDefault) {
      debouncedApplyFilter(FilterType.DEFAULT);
    } else if (clickedButton === filterRandom) {
      debouncedApplyFilter(FilterType.RANDOM);
    } else if (clickedButton === filterDiscussed) {
      debouncedApplyFilter(FilterType.DISCUSSED);
    }
  };

  // Добавляем обработчики событий
  filterButtons.forEach((button) => {
    button.addEventListener('click', filterButtonClickHandler);
  });
};

export { initFilters };

