# pretty-latex
A Node wrapper around [latexindent](https://github.com/cmhughes/latexindent.pl) for beautifying LaTeX documents.


## Installation
```
yarn add pretty-latex
```
or

```
npm install pretty-latex
```

You will also need to make sure you have [latexindent](https://www.ctan.org/pkg/latexindent?lang=en) installed on your system.

## Usage
```js
const fs = require('fs')
const beautify = require('pretty-latex')

const input = fs.createReadStream('input.tex')
const output = fs.createWriteStream('output.tex')

beautify(input).pipe(output)
```

## License
MIT
