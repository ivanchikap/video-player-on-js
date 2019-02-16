class VideoPlayer {
    constructor(settings) {
        this._settings = Object.assign(VideoPlayer.DefaultSettings, settings);
    }

    init() {
        if (!this._settings.videoUrl) return console.error('Provide video Url');
        if (!this._settings.videoPlayerContainer) return console.error('Please provide video player container');

        // Создаем разметку для video
        this._addTemplate();
        // Найти все элементы управления
        this._setElements();
        // Установить обработчики событий
        this._setEvents();
    }

    toggle() {
        const method = this._video.paused ? 'play' : 'pause';
        this._toggleBtn.textContent = this._video.paused ? '❚ ❚' :  '►';
        this._video[method]();
    }

    _videoProgressHandler() {
        const percent = (this._video.currentTime / this._video.duration) * 100;
        this._progress.style.flexBasis = `${percent}%`;
    }

    _rewind(event) {
        this._video.currentTime = (event.offsetX / this._progressContainer.offsetWidth) * this._video.duration;
    }

    _skipPrev() {
        console.log(this._video.currentTime);
        this._video.currentTime += parseInt(this._skipPrevElem.dataset.skip);

        console.log(this._video.currentTime);
    }
    _skipNext() {
        this._video.currentTime +=  parseInt(this._skipNextElem.dataset.skip);
    }

    _setVolume() {
        this._video.volume = parseFloat(this._volumeInput.value);
    }

    _setPlaybackRate() {
        this._video.playbackRate = parseFloat(this._playbackRateInput.value);
    }

    _rewindByDblClick(event) {
        if (event.offsetX < this._progressContainer.offsetWidth/2) {
            this._video.currentTime += parseInt(this._skipPrevElem.dataset.skip);
        } else {
            this._video.currentTime += parseInt(this._skipNextElem.dataset.skip);
        }
    }


    _addTemplate() {
        const template = this._createVideoTemplate();
        const container = document.querySelector(this._settings.videoPlayerContainer);
        container ? container.insertAdjacentHTML('afterbegin', template) : console.error('Video container was not found');
    }

    _setElements() {
        this._videoContainer = document.querySelector(this._settings.videoPlayerContainer);
        this._video = this._videoContainer.querySelector('video');
        this._toggleBtn = this._videoContainer.querySelector('.toggle');
        this._progress = this._videoContainer.querySelector('.progress__filled');
        this._progressContainer = this._videoContainer.querySelector('.progress');
        this._skipPrevElem = this._videoContainer.querySelector('#skipPrev');
        this._skipNextElem = this._videoContainer.querySelector('#skipNext');
        this._volumeInput = this._videoContainer.querySelector('.player__slider');
        this._playbackRateInput = this._videoContainer.querySelector('.player__slider--playbackRate');
    }

    _setEvents() {
        this._video.addEventListener('click', () => this.toggle());
        this._toggleBtn.addEventListener('click', () => this.toggle());
        this._video.addEventListener('timeupdate', () => this._videoProgressHandler());
        this._progressContainer.addEventListener('click', (e) => this._rewind(e));
        this._skipPrevElem.addEventListener('click', () => this._skipPrev());
        this._skipNextElem.addEventListener('click', () => this._skipNext());
        this._volumeInput.addEventListener('click', () => this._setVolume());
        this._playbackRateInput.addEventListener('click', () => this._setPlaybackRate());
        this._video.addEventListener('dblclick', (e) => this._rewindByDblClick(e));
    }

    _createVideoTemplate() {
        return `
        <div class="player">
            <video class="player__video viewer" src="${this._settings.videoUrl}"> </video>
            <div class="player__controls">
              <div class="progress">
              <div class="progress__filled"></div>
              </div>
              <button class="player__button toggle" title="Toggle Play">►</button>
              <input type="range" name="volume" class="player__slider" min=0 max="1" step="0.05" value="${this._settings.volume}">
              <input type="range" name="playbackRate" class="player__slider player__slider--playbackRate" min="0.5" max="2" step="0.1" value="1">
              <button data-skip="${this._settings.skipPrev}" class="player__button" id="skipPrev">« ${this._settings.skipPrev}s</button>
              <button data-skip="${this._settings.skipNext}" class="player__button" id="skipNext">${this._settings.skipNext}s »</button>
            </div>
      </div>
        `;
    }

    static get DefaultSettings() {
        return {
            videoUrl: '',
            videoPlayerContainer: 'body',
            volume: 1,
            skipPrev: -2,
            skipNext: 1
        }
    }
}


const playerInstance = new VideoPlayer({
    videoUrl: 'video/mov_bbb.mp4'
});

playerInstance.init();
