import { sendData } from './api.js';

const getFormElements = () => {
  const uploadForm = document.querySelector('#upload-select-image');
  if (!uploadForm) {
    return null;
  }

  return {
    form: uploadForm,
    fileInput: uploadForm.querySelector('#upload-file'),
    overlay: uploadForm.querySelector('.img-upload__overlay'),
    cancelButton: uploadForm.querySelector('#upload-cancel'),
    hashtagsInput: uploadForm.querySelector('.text__hashtags'),
    descriptionTextarea: uploadForm.querySelector('.text__description'),
    scaleSmaller: uploadForm.querySelector('.scale__control--smaller'),
    scaleBigger: uploadForm.querySelector('.scale__control--bigger'),
    scaleValue: uploadForm.querySelector('.scale__control--value'),
    previewImage: uploadForm.querySelector('.img-upload__preview img'),
    effectLevelSlider: uploadForm.querySelector('.effect-level__slider'),
    effectLevelValue: uploadForm.querySelector('.effect-level__value'),
    effectLevelContainer: uploadForm.querySelector('.img-upload__effect-level'),
    effectRadios: uploadForm.querySelectorAll('.effects__radio'),
    submitButton: uploadForm.querySelector('#upload-submit')
  };
};

let elements = null;
let pristine = null;
let scale = 100;
const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
let effectSlider = null;
let defaultImageUrl = 'img/upload-default-image.jpg';
let currentImageUrl = null;

const EFFECT_SETTINGS = {
  none: {
    min: 0,
    max: 100,
    step: 1,
    filter: () => ''
  },
  chrome: {
    min: 0,
    max: 1,
    step: 0.1,
    filter: (value) => `grayscale(${value})`
  },
  sepia: {
    min: 0,
    max: 1,
    step: 0.1,
    filter: (value) => `sepia(${value})`
  },
  marvin: {
    min: 0,
    max: 100,
    step: 1,
    filter: (value) => `invert(${value}%)`
  },
  phobos: {
    min: 0,
    max: 3,
    step: 0.1,
    filter: (value) => `blur(${value}px)`
  },
  heat: {
    min: 1,
    max: 3,
    step: 0.1,
    filter: (value) => `brightness(${value})`
  }
};

const MAX_HASHTAGS = 5;
const MAX_DESCRIPTION_LENGTH = 140;
const HASHTAG_PATTERN = /^#[a-zа-яё0-9]{1,19}$/i;

const validateHashtags = (value) => {
  if (!value.trim()) {
    return true;
  }

  const hashtags = value.trim().split(/\s+/);

  if (hashtags.length > MAX_HASHTAGS) {
    return false;
  }

  for (const hashtag of hashtags) {
    if (!HASHTAG_PATTERN.test(hashtag)) {
      return false;
    }
  }

  const uniqueHashtags = new Set(hashtags.map((tag) => tag.toLowerCase()));
  if (uniqueHashtags.size !== hashtags.length) {
    return false;
  }

  return true;
};

const getHashtagsErrorMessage = (value) => {
  if (!value.trim()) {
    return '';
  }

  const hashtags = value.trim().split(/\s+/);

  if (hashtags.length > MAX_HASHTAGS) {
    return `Максимум ${MAX_HASHTAGS} хэш-тегов`;
  }

  for (const hashtag of hashtags) {
    if (!HASHTAG_PATTERN.test(hashtag)) {
      if (!hashtag.startsWith('#')) {
        return 'Хэш-тег должен начинаться с символа #';
      }
      if (hashtag.length === 1) {
        return 'Хэш-тег не может состоять только из одной решётки';
      }
      if (hashtag.length > 20) {
        return 'Максимальная длина хэш-тега 20 символов, включая решётку';
      }
      if (hashtag.includes(' ')) {
        return 'Хэш-теги разделяются пробелами';
      }
      return 'Хэш-тег содержит недопустимые символы';
    }
  }

  const uniqueHashtags = new Set(hashtags.map((tag) => tag.toLowerCase()));
  if (uniqueHashtags.size !== hashtags.length) {
    return 'Один и тот же хэш-тег не может быть использован дважды';
  }

  return '';
};

const validateDescription = (value) => value.length <= MAX_DESCRIPTION_LENGTH;

const getDescriptionErrorMessage = () => `Максимальная длина комментария ${MAX_DESCRIPTION_LENGTH} символов`;

const updateScale = () => {
  if (!elements || !elements.previewImage || !elements.scaleValue) {
    return;
  }
  elements.previewImage.style.transform = `scale(${scale / 100})`;
  elements.scaleValue.value = `${scale}%`;
};

