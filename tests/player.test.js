require('dotenv').config()
const TVShowContent = require('../pageObjects/show.content.po');
const Player = require('../pageObjects/player.po');
const { installMouseHelper } = require('../helpers/install-mouse-pointer-helper');

let tvShowContent;
let player;

describe('Ororo.tv', () => {
    beforeAll(async () => {
        tvShowContent = new TVShowContent();
        player = new Player();
        await installMouseHelper(page);
        // await page.goto('https://ororo.tv/en', { waitUntil: 'networkidle2' });
    });
    beforeEach(async () => {
        await page.goto('https://ororo.tv/en', { waitUntil: 'networkidle2' });
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
        await page.waitFor(1000);
        const progressBar = await page.$eval('div.vjs-load-progress', el => el.attributes.style.value);
        console.log(progressBar);
        await expect(progressBar).toBeTruthy();
        await expect(progressBar).toMatch(/(([0-9]){2}\.([0-9]){2}\%\;)/);
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
        const getMuteButtonText = await page.$eval('button.vjs-vol-3>span.vjs-control-text', el => el.textContent);
        await expect(getMuteButtonText).toEqual('Pause');
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
        await page.waitFor(1000);
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
        await page.click(player.helpButton);
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
        await page.waitFor(player.helpButton, { visible: true, timeout: 5000 });
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
        await page.waitFor(player.helpButton, { visible: true, timeout: 5000 });
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


    })

});



