// jest-puppeteer.config.js
module.exports = {
  launch: {
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    dumpio: true,
    headless: false,
    defaultViewport: null,
    slowMo: 100,
    args: ['--start-fullscreen', '--disable-infobars', '--enable-features=NetworkService'],
  },
  // browser: 'chromium',
  browserContext: 'default'
}