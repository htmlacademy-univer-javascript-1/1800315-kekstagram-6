import { generatePhotos } from './photo-generator.js';
import { renderThumbnails } from './thumbnails.js';

const photos = generatePhotos();
export { photos };

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    renderThumbnails(photos);
  });
} else {
  renderThumbnails(photos);
}
