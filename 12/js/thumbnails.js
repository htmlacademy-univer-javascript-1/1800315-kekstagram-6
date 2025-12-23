import { openFullscreen } from './fullscreen.js';

const createThumbnail = (photo, template) => {
  const thumbnail = template.content.cloneNode(true);
  const pictureLink = thumbnail.querySelector('.picture');
  const imgElement = thumbnail.querySelector('.picture__img');
  const commentsElement = thumbnail.querySelector('.picture__comments');
  const likesElement = thumbnail.querySelector('.picture__likes');

  imgElement.src = photo.url;
  imgElement.alt = photo.description;
  commentsElement.textContent = photo.comments.length;
  likesElement.textContent = photo.likes;

  pictureLink.addEventListener('click', (evt) => {
    evt.preventDefault();
    openFullscreen(photo);
  });

  return thumbnail;
};

const renderThumbnails = (photos) => {
  const pictureTemplate = document.querySelector('#picture');
  const picturesContainer = document.querySelector('.pictures');

  if (!pictureTemplate) {
    return;
  }

  if (!picturesContainer) {
    return;
  }

  if (!photos || photos.length === 0) {
    return;
  }

  // Очищаем предыдущие изображения
  const existingPictures = picturesContainer.querySelectorAll('.picture');
  existingPictures.forEach((picture) => picture.remove());

  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const thumbnail = createThumbnail(photo, pictureTemplate);
    fragment.appendChild(thumbnail);
  });

  picturesContainer.appendChild(fragment);
};

export { renderThumbnails };

