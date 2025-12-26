export const tmpl = {
  apply: (template, params) => {
    if (!template) {
      return '';
    }
    let result = template;
    if (params && Array.isArray(params)) {
      params.forEach((param, index) => {
        result = result.replace(new RegExp(`\\$\\{${index}\\}`, 'g'), param);
      });
    }
    return result;
  }
};

export const findAncestor = (element, className) => {
  let current = element;
  while (current && current !== document.body) {
    if (current.classList && current.classList.contains(className)) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
};

export const groupedElemCount = (element) => {
  if (!element || !element.name) {
    return 0;
  }
  const group = document.querySelectorAll(`input[name="${element.name}"]:checked`);
  return group.length;
};

export const mergeConfig = (target, source) => {
  const result = { ...source };
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      result[key] = target[key];
    }
  }
  return result;
};

export const isEscapeKey = (evt) => evt.key === 'Escape';

