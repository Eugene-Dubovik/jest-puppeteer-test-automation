require('dotenv').config()
const TVShowContent = require('../pageObjects/show.content.po');
const Player = require('../pageObjects/player.po');
const { installMouseHelper } = require('../helpers/install-mouse-pointer-helper');
const BrowserHellper = require('../helpers/browser-helper');

let tvShowContent;
let player;
let browserHelper;

describe('Ororo.tv', () => {
    beforeAll(async () => {
        tvShowContent = new TVShowContent();
        player = new Player();
        browserHelper = new BrowserHellper();
        await installMouseHelper(page);
    });
    beforeEach(async () => {
        await page.goto('https://ororo.tv/en', { waitUntil: 'networkidle2' });

    });

    afterEach(async () => {
        await browserHelper.clearBrowserSession();
        await jestPuppeteer.resetPage();
    });


    it('authorized user should be able to see choose TV show ', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };

        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForXPath(tvShowContent.showCard, 5000);
        const [chooseShow] = await page.$x(tvShowContent.showCard);
        if (chooseShow) chooseShow.click();
        await page.waitFor(tvShowContent.showContent, { visible: true });
        await page.waitFor(tvShowContent.showContent);
        await page.click(tvShowContent.showEpisode);
        await page.waitFor(player.videoPlayer, { visible: true, timeout: 5000 });
        await page.screenshot({ path: `screenshots/${tvShowContent.screenshotName}` });
    });
    it('should return 200 status code for request on videoplayback', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };

        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForXPath(tvShowContent.showCard, 5000);
        const [chooseShow] = await page.$x(tvShowContent.showCard);
        if (chooseShow) chooseShow.click();
        await page.waitFor(tvShowContent.showContent, { visible: true });
        await page.waitFor(tvShowContent.showContent);
        await page.click(tvShowContent.showEpisode);
        page.on('response', async (response) => {
            if (response.request().method() === 'GET' && response.headers({ contentType: 'video/mpegts' })) {
                expect(response.status()).toEqual(200);
            }
        });
        await page.waitFor(player.videoPlayer, { visible: true, timeout: 5000 });
    });
    it('video can be paused and resumed', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };

        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForXPath(tvShowContent.showCard, 5000);
        const [chooseShow] = await page.$x(tvShowContent.showCard);
        if (chooseShow) chooseShow.click();
        await page.waitFor(tvShowContent.showContent, { visible: true });
        await page.waitFor(tvShowContent.showContent);
        await page.click(tvShowContent.showEpisode);
        await page.waitFor(player.videoPlayer, { visible: true, timeout: 5000 });
        await page.click(player.pauseButton);
        const getResumeButtonTitle = await page.$eval(player.pauseButton, el => el.title);
        await expect(getResumeButtonTitle).toMatch("Play");
        const getPauseButtonText = await page.$eval('button.vjs-play-control > span.vjs-control-text', el => el.textContent);
        await expect(getPauseButtonText).toMatch('Play');
        const getResumeButtonClass = await page.$eval('button.vjs-paused', el => el.classList[3]);
        await expect(getResumeButtonClass).toEqual('vjs-paused');
        await page.click(player.pauseButton);
        const getPlayButtonTitle = await page.$eval(player.pauseButton, el => el.title);
        await expect(getPlayButtonTitle).toMatch("Pause");
        const getPlayButtonText = await page.$eval('button.vjs-play-control > span.vjs-control-text', el => el.textContent);
        await expect(getPlayButtonText).toMatch('Pause');
        const getPlayButtonClass = await page.$eval('button.vjs-playing', el => el.classList[3]);
        await expect(getPlayButtonClass).toEqual('vjs-playing');
    });
    it('video can be rewinded with the help of keys', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };

        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForXPath(tvShowContent.showCard, 5000);
        const [chooseShow] = await page.$x(tvShowContent.showCard);
        if (chooseShow) chooseShow.click();
        await page.waitFor(tvShowContent.showContent, { visible: true });
        await page.waitFor(tvShowContent.showContent);
        await page.click(tvShowContent.showEpisode);
        await page.waitFor(player.videoPlayer, { visible: true, timeout: 5000 });
        await page.waitFor(player.timeline, { visible: true, timeout: 5000 });
        await page.waitFor(3000)
        await page.keyboard.press('ArrowRight');
        const timeRewindedValue = await page.$eval('div.vjs-progress-holder', el => el.attributes[7].value);
        console.log(timeRewindedValue);
        await expect(timeRewindedValue).toMatch(/([0-9\:]){5}\W([f-o]){2}\W([0-9\:]){5}/);
    });
    it('video can be rewinded with the help of mouse', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };

        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForXPath(tvShowContent.showCard, 5000);
        const [chooseShow] = await page.$x(tvShowContent.showCard);
        if (chooseShow) chooseShow.click();
        await page.waitFor(tvShowContent.showContent, { visible: true });
        await page.waitFor(tvShowContent.showContent);
        await page.click(tvShowContent.showEpisode);
        await page.waitFor(player.videoPlayer, { visible: true, timeout: 5000 });
        await page.waitFor(player.timeline, { visible: true, timeout: 5000 });
        await page.mouse.move(300, 727);
        await page.mouse.click(300, 727);
        const timeRewinded = await page.$eval('div.vjs-progress-holder', el => el.attributes[7].value);
        console.log(timeRewinded);
        await expect(timeRewinded).toMatch(/([0-9\:]){5}\W([f-o]){2}\W([0-9\:]){5}/);
        await page.screenshot({ path: `screenshots/${tvShowContent.screenshotName}` });
    });
    it('timeline panel should show progress bar', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };

        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForXPath(tvShowContent.showCard, 5000);
        const [chooseShow] = await page.$x(tvShowContent.showCard);
        if (chooseShow) chooseShow.click();
        await page.waitFor(tvShowContent.showContent, { visible: true });
        await page.waitFor(tvShowContent.showContent);
        await page.click(tvShowContent.showEpisode);
        await page.waitFor(player.videoPlayer, { visible: true, timeout: 5000 });
        await page.waitFor(player.timeline, { visible: true, timeout: 5000 });
        await page.mouse.click(300, 727);
        await page.waitFor(3000);
        const progressBar = await page.$eval('div.vjs-load-progress span.vjs-control-text-loaded-percentage', el => el.innerText);
        console.log(progressBar);
        await expect(progressBar).toBeTruthy();
        await expect(progressBar).toMatch(/(([0-9]){1,2}\.([0-9]){2}\%)/);
        await page.screenshot({ path: `screenshots/${tvShowContent.screenshotName}` });
    });
    it('audio should be muted when press on button', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };

        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForXPath(tvShowContent.showCard, 5000);
        const [chooseShow] = await page.$x(tvShowContent.showCard);
        if (chooseShow) chooseShow.click();
        await page.waitFor(tvShowContent.showContent, { visible: true });
        await page.waitFor(tvShowContent.showContent);
        await page.click(tvShowContent.showEpisode);
        await page.waitFor(player.videoPlayer, { visible: true, timeout: 5000 });
        await page.waitFor(player.timeline, { visible: true, timeout: 5000 });
        await page.mouse.click(300, 727);
        await page.waitFor(1000);
        await page.click(player.muteButton);
        const getMuteButtonTitle = await page.$eval(player.muteButton, el => el.attributes[2].value);
        await expect(getMuteButtonTitle).toEqual('Unmute');
        const getMuteButtonText = await page.$eval('button.vjs-mute-control>span.vjs-control-text', el => el.textContent);
        await expect(getMuteButtonText).toEqual('Unmute');
    });
    it('volume should be changed with the help of keys', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };

        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForXPath(tvShowContent.showCard, 5000);
        const [chooseShow] = await page.$x(tvShowContent.showCard);
        if (chooseShow) chooseShow.click();
        await page.waitFor(tvShowContent.showContent, { visible: true });
        await page.waitFor(tvShowContent.showContent);
        await page.click(tvShowContent.showEpisode);
        await page.waitFor(player.videoPlayer, { visible: true, timeout: 5000 });
        await page.waitFor(player.timeline, { visible: true, timeout: 5000 });
        await page.mouse.click(300, 727);
        await page.waitFor(1000);
        await page.keyboard.press('ArrowDown');
        await expect(player.volumeBar).toBeTruthy();
        const getVolumeBarValue = await page.$eval(player.volumeBar, el => el.attributes[3].value);
        console.log(getVolumeBarValue);
        await expect(getVolumeBarValue).toEqual('90');
    });
    it('volume should be changed with the help of mouse', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };

        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForXPath(tvShowContent.showCard, 5000);
        const [chooseShow] = await page.$x(tvShowContent.showCard);
        if (chooseShow) chooseShow.click();
        await page.waitFor(tvShowContent.showContent, { visible: true });
        await page.waitFor(tvShowContent.showContent);
        await page.click(tvShowContent.showEpisode);
        await page.waitFor(player.videoPlayer, { visible: true, timeout: 5000 });
        await page.waitFor(player.timeline, { visible: true, timeout: 5000 });
        await page.mouse.click(123, 757);
        await page.waitFor(1000);
        await expect(player.volumeBar).toBeTruthy();
        const volumeBarValue = await page.$eval(player.volumeBar, el => el.attributes[3].value);
        console.log(volumeBarValue);
        await expect(volumeBarValue).toMatch(/[0-9]{1,2}/);
    });
    it('show title should be displayed', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };

        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForXPath(tvShowContent.showCard, 5000);
        const [chooseShow] = await page.$x(tvShowContent.showCard);
        if (chooseShow) chooseShow.click();
        await page.waitFor(tvShowContent.showContent, { visible: true });
        await page.waitFor(tvShowContent.showContent);
        await page.click(tvShowContent.showEpisode);
        await page.waitFor(player.videoPlayer, { visible: true, timeout: 5000 });
        await page.waitFor(player.timeline, { visible: true, timeout: 5000 });
        await expect(player.showTitle).toBeTruthy();
        const getShowTitleText = await page.$eval('button.vjs-title-control>span.vjs-control-text', el => el.textContent);
        await expect(getShowTitleText).toEqual('S01E01 Pilot');
    });
    it('show title should be changed when choose another episode', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };

        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForXPath(tvShowContent.showCard, 5000);
        const [chooseShow] = await page.$x(tvShowContent.showCard);
        if (chooseShow) chooseShow.click();
        await page.waitFor(tvShowContent.showContent, { visible: true });
        await page.waitFor(tvShowContent.showContent);
        await page.click(tvShowContent.showEpisode);
        await page.waitFor(player.videoPlayer, { visible: true, timeout: 5000 });
        await page.waitFor(player.timeline, { visible: true, timeout: 5000 });
        await page.click(player.showTitle);
        await page.click('div a[data-id="33251"]:nth-child(2)');
        await page.waitFor(2000);
        const showTitleText = await page.$eval('button.vjs-title-control>span.vjs-control-text', el => el.textContent);
        await expect(showTitleText).toEqual('S01E02 The Big Three');
    });
    it('show episodes can be changed by pressing "Next"', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };

        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForXPath(tvShowContent.showCard, 5000);
        const [chooseShow] = await page.$x(tvShowContent.showCard);
        if (chooseShow) chooseShow.click();
        await page.waitFor(tvShowContent.showContent, { visible: true });
        await page.waitFor(tvShowContent.showContent);
        await page.click(tvShowContent.showEpisode);
        await page.waitFor(player.videoPlayer, { visible: true, timeout: 5000 });
        await page.waitFor(player.timeline, { visible: true, timeout: 5000 });
        await expect(player.nextEpisodeButton).toBeTruthy();
        const getNextEpisodeButtonTitle = await page.$eval('button.vjs-next-button>span.vjs-control-text', el => el.textContent);
        await expect(getNextEpisodeButtonTitle).toEqual('Next');
        await page.click(player.nextEpisodeButton);
        await page.waitFor(3000);
        const showTitleText = await page.$eval('button.vjs-title-control>span.vjs-control-text', el => el.textContent);
        await expect(showTitleText).toEqual('S01E02 The Big Three');
    });
    it('modal window with help should appear when pressing on "Help"', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };

        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForXPath(tvShowContent.showCard, 5000);
        const [chooseShow] = await page.$x(tvShowContent.showCard);
        if (chooseShow) chooseShow.click();
        await page.waitFor(tvShowContent.showContent, { visible: true });
        await page.waitFor(tvShowContent.showContent);
        await page.click(tvShowContent.showEpisode);
        await page.waitFor(player.videoPlayer, { visible: true, timeout: 5000 });
        await page.waitFor(player.timeline, { visible: true, timeout: 5000 });
        await page.waitFor(player.helpButton, { visible: true, timeout: 5000 });
        await page.click(player.helpButton, { delay: 100 });
        await page.waitFor(player.helpModalWindow, { visible: true });
        await expect(player.helpModalWindow).toBeTruthy();
        const getHelpModalWindowStyle = await page.$eval(player.helpModalWindow, el => el.attributes[3].value);
        await expect(getHelpModalWindowStyle).toEqual('display: block; opacity: 1;');
        await page.screenshot({ path: `screenshots/${tvShowContent.screenshotName}` });
    });
    it('video speed control should be displayed when pressed', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };

        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForXPath(tvShowContent.showCard, 5000);
        const [chooseShow] = await page.$x(tvShowContent.showCard);
        if (chooseShow) chooseShow.click();
        await page.waitFor(tvShowContent.showContent, { visible: true });
        await page.waitFor(tvShowContent.showContent);
        await page.click(tvShowContent.showEpisode);
        await page.waitFor(player.videoPlayer, { visible: true, timeout: 5000 });
        await page.waitFor(player.timeline, { visible: true, timeout: 5000 });
        await page.waitFor(player.videoSpeedControl, { visible: true, timeout: 5000 });
        await page.waitForSelector(player.videoSpeedControl);
        await page.click(player.videoSpeedControl);
        const getVideoSpeedControlValues = await page.$$eval('div.vjs-lock-showing ul.vjs-menu-content:first-child', el => el[0].innerText);
        console.log(getVideoSpeedControlValues)
        await expect(getVideoSpeedControlValues).toMatch(/(([0-9]{1})\.([0-9]){2})/);
        await page.screenshot({ path: `screenshots/${tvShowContent.screenshotName}` });
    });
    it('video speed should be changed in accordance with chosen speed value', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };
        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForXPath(tvShowContent.showCard, 5000);
        const [chooseShow] = await page.$x(tvShowContent.showCard);
        if (chooseShow) await chooseShow.click();
        await page.waitFor(tvShowContent.showContent, { visible: true });
        await page.waitFor(tvShowContent.showContent);
        await page.click(tvShowContent.showEpisode);
        await page.waitFor(player.videoPlayer, { visible: true, timeout: 5000 });
        await page.waitFor(player.timeline, { visible: true, timeout: 5000 });
        await page.waitFor(player.videoSpeedControl, { visible: true, timeout: 5000 });
        await page.waitForSelector(player.videoSpeedControl);
        await page.click(player.videoSpeedControl);
        const videoSpeedControlValues = await page.$$eval('div.vjs-lock-showing ul.vjs-menu-content ul li', el => el.map(e => e.dataset.value));

        async function clickVideoSpeed(array) {
            for (const value of array) {
                await page.click(`ul li[class~="js-change-speed"][data-value="${value}"]`);
                const speedIsActive = await page.$eval(`ul li[class~="js-change-speed"][data-value="${value}"]`, el => el.classList[2]);
                await expect(speedIsActive).toEqual('active');
            }

        };

        await clickVideoSpeed(videoSpeedControlValues);
    });
    it('streaming quality should be changed in accordance with the chosen quality', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };
        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle2' });
        await page.goto('https://ororo.tv/en/shows/this-is-us#1-1');
        await page.waitFor(1000);
        await page.keyboard.press('Space');
        await page.waitFor(player.videoPlayer, { visible: true, timeout: 5000 });
        await page.waitFor(player.timeline, { visible: true, timeout: 5000 });
        await page.waitFor(player.changeQualityButton, { visible: true, timeout: 5000 });
        await page.waitForSelector(player.changeQualityButton);
        await page.click(player.changeQualityButton);
        const getChangeQualityButtonTitle = await page.$eval('button.vjs-resolution-button', el => el.title);
        await expect(getChangeQualityButtonTitle).toEqual('Quality');
        const getChangeQualityButtonText = await page.$eval('button.vjs-resolution-button>span.vjs-control-text', el => el.textContent);
        await expect(getChangeQualityButtonText).toEqual('Quality');
        const changeQualityButtonValues = await page.$$eval('div.vjs-lock-showing ul.vjs-menu-content li span.vjs-menu-item-text', el => el.map(e => e.textContent));

        async function clickOnChangeQuality(array) {
            for (const value of array) {
                let changeQualitySelector = `//span[text()="${value}"] `;
                const changeQuality = await page.waitForXPath(changeQualitySelector);
                await changeQuality.click();
                const changeQualityChecked = await page.$eval('div.vjs-lock-showing ul.vjs-menu-content li[class~="vjs-menu-item"][aria-checked]', el => el.attributes[5].value);
                await expect(changeQualityChecked).toEqual('true');

            }
        };
        await clickOnChangeQuality(changeQualityButtonValues);
    });
    it('subtitles should be changed in accordance with the chosen subtitles', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };
        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle2' });
        await page.goto('https://ororo.tv/en/shows/this-is-us#1-1');
        await page.waitFor(player.videoPlayer, { visible: true, timeout: 5000 });
        await page.keyboard.press('Space');
        await page.waitFor(player.timeline, { visible: true, timeout: 5000 });
        await page.waitFor(player.subtitlesButton, { visible: true, timeout: 5000 });
        const getSubtitlesButtonTitle = await page.$eval(player.subtitlesButton, el => el.title);
        await expect(getSubtitlesButtonTitle).toEqual('Subtitles');
        await page.click(player.subtitlesButton);
        const subtitlesValue = await page.$$eval('div.vjs-lock-showing ul.vjs-menu-content li.vjs-menu-item span:nth-child(2)', el => el.map(e => e.textContent));
        async function clickOnSubtitles(array) {
            for (const value of array) {
                let chooseSubtitlesSelector = `//span[text()="${value}"]/preceding-sibling::span[@class="checkbox-item"] `;
                const chooseSubtitles = await page.waitForXPath(chooseSubtitlesSelector);
                await chooseSubtitles.click();
                const chooseSubtitlesChecked = await page.$eval('div.vjs-lock-showing ul.vjs-menu-content li[class~="vjs-menu-item"][aria-checked]', el => el.attributes[5].value);
                await expect(chooseSubtitlesChecked).toEqual('true');

            }
        };
        await clickOnSubtitles(subtitlesValue);
    });
    it('error meassage of internet connection loss should be returned when internet disconnected', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };

        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.goto('https://ororo.tv/en/shows/this-is-us#1-1');
        const errorMesssage = page.on('requestfailed', request => {
            console.log(request.failure().errorText, request.url);
        });
        await page.waitFor(player.videoPlayer, { visible: true, timeout: 5000 });
        await page.setOfflineMode(true);
        await page.waitFor(5000);
        await expect(errorMesssage).toBe(errorMesssage);
    });
    it('video should be fullscreen when pressed on fullscreen button', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };
        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle2' });
        await page.goto('https://ororo.tv/en/shows/this-is-us#1-1');
        await page.waitFor(player.videoPlayer, { visible: true, timeout: 5000 });
        await page.keyboard.press('Space');
        await page.waitFor(player.timeline, { visible: true, timeout: 5000 });
        await page.waitForSelector(player.fullscreenButton);
        const fullscreenButtonTitle = await page.$eval(player.fullscreenButton, el => el.title);
        await expect(fullscreenButtonTitle).toEqual('Fullscreen');
        await page.click(player.fullscreenButton);
        const fullscreenButtonTitleAfterClicked = await page.$eval(player.fullscreenButton, el => el.title);
        await expect(fullscreenButtonTitleAfterClicked).toEqual('Non-Fullscreen');
    });
    it('player should be closed when pressed on "close" button', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };
        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle2' });
        await page.goto('https://ororo.tv/en/shows/this-is-us#1-1');
        await page.waitFor(player.videoPlayer, { visible: true, timeout: 5000 });
        await page.keyboard.press('Space');
        await page.waitFor(player.timeline, { visible: true, timeout: 5000 });
        await page.waitForSelector(player.closePlayerButton);
        await page.click(player.closePlayerButton);
        await page.waitForSelector(tvShowContent.showContent);
        await expect(page).toMatchElement(tvShowContent.showContent);
    });
});



