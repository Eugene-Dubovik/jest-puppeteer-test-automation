module.exports = class BrowserHelper {
    
    constructor() {

    }

    async clearBrowserCookies() {
        const client = await page.target().createCDPSession();
        await client.send('Network.clearBrowserCookies');
    }

    async clearBrowserCache() {
        const client = await page.target().createCDPSession();
        await client.send('Network.clearBrowserCache');
    }

    async clearBrowserSession() {
        const client = await page.target().createCDPSession();
        await client.send('Network.clearBrowserCookies');
        await client.send('Network.clearBrowserCache');
    }

}