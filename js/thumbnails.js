const createThumbnail = (photo, template) => {
  const thumbnail = template.content.cloneNode(true);
  const imgElement = thumbnail.querySelector('.picture__img');
  const commentsElement = thumbnail.querySelector('.picture__comments');
  const likesElement = thumbnail.querySelector('.picture__likes');

  imgElement.src = photo.url;
  imgElement.alt = photo.description;
  commentsElement.textContent = photo.comments.length;
  likesElement.textContent = photo.likes;

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

  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const thumbnail = createThumbnail(photo, pictureTemplate);
    fragment.appendChild(thumbnail);
  });

  picturesContainer.appendChild(fragment);
};

export { renderThumbnails };

