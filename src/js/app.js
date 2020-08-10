// @ts-ignore
var app = new Vue({
    el: '#app',
    data: {
        pageCount: 24,
        pages: [],
        headline: "Ms. Thilo's Library",
        bookTitle: 'Book Title',
        bookAuthor: 'Scott Robertson',
    },
    mounted() {
        // push the pages into the pages array
        for (let i = 0; i < this.pageCount; i++) {
            const page = {
                id: i,
                imgSrc: `//picsum.photos/1920/1080?random=${i}`,
                audioProgress: 0,
                audio: new Howl({ src: ['../_media/ten.mp3'] }),
                audioState: 'pause',
                raf: null,
            };
            this.pages.push(page);

            // setup audio watcher
            page.audio.on('play', () => {
                page.audioState = 'play';
                this.raf = requestAnimationFrame(() =>
                    this.updateProgressBar(page.id)
                );
            });
            page.audio.on('pause', () => {
                page.audioState = 'pause';
                cancelAnimationFrame(page.raf);
            });
        }
    },
    methods: {
        handlePlayClick: function (audio) {
            // pause all active streams
            this.pages.forEach((page) => {
                page.audio.pause();
            });

            // play or pause toggle
            if (audio.playing()) {
                audio.pause();
            } else {
                audio.play();
            }

            // update the progress state
            this.getProgress(audio);
        },
        handleRestartClick: function (id) {
            const page = this.pages[id];
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
            this.pages[i].audioProgress = this.getProgress(i);
            this.raf = requestAnimationFrame(() => this.updateProgressBar(i));
        },
    },
});
