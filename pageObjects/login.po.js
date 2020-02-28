'use strict'

module.exports = class Login {
    constructor() {
        this.logInModal = '#loginModal';
        this.user_email = '#loginModal #user_email';
        this.user_password = '#loginModal #user_password';
        this.submit = '#loginModal input.ui';
        this.loginButton = '.login';
        this.screenshotName = `${Math.random().toString(36).substr(2, 5)}\_login.png`;
    }
} 