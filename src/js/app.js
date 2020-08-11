// @ts-ignore
var app = new Vue({
    el: '#app',
    data: {
        pageCount: 25,
        pages: [],
        headline: "Ms. Thilo's Library",
        bookTitle: 'Amos & Boris',
        bookAuthor: 'William Steig',
    },
    mounted: function () {
        this.$nextTick(function () {
            // push the pages into the pages array
            for (let i = 0; i < this.pageCount; i++) {
                const id = i.toString(10).padStart(2, '0');
                const audio = new Howl({ src: [`../_media/${id}.mp3`] });
                const page = {
                    num: i,
                    id: id,
                    imgSrc: `../_media/${id}.jpg`,
                    audioProgress: 0,
                    audio: audio,
                    audioState: 'pause',
                    hasAudio: () => audio.duration() > 0,
                    raf: null,
                };
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
        });
    },
    methods: {
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
    },
});
