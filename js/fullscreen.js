import { isEscapeKey } from './utils.js';

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

const COMMENTS_PER_PAGE = 5;
let currentComments = [];
let displayedCommentsCount = 0;

const renderComments = (comments, socialCommentsElement, startIndex = 0) => {
  const endIndex = Math.min(startIndex + COMMENTS_PER_PAGE, comments.length);
  const fragment = document.createDocumentFragment();

  for (let i = startIndex; i < endIndex; i++) {
    const commentElement = createCommentElement(comments[i]);
    fragment.appendChild(commentElement);
  }

  socialCommentsElement.appendChild(fragment);
  displayedCommentsCount = endIndex;

  return endIndex;
};

const updateCommentsCounter = (currentElements, totalCount, displayedCount) => {
  const commentsCountSpan = currentElements.socialCommentCount.querySelector('.comments-count');
  if (commentsCountSpan) {
    commentsCountSpan.textContent = totalCount;
  }

  const commentCountText = currentElements.socialCommentCount;
  if (commentCountText) {
    const textNodes = Array.from(commentCountText.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE);
    if (textNodes.length > 0 && textNodes[0]) {
      textNodes[0].textContent = `${displayedCount} из `;
    }
  }
};

const toggleCommentsLoader = (currentElements, hasMoreComments) => {
  if (hasMoreComments) {
    currentElements.commentsLoader.classList.remove('hidden');
  } else {
    currentElements.commentsLoader.classList.add('hidden');
  }
};

const onCommentsLoaderClick = (currentElements) => {
  const remainingComments = currentComments.length - displayedCommentsCount;
  if (remainingComments > 0) {
    const nextIndex = displayedCommentsCount;
    renderComments(currentComments, currentElements.socialComments, nextIndex);
    updateCommentsCounter(currentElements, currentComments.length, displayedCommentsCount);
    toggleCommentsLoader(currentElements, displayedCommentsCount < currentComments.length);
  }
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

  currentComments = photo.comments;
  displayedCommentsCount = 0;
  currentElements.socialComments.innerHTML = '';

  renderComments(currentComments, currentElements.socialComments, 0);
  updateCommentsCounter(currentElements, currentComments.length, displayedCommentsCount);

  currentElements.socialCommentCount.classList.remove('hidden');
  toggleCommentsLoader(currentElements, displayedCommentsCount < currentComments.length);

  const oldLoaderButton = currentElements.commentsLoader;
  const newLoaderButton = oldLoaderButton.cloneNode(true);
  oldLoaderButton.replaceWith(newLoaderButton);
  currentElements.commentsLoader = newLoaderButton;
  newLoaderButton.addEventListener('click', () => onCommentsLoaderClick(currentElements));

  currentElements.element.classList.remove('hidden');
  document.body.classList.add('modal-open');
};


const onDocumentKeyDown = (evt) => {
  const currentElements = getBigPictureElements();
  if (!currentElements) {
    return;
  }

  if (isEscapeKey(evt) && !currentElements.element.classList.contains('hidden')) {
    evt.preventDefault();
    closeFullscreen();
  }
};

document.addEventListener('keydown', onDocumentKeyDown);

initCancelButton();

export { openFullscreen };

