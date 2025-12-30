import { Given, When, Then, defineStep } from 'cypress-cucumber-preprocessor/steps';

// Перехват GET запроса на загрузку данных
Given(/^подменяю запрос на загрузку данных$/, () => {
  cy.intercept({
    method: 'GET',
    url: 'https://29.javascript.htmlacademy.pro/kekstagram/data'
  }, {
    statusCode: 200,
    fixture: 'photos.json'
  }).as('getData');
});

// Перехват POST запроса на отправку данных (обычный, без задержки)
Given(/^подменяю запрос на отправку данных$/, () => {
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

// Перехват POST запроса с задержкой
Given(/^данные отправляются с задержкой$/, () => {
  cy.intercept('POST', 'https://29.javascript.htmlacademy.pro/kekstagram', {
    statusCode: 200,
    delay: 1000,
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
Then(/^форма успешно отправлена с масштабом '(.*)', эффектом '(.*)', комментарием '(.*)' и тэгами '(.*)'$/, (scale, effect, comment, tags) => {
  cy.wait('@postData', { timeout: 10000 })
    .should(({request, response}) => {
      expect(request.headers['content-type']).to.include('multipart/form-data');
      expect(response.body.files[0].filename).to.eq('JavaScript-logo.png');
    });
});

// Шаг для ожидания завершения запроса на отправку данных
When(/^запрос на отправку данных завершён$/, () => {
  cy.wait('@postData', { timeout: 10000 }).its('response.statusCode').should('eql', 200);
});

// Шаг для проверки, что данные не должны отправляться
Given(/^данные не должны отправляться$/, () => {
  cy.intercept('POST', 'https://29.javascript.htmlacademy.pro/kekstagram', {
    statusCode: 500,
    body: {
      error: 'Server error'
    }
  }).as('postData');
});