const onScaleSmallerClick = () => {
  if (scale > SCALE_MIN) {
    scale -= SCALE_STEP;
    updateScale();
  }
};

const onScaleBiggerClick = () => {
  if (scale < SCALE_MAX) {
    scale += SCALE_STEP;
    updateScale();
  }
};

const resetScale = () => {
  scale = 100;
  updateScale();
};

const applyEffect = (effectName, value) => {
  if (!elements || !elements.previewImage) {
    return;
  }

  const effect = EFFECT_SETTINGS[effectName];
  if (!effect) {
    return;
  }

  const filterValue = effect.filter(value);
  if (filterValue) {
    elements.previewImage.style.filter = filterValue;
  } else {
    elements.previewImage.style.filter = '';
  }
};

const updateEffectSlider = (effectName) => {
  if (!elements || !elements.effectLevelSlider || typeof noUiSlider === 'undefined') {
    return;
  }

  const effect = EFFECT_SETTINGS[effectName];
  if (!effect) {
    return;
  }

  if (effectSlider) {
    effectSlider.destroy();
    effectSlider = null;
  }

  if (effectName === 'none') {
    if (elements.effectLevelContainer) {
      elements.effectLevelContainer.classList.add('hidden');
    }
    applyEffect('none', 0);
    return;
  }

  if (elements.effectLevelContainer) {
    elements.effectLevelContainer.classList.remove('hidden');
  }

  noUiSlider.create(elements.effectLevelSlider, {
    range: {
      min: effect.min,
      max: effect.max
    },
    start: effect.max,
    step: effect.step,
    connect: 'lower'
  });

  effectSlider = elements.effectLevelSlider.noUiSlider;

  effectSlider.on('update', () => {
    const value = parseFloat(effectSlider.get());
    if (elements.effectLevelValue) {
      elements.effectLevelValue.value = value;
    }
    applyEffect(effectName, value);
  });

  const initialValue = effect.max;
  if (elements.effectLevelValue) {
    elements.effectLevelValue.value = initialValue;
  }
  applyEffect(effectName, initialValue);
};

const onEffectChange = (evt) => {
  const effectName = evt.target.value;
  updateEffectSlider(effectName);
};

const initEffectSlider = () => {
  updateEffectSlider('none');
};

const resetForm = () => {
  if (!elements) {
    return;
  }
  resetScale();
  if (effectSlider) {
    effectSlider.destroy();
    effectSlider = null;
  }
  if (elements.previewImage) {
    elements.previewImage.style.filter = '';
    // Восстанавливаем дефолтное изображение
    if (currentImageUrl && currentImageUrl !== defaultImageUrl) {
      URL.revokeObjectURL(currentImageUrl);
      currentImageUrl = null;
    }
    elements.previewImage.src = defaultImageUrl;
  }
  const noneRadio = elements.form.querySelector('#effect-none');
  if (noneRadio) {
    noneRadio.checked = true;
    updateEffectSlider('none');
  }
  elements.form.reset();
  elements.fileInput.value = '';
  if (pristine) {
    pristine.reset();
  }
};

const openUploadForm = () => {
  if (!elements) {
    return;
  }
  elements.overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  resetScale();
  initEffectSlider();
};

const closeUploadForm = () => {
  if (!elements) {
    return;
  }
  elements.overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  resetForm();
};

const onUploadFileChange = () => {
  const file = elements.fileInput.files[0];
  if (!file) {
    return;
  }

  // Проверяем, что файл является изображением
  if (!file.type.startsWith('image/')) {
    return;
  }

  // Освобождаем предыдущий URL, если он был создан через createObjectURL
  if (currentImageUrl && currentImageUrl !== defaultImageUrl) {
    URL.revokeObjectURL(currentImageUrl);
  }

  // Создаем URL для загруженного изображения
  currentImageUrl = URL.createObjectURL(file);

  // Устанавливаем изображение в превью
  if (elements.previewImage) {
    elements.previewImage.src = currentImageUrl;
  }

  openUploadForm();
};

const onUploadCancelClick = () => {
  closeUploadForm();
};

const showSuccessMessage = () => {
  const successTemplate = document.querySelector('#success');
  if (!successTemplate) {
    return;
  }
  const successElement = successTemplate.content.cloneNode(true);
  const successSection = successElement.querySelector('.success');
  document.body.appendChild(successSection);

  function closeSuccess() {
    successSection.remove();
    document.removeEventListener('keydown', onSuccessKeyDown);
    document.removeEventListener('click', onSuccessClick);
  }

  function onSuccessKeyDown(evt) {
    if (evt.key === 'Escape') {
      closeSuccess();
    }
  }

  function onSuccessClick(evt) {
    if (evt.target === successSection) {
      closeSuccess();
    }
  }

  const successButton = successSection.querySelector('.success__button');
  if (successButton) {
    successButton.addEventListener('click', closeSuccess);
  }

  document.addEventListener('keydown', onSuccessKeyDown);
  document.addEventListener('click', onSuccessClick);
};

