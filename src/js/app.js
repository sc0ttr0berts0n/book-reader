// @ts-ignore
var app = new Vue({
    el: '#app',
    data: {
        pages: [],
        bigPhotoMode: false,
        isFullscreen: false,
        headline: "Ms. Thilo's Library",
        book: null,
    },
    beforeMount() {
        this.fetchBook();
    },
    methods: {
        async fetchBook() {
            const res = await fetch('./_media/metadata.json');
            const data = await res.json();
            this.book = data;
            this.initBook();
        },
        initBook() {
            // push the pages into the pages array
            for (let i = 0; i < this.book.pageInfo.length; i++) {
                // gather data
                const el = this.book.pageInfo[i];
                const id = el.id ?? i.toString();
                const idPadded = id.padStart(2, '0');
                const pageTitle = el.pageTitle ?? `${idPadded}.jpg`;
                const imgSrc = el.imgSrc ?? `${idPadded}.jpg`;
                const audioSrc = el.audioSrc ?? `${idPadded}.mp3`;

                // build page object
                const page = {
                    num: i,
                    id: idPadded,
                    title: pageTitle,
                    imgSrc: `../_media/${imgSrc}`,
                    audioSrc: `../_media/${audioSrc}`,
                    audio: new Howl({ src: [`../_media/${audioSrc}`] }),
                    audioState: 'pause',
                    audioProgress: 0,
                    hasAudio: () => audio.duration() > 0,
                    raf: null,
                };

                // insert page into page array
                this.pages.push(page);

                // setup audio watcher
                if (page.hasAudio) {
                    page.audio.on('play', () => {
                        page.audioState = 'play';
                        this.raf = requestAnimationFrame(() =>
                            this.updateProgressBar(page.num)
                        );
                    });
                    page.audio.on('pause', () => {
                        page.audioState = 'pause';
                        cancelAnimationFrame(page.raf);
                    });
                    page.audio.on('end', () => {
                        page.audioState = 'pause';
                        page.audioProgress = 1;
                        cancelAnimationFrame(page.raf);
                    });
                }
            }
        },

        handlePlayClick: function (audio) {
            // cache whether its playing
            const wasPlaying = audio.playing();

            // pause all active streams
            this.pages.forEach((page) => {
                page.audio.pause();
            });
            // play or pause toggle
            if (wasPlaying) {
                audio.pause();
            } else {
                audio.play();
            }

            // update the progress state
            this.getProgress(audio);
        },
        handleRestartClick: function (i) {
            const page = this.pages[i];
            page.audio.seek(0);
            page.audioProgress = 0;
        },
        getProgress: function (pageID) {
            const page = this.pages[pageID];
            if (page && page.audio && page.audio.playing()) {
                return page.audio.seek() / page.audio.duration();
            } else if (page) {
                return page.audioProgress;
            } else {
                return 0;
            }
        },
        updateProgressBar: function (i) {
            if (this.pages[i].hasAudio()) {
                this.pages[i].audioProgress = this.getProgress(i);
                this.raf = requestAnimationFrame(() =>
                    this.updateProgressBar(i)
                );
            }
        },
        toggleFullscreen: function (event) {
            var element = document.documentElement;

            if (event instanceof HTMLElement) {
                element = event;
            }

            var isFullscreen =
                document.webkitIsFullScreen || document.mozFullScreen || false;

            element.requestFullScreen =
                element.requestFullScreen ||
                element.webkitRequestFullScreen ||
                element.mozRequestFullScreen ||
                function () {
                    return false;
                };
            document.cancelFullScreen =
                document.cancelFullScreen ||
                document.webkitCancelFullScreen ||
                document.mozCancelFullScreen ||
                function () {
                    return false;
                };

            this.isFullscreen = isFullscreen;

            isFullscreen
                ? document.cancelFullScreen()
                : element.requestFullScreen();
        },
    },
});
