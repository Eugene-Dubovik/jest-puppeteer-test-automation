require('dotenv').config()

describe('Ororo.tv', () => {
    beforeAll(async () => {
        await page.goto('https://ororo.tv/en', { waitUntil: 'networkidle2' });
    });

    it('authorized user should be able to see choose TV show ', async () => {
        const cookieObject = {
            name: process.env.COOKIE_NAME,
            value: process.env.COOKIE_VALUE
        };
        
        const screenshotName = `${Math.random().toString(36).substr(2, 5)}\_player.png`;
        await page.setCookie(cookieObject);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForXPath('//img[@alt="This Is Us"]/parent ::a[@class="card-image"]', 5000);
        const [chooseShow] = await page.$x('//img[@alt="This Is Us"]/parent ::a[@class="card-image"]');
        if (chooseShow) chooseShow.click();
        await page.waitFor('div.show-content', { visible: true });
        await page.waitFor('a[href="#1-1"]');
        await page.click('a[href="#1-1"]');
        await page.waitFor('#ororo-video_html5_api', { visible: true, timeout:5000 });
        await page.screenshot({ path: `screenshots/${screenshotName}` });
    })
});


