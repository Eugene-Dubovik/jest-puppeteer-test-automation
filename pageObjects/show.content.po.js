'use strict'

module.exports = class TVShowContent {
    constructor() {
        this.showContent = 'div.show-content';
        this.showEpisode = 'a[href="#1-1"]';
        this.showCard = '//img[@alt="This Is Us"]/parent ::a[@class="card-image"]'
        this.screenshotName = `${Math.random().toString(36).substr(2, 5)}\_player.png`;

    }
}