const showErrorMessage = () => {
  const errorTemplate = document.querySelector('#error');
  if (!errorTemplate) {
    return;
  }
  const errorElement = errorTemplate.content.cloneNode(true);
  const errorSection = errorElement.querySelector('.error');
  document.body.appendChild(errorSection);

  function closeError() {
    errorSection.remove();
    document.removeEventListener('keydown', onErrorKeyDown);
    document.removeEventListener('click', onErrorClick);
  }

  function onErrorKeyDown(evt) {
    if (evt.key === 'Escape') {
      closeError();
    }
  }

  function onErrorClick(evt) {
    if (evt.target === errorSection) {
      closeError();
    }
  }

  const errorButton = errorSection.querySelector('.error__button');
  if (errorButton) {
    errorButton.addEventListener('click', closeError);
  }

  document.addEventListener('keydown', onErrorKeyDown);
  document.addEventListener('click', onErrorClick);
};

const blockSubmitButton = (isBlocked) => {
  if (!elements || !elements.submitButton) {
    return;
  }
  elements.submitButton.disabled = isBlocked;
  if (isBlocked) {
    elements.submitButton.textContent = 'Отправляю...';
  } else {
    elements.submitButton.textContent = 'Опубликовать';
  }
};

const onUploadFormSubmit = async (evt) => {
  evt.preventDefault();

  if (pristine) {
    const isValid = pristine.validate();
    if (!isValid) {
      return;
    }
  }

  const formData = new FormData(elements.form);
  blockSubmitButton(true);

  try {
    await sendData(formData);
    closeUploadForm();
    resetForm();
    showSuccessMessage();
  } catch (error) {
    showErrorMessage();
  } finally {
    blockSubmitButton(false);
  }
};

const onFormDocumentKeyDown = (evt) => {
  if (evt.key === 'Escape' && elements && elements.overlay && !elements.overlay.classList.contains('hidden')) {
    const activeElement = document.activeElement;
    if (activeElement === elements.hashtagsInput || activeElement === elements.descriptionTextarea) {
      return;
    }
    evt.preventDefault();
    closeUploadForm();
  }
};

const initForm = () => {
  elements = getFormElements();
  if (!elements) {
    return;
  }

  elements.fileInput.addEventListener('change', onUploadFileChange);
  elements.cancelButton.addEventListener('click', onUploadCancelClick);
  document.addEventListener('keydown', onFormDocumentKeyDown);

  if (elements.scaleSmaller) {
    elements.scaleSmaller.addEventListener('click', onScaleSmallerClick);
  }
  if (elements.scaleBigger) {
    elements.scaleBigger.addEventListener('click', onScaleBiggerClick);
  }

  if (elements.effectRadios) {
    elements.effectRadios.forEach((radio) => {
      radio.addEventListener('change', onEffectChange);
    });
  }

  resetScale();
  initEffectSlider();

  // Инициализация Pristine (ждем загрузки модуля)
  const initPristine = () => {
    if (typeof window.Pristine !== 'undefined') {
      try {
        pristine = new window.Pristine(elements.form, {
          classTo: 'img-upload__field-wrapper',
          errorTextParent: 'img-upload__field-wrapper',
          errorTextClass: 'img-upload__error-text'
        });

        pristine.addValidator(elements.hashtagsInput, validateHashtags, getHashtagsErrorMessage);
        pristine.addValidator(elements.descriptionTextarea, validateDescription, getDescriptionErrorMessage);

        elements.form.addEventListener('submit', onUploadFormSubmit);
      } catch (error) {
        // Игнорируем ошибки инициализации валидации, но форма все равно должна работать
      }
    } else {
      // Повторяем попытку через небольшую задержку, если модуль еще не загружен
      // Максимум 20 попыток (1 секунда)
      if (initPristine.attempts === undefined) {
        initPristine.attempts = 0;
      }
      if (initPristine.attempts < 20) {
        initPristine.attempts++;
        setTimeout(initPristine, 50);
      }
      // Если Pristine не загрузился, форма все равно должна работать без валидации
    }
  };
  initPristine();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initForm);
} else {
  initForm();
}

export { closeUploadForm };

