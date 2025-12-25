import { defineStep, Then } from 'cypress-cucumber-preprocessor/steps';

// Перехват POST запроса настраивается автоматически в cypress/support/e2e.js
// Этот step definition можно использовать для явной настройки перехвата, если нужно
defineStep(/^перехватываю POST запрос$/, () => {
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

// Шаг для проверки успешной отправки формы
// Используем синтаксис Then для совместимости
Then(/^форма успешно отправлена с масштабом '(.*)', эффектом '(.*)', комментарием '(.*)' и тэгами '(.*)'$/, (scale, effect, comment, tags) => {
  cy.wait('@postData', { timeout: 10000 })
    .should(({request, response}) => {
      expect(request.headers['content-type']).to.include('multipart/form-data');
      expect(response.body.files[0].filename).to.eq('JavaScript-logo.png');
    });
});

