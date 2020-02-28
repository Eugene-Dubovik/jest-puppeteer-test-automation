'use strict'

module.exports = class Signup {
    constructor () {
        this.signUpModal = '#signupModal';
        this.user_email = '#signupModal #user_email';
        this.user_password = '#signupModal #user_password';
        this.password_confiramtion = '#signupModal #user_password_confirmation';
        this.submit = '#signupModal input.ui';
        this.signUpButton = "a[data-modal='signup']";
        this.email = `${Math.random().toString(36).substr(2, 5)}@gmail.com`;
        this.screenshotName = `${Math.random().toString(36).substr(2, 5)}\_signup.png`;
    }
}