// @ts-ignore
var app = new Vue({
  el: "#app",
  data: {
    books: [],
    selectedBookIdx: 0,
    pageCount: 25,
    headline: "Ms. Thilo's Library",
    pages: [],
  },
  mounted: function () {
    window.addEventListener("hashchange", this.updateSelectedBookIdx);

    fetch("books.json")
      .then((response) => response.json())
      .then((json) => {
        this.books = json.books;
      });

    //Update based on Hash
    this.updateSelectedBookIdx();
  },
  methods: {
    updateSelectedBookIdx: function () {
      const idx = parseInt(document.location.hash.split("/")[1]);
      this.selectedBookIdx = idx;
    },
    updatePageState: function () {
      if (!this.books || this.books.length <= 0) {
        this.pages = [];
        return;
      }

      let pages = [];

      const toPageState = (page) => {
        const audio = new Howl({ src: [`../_media/${page.audio}`] });
        return {
          num: page.num,
          id: page.id,
          audio: audio,
          imgSrc: `../_media/${page.imgSrc}`,
          audioProgress: 0,
          audioState: "pause",
          hasAudio: () => audio.duration() > 0,
          raf: null,
        };
      };

      const setupAudioWatcher = (page) => {
        if (page.hasAudio) {
          page.audio.on("play", () => {
            page.audioState = "play";
            this.raf = requestAnimationFrame(() =>
              this.updateProgressBar(page.num)
            );
          });
          page.audio.on("pause", () => {
            page.audioState = "pause";
            cancelAnimationFrame(page.raf);
          });
          page.audio.on("end", () => {
            page.audioState = "pause";
            page.audioProgress = 1;
            cancelAnimationFrame(page.raf);
          });
        }
      };

      pages = this.books[this.selectedBookIdx].pages.map(toPageState);

      // setup audio watcher
      pages.forEach(setupAudioWatcher);
      this.pages = pages;
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
        this.raf = requestAnimationFrame(() => this.updateProgressBar(i));
      }
    },
  },
  computed: {
    bookTitle() {
      return this.books && this.books.length > 0
        ? this.books[this.selectedBookIdx].bookTitle
        : "";
    },
    bookAuthor() {
      return this.books && this.books.length > 0
        ? this.books[this.selectedBookIdx].bookAuthor
        : "";
    },
  },
  watch: {
    books: function (newBooks) {
      this.updatePageState();
    },
    selectedBookIdx: function (newIdx) {
      window.location.replace(`#/${newIdx}`);
      this.updatePageState();
    },
  },
});
