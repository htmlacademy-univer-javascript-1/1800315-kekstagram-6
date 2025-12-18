const GET_DATA_URL = 'https://29.javascript.htmlacademy.pro/kekstagram/data';
const SEND_DATA_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const getData = async () => {
  try {
    const response = await fetch(GET_DATA_URL);
    if (!response.ok) {
      throw new Error(`Ошибка загрузки данных: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Не удалось загрузить данные: ${error.message}`);
  }
};

const sendData = async (formData) => {
  try {
    const response = await fetch(SEND_DATA_URL, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      throw new Error(`Ошибка отправки данных: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Не удалось отправить данные: ${error.message}`);
  }
};

export { getData, sendData };

