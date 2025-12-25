// Автоматическая настройка перехвата POST запроса
// Этот файл загружается автоматически перед каждым тестом

// Настраиваем перехват POST запроса для отправки формы
beforeEach(() => {
  cy.intercept('POST', 'https://29.javascript.htmlacademy.pro/kekstagram', {
    statusCode: 200,
    body: {
      files: [
        {
          filename: 'JavaScript-logo.png'
        }
      ]
    }
  }).as('postData');
});

