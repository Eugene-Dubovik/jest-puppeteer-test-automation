require('dotenv').config()

const Login = require('../pageObjects/login.po');

let login;

describe('Ororo.tv', () => {
    beforeAll(async () => {
        login = new Login();
        await page.goto('https://ororo.tv/en', { waitUntil: 'networkidle2' });
    })

    it('should login into account', async () => {
        await page.click(login.loginButton);
        await page.waitFor(login.logInModal, { visible: true });
        await page.waitFor(login.user_email, { visible: true });
        await page.type(login.user_email, process.env.LOGIN_EMAIL);
        await page.waitFor(login.user_password, { visible: true });
        await page.type(login.user_password, process.env.LOGIN_PWD);
        await page.click(login.submit);
        await page.waitForNavigation();
        await page.screenshot({ path: `screenshots/${login.screenshotName}` });
    })
});

