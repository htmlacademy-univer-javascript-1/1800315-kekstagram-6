import { getRandomInteger, getRandomArrayElement, createIdGenerator } from './util.js';
import { DESCRIPTIONS, MESSAGES, NAMES } from './data.js';

const MIN_AVATAR = 1;
const MAX_AVATAR = 6;
const MIN_COMMENTS_COUNT = 0;
const MAX_COMMENTS_COUNT = 30;
const MIN_LIKES = 15;
const MAX_LIKES = 200;
const PHOTOS_COUNT = 25;

const generateCommentId = createIdGenerator();

const generateComment = () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${getRandomInteger(MIN_AVATAR, MAX_AVATAR)}.svg`,
  message: getRandomArrayElement(MESSAGES),
  name: getRandomArrayElement(NAMES)
});

const generateComments = () => {
  const commentsCount = getRandomInteger(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT);
  return Array.from({ length: commentsCount }, generateComment);
};

const generatePhoto = (index) => ({
  id: index,
  url: `photos/${index}.jpg`,
  description: getRandomArrayElement(DESCRIPTIONS),
  likes: getRandomInteger(MIN_LIKES, MAX_LIKES),
  comments: generateComments()
});

const generatePhotos = () => Array.from({ length: PHOTOS_COUNT }, (_, index) => generatePhoto(index + 1));

export { generatePhotos };
