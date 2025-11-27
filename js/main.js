import { generatePhotos } from './photo-generator.js';
import { renderThumbnails } from './thumbnails.js';

const photos = generatePhotos();
export { photos };

const initApp = () => {
  renderThumbnails(photos);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Загружаем форму после инициализации основного приложения
setTimeout(() => {
  import('./form.js').catch(() => {
    // Игнорируем ошибки загрузки формы
  });
}, 0);
