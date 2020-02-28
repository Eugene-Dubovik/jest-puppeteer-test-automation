require('dotenv').config()

const Login = require('../pageObjects/login.po');
const Signup = require('../pageObjects/signup.po');

let login;
let signup;

describe('Ororo.tv', () => {
    beforeAll(async () => {
        login = new Login();
        signup = new Signup();
        await page.goto('https://ororo.tv/en', { waitUntil: 'domcontentloaded' });
    })

    it('should display "Fun way to learn English!"', async () => {
        await expect(page).toMatch('Fun way to learn English!')
    });
    it('should display videos', async () => {
        await page.click('a.menu-link');
        await expect(page).toMatchElement('.media-list');
    });
    it('should create an account', async () => {
        await page.click(login.loginButton);
        await page.waitFor(login.logInModal, { visible: true });
        await page.click(signup.signUpButton);
        await page.waitFor(signup.signUpModal, { visible: true });
        await page.waitFor(signup.user_email, { visible: true });
        await page.type(signup.user_email, signup.email);
        await page.waitFor(signup.user_password, { visible: true });
        await page.type(signup.user_password, process.env.SIGNUP_PWD);
        await page.waitFor(signup.password_confiramtion, { visible: true });
        await page.type(signup.password_confiramtion, process.env.SIGNUP_PWD);
        await page.click(signup.submit);
        await page.waitForResponse('https://ororo.tv/en/users.json');
        await page.screenshot({ path: `screenshots/${signup.screenshotName}` });
    });

})