require('dotenv').config()

const Login = require('../pageObjects/login.po');

let login;

describe('Ororo.tv', () => {
  beforeAll(async () => {
    login = new Login();
    await page.goto('https://ororo.tv/en', { waitUntil: 'networkidle2' });
  });


  it('should login into account', async () => {
    await page.click(login.loginButton);
    await page.waitFor(login.logInModal, { visible: true });
    await page.waitFor(login.user_email, { visible: true });
    await page.type(login.user_email, process.env.LOGIN_EMAIL);
    await page.waitFor(login.user_password, { visible: true });
    await page.type(login.user_password, process.env.LOGIN_PWD);
    page.on('response', response => {
      if (response.request().method() === 'POST' && response.url() === 'https://ororo.tv/en/users/sign_in.json') {
        expect(response.status()).toEqual(200);
      }
    });
    await page.click(login.submit);
    await page.waitForNavigation();
    await page.screenshot({ path: `screenshots/${login.screenshotName}` });
  });
  it('returns a 401 response code if login credentials are invalid ', async () => {
    await page.click(login.loginButton);
    await page.waitFor(login.logInModal, { visible: true });
    await page.waitFor(login.user_email, { visible: true });
    await page.type(login.user_email, 'abrakadabra@test.com');
    await page.waitFor(login.user_password, { visible: true });
    await page.type(login.user_password, 'abrakadabra');
    page.on('response', response => {
      if (response.request().method() === 'POST' && response.url() === 'https://ororo.tv/en/users/sign_in.json') {
        expect(response.status()).toEqual(401);
      }
    });
    await page.click(login.submit);
    await page.screenshot({ path: `screenshots/${login.screenshotName}` });
  });
  it('returns a 401 response if press "login" button without entering any value', async () => {
    await page.click(login.loginButton);
    await page.waitFor(login.logInModal, { visible: true });
    await page.waitFor(login.user_email, { visible: true });
    await page.waitFor(login.user_password, { visible: true });
    page.on('response', response => {
      if (response.request().method() === 'POST' && response.url() === 'https://ororo.tv/en/users/sign_in.json') {
        expect(response.status()).toEqual(401);
      }
    });
    await page.click(login.submit);
    await page.screenshot({ path: `screenshots/${login.screenshotName}` });
  });
});

