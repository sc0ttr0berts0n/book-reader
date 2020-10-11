# Book Reader

A small utility I made to help pair voiceover recordings with pages of a book.

## How to use

### Media FIles

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

### The Metadata File

```json
{
    "title": "Title of the Book",
    "author": "Author of the Book",
    "pageInfo": [
        { "id": "0", "pageTitle": "Front Cover" },
        { "id": "1", "pageTitle": "Pages 1 and 2" }
    ]
}
```

#### `pageInfo` keys

| Key         | Optional | Description                                               |
| ----------- | -------- | --------------------------------------------------------- |
| `id`        | No       | Unique number, used for human reference                   |
| `pageTitle` | No       | The label that will appear above the page                 |
| `imgSrc`    | Yes      | Defaults to `${arrayKeyIndex}.jpg`, use this to override. |
| `audioSrc`  | Yes      | Defaults to `${arrayKeyIndex}.mp3`, use this to override. |
