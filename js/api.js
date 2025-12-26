const GET_DATA_URL = 'https://29.javascript.htmlacademy.pro/kekstagram/data';
const SEND_DATA_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const request = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

const getData = async () => {
  try {
    return await request(GET_DATA_URL);
  } catch (error) {
    throw new Error(`Не удалось загрузить данные: ${error.message}`);
  }
};

const sendData = async (formData) => {
  try {
    return await request(SEND_DATA_URL, {
      method: 'POST',
      body: formData
    });
  } catch (error) {
    throw new Error(`Не удалось отправить данные: ${error.message}`);
  }
};

export { getData, sendData };

