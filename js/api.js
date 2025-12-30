const GET_DATA_URL = 'https://29.javascript.htmlacademy.pro/kekstagram/data';
const SEND_DATA_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const request = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Ошибка сети: ${response.status}`);
  }

  return response.json();
};

const getData = () => request(GET_DATA_URL);

const sendData = (formData) =>
  request(SEND_DATA_URL, {
    method: 'POST',
    body: formData
  });

export { getData, sendData };

