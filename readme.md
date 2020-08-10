# Book Reader
A small utility I made to help pair voiceover recordings with pages of a book.

## How to use
In the `public/_media` directory, upload a `.jpg` and a `.mp3` in the following format:
```sh
01.jpg
01.mp3
02.jpg
02.mp3
...
28.jpg
28.mp3
```

The update the metadata in `app.js` for your current book. This includes `pageCount`, `bookTitle`, `authorTitle`, etc. Note: `pages` is empty at the start and is automatically generated.
