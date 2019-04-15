import crypto from 'crypto'

export function generateId () {
  return crypto.randomBytes(20).toString('hex')
}

export function ArtObject () {
  return {
    isFavorite: false,  // if the artwork is favorited
    source: '',         // the name of the museum it was sourced from
    href: '',           // a link to the page featuring artwork info
    title: '',          // artwork name
    author: '',         // author name
    src: '',            // artowrk remote image source
    filepath: '',       // local file path
    filename: ''        // file name
  }
}
