import { Readable, Transform } from 'stream'

/**
 * Beautifies a LaTeX document.
 *
 * @param src
 * The LaTeX document.
 */
declare function beautify(src: Readable | string) : Transform

export default beautify
