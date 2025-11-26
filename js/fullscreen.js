let elements = null;

const getBigPictureElements = () => {
  if (elements) {
    return elements;
  }

  const bigPictureElement = document.querySelector('.big-picture');
  if (!bigPictureElement) {
    return null;
  }

  elements = {
    element: bigPictureElement,
    img: bigPictureElement.querySelector('.big-picture__img img'),
    likesCount: bigPictureElement.querySelector('.likes-count'),
    commentsCount: bigPictureElement.querySelector('.comments-count'),
    socialComments: bigPictureElement.querySelector('.social__comments'),
    socialCaption: bigPictureElement.querySelector('.social__caption'),
    socialCommentCount: bigPictureElement.querySelector('.social__comment-count'),
    commentsLoader: bigPictureElement.querySelector('.comments-loader'),
    cancelButton: bigPictureElement.querySelector('#picture-cancel')
  };

  return elements;
};

const closeFullscreen = () => {
  const currentElements = getBigPictureElements();
  if (!currentElements) {
    return;
  }

  currentElements.element.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

const onCancelButtonClick = () => {
  closeFullscreen();
};

const initCancelButton = () => {
  const currentElements = getBigPictureElements();
  if (currentElements && currentElements.cancelButton) {
    currentElements.cancelButton.addEventListener('click', onCancelButtonClick);
  }
};

const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.className = 'social__comment';

  const avatarImg = document.createElement('img');
  avatarImg.className = 'social__picture';
  avatarImg.src = comment.avatar;
  avatarImg.alt = comment.name;
  avatarImg.width = 35;
  avatarImg.height = 35;

  const textElement = document.createElement('p');
  textElement.className = 'social__text';
  textElement.textContent = comment.message;

  commentElement.appendChild(avatarImg);
  commentElement.appendChild(textElement);

  return commentElement;
};

const renderComments = (comments, socialCommentsElement) => {
  socialCommentsElement.innerHTML = '';
  const fragment = document.createDocumentFragment();

  comments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    fragment.appendChild(commentElement);
  });

  socialCommentsElement.appendChild(fragment);
};

const openFullscreen = (photo) => {
  const currentElements = getBigPictureElements();
  if (!currentElements) {
    return;
  }

  currentElements.img.src = photo.url;
  currentElements.img.alt = photo.description;
  currentElements.likesCount.textContent = photo.likes;
  currentElements.commentsCount.textContent = photo.comments.length;
  currentElements.socialCaption.textContent = photo.description;

  renderComments(photo.comments, currentElements.socialComments);

  currentElements.socialCommentCount.classList.add('hidden');
  currentElements.commentsLoader.classList.add('hidden');

  currentElements.element.classList.remove('hidden');
  document.body.classList.add('modal-open');
};


const onDocumentKeyDown = (evt) => {
  const currentElements = getBigPictureElements();
  if (!currentElements) {
    return;
  }

  if (evt.key === 'Escape' && !currentElements.element.classList.contains('hidden')) {
    evt.preventDefault();
    closeFullscreen();
  }
};

document.addEventListener('keydown', onDocumentKeyDown);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initCancelButton();
  });
} else {
  initCancelButton();
}

export { openFullscreen };

