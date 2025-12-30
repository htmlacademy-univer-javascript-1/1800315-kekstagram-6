import { getData } from './api.js';
import { renderThumbnails } from './thumbnails.js';
import { initFilters } from './filters.js';

const ERROR_MESSAGE_TIMEOUT = 5000;

const showErrorMessage = (message) => {
  const errorContainer = document.createElement('div');
  errorContainer.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; background-color: #ff6b6b; color: white; padding: 20px; text-align: center; z-index: 1000;';
  errorContainer.textContent = message;
  document.body.appendChild(errorContainer);

  setTimeout(() => {
    errorContainer.remove();
  }, ERROR_MESSAGE_TIMEOUT);
};

const initApp = async () => {
  try {
    const photos = await getData();
    renderThumbnails(photos);

    // Показываем блок фильтров после загрузки изображений
    const filtersBlock = document.querySelector('.img-filters');
    if (filtersBlock) {
      filtersBlock.classList.remove('img-filters--inactive');
    }

    // Инициализируем фильтры
    initFilters(photos);
  } catch (error) {
    showErrorMessage(`Ошибка загрузки данных: ${error.message}`);
  }
};

initApp();

// Загружаем форму после инициализации основного приложения
import './form.js';
