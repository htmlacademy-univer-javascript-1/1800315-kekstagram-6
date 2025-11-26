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
    descriptionTextarea: uploadForm.querySelector('.text__description')
  };
};

let elements = null;
let pristine = null;

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

const openUploadForm = () => {
  if (!elements) {
    return;
  }
  elements.overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const closeUploadForm = () => {
  if (!elements) {
    return;
  }
  elements.overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  elements.form.reset();
  elements.fileInput.value = '';
  if (pristine) {
    pristine.reset();
  }
};

const onUploadFileChange = () => {
  const file = elements.fileInput.files[0];
  if (file) {
    openUploadForm();
  }
};

const onUploadCancelClick = () => {
  closeUploadForm();
};

const onUploadFormSubmit = (evt) => {
  if (pristine) {
    const isValid = pristine.validate();
    if (!isValid) {
      evt.preventDefault();
    }
  }
};

const onFormDocumentKeyDown = (evt) => {
  if (evt.key === 'Escape' && elements && elements.overlay && !elements.overlay.classList.contains('hidden')) {
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

  if (typeof Pristine !== 'undefined') {
    try {
      pristine = new Pristine(elements.form, {
        classTo: 'img-upload__field-wrapper',
        errorTextParent: 'img-upload__field-wrapper',
        errorTextClass: 'img-upload__error-text'
      });

      pristine.addValidator(elements.hashtagsInput, validateHashtags, getHashtagsErrorMessage);
      pristine.addValidator(elements.descriptionTextarea, validateDescription, getDescriptionErrorMessage);

      elements.form.addEventListener('submit', onUploadFormSubmit);
    } catch (error) {
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initForm);
} else {
  initForm();
}

export { closeUploadForm };

