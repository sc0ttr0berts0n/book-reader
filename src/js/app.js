// @ts-ignore
var app = new Vue({
    el: '#app',
    data: {
        pages: [],
        pageCount: 25,
        headline: "Ms. Thilo's Library",
        bookTitle: 'Amos & Boris',
        bookAuthor: 'William Steig',
        pageTitleMap: {
            '0': 'Front Cover',
            '1': 'Page 1',
            '2': 'Page 2',
            '3': 'Page 3',
            '4': 'Page 4',
            '5': 'Page 5',
            '6': 'Pages 6-7',
            '7': 'Page 8',
            '8': 'Page 9',
            '9': 'Page 10',
            '10': 'Page 11',
            '11': 'Pages 12-13',
            '12': 'Page 14',
            '13': 'Page 15',
            '14': 'Page 16',
            '15': 'Page 17',
            '16': 'Page 18',
            '17': 'Page 19',
            '18': 'Pages 20-21',
            '19': 'Page 22',
            '20': 'Page 23',
            '21': 'Pages 24-25',
            '22': 'Page 26',
            '23': 'Page 27',
            '24': 'Page 28',
        },
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
                    title: this.pageTitleMap[i],
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
