'use strict'

module.exports = class Player {
    constructor() {
        this.videoPlayer = '#ororo-video_html5_api';
        this.pauseButton = 'button.vjs-play-control';
        this.timeline = 'div.vjs-progress-holder';
        this.muteButton = 'button.vjs-mute-control';
        this.volumeBar = 'div.vjs-volume-bar';
        this.showTitle = 'button.vjs-title-control';
        this.nextEpisodeButton = 'button.vjs-next-button';
        this.helpButton = 'button.vjs-help-button';
        this.helpModalWindow = '#player-help';
        this.videoSpeedControl = 'button.vjs-play-speed-control';
        this.changeQualityButton = 'button.vjs-resolution-button';
        this.subtitlesButton = 'button.vjs-subtitles-button';
        this.fullscreenButton = 'button.vjs-fullscreen-control';
        this.closePlayerButton = 'a.video-close-button';
    }
    
}

