'use strict'

const strToStream = require('string-to-stream')
const spawn = require('child_process').spawn
const through = require('through2')
const fse = require('fs-extra')
const temp = require('temp')
const path = require('path')
const fs = require('fs')

/**
 * Beautifies a LaTeX document.
 *
 * @param {ReadableStream|String} src - The LaTeX document.
 *
 * @return {DestroyableTransform}
 */
function beautify (src) {
  const output = through()

  temp.mkdir('latexindent', (err, tempPath) => {
    const handleErrors = (err) => {
      output.emit('error', err)
      output.destroy()
      fse.removeSync(tempPath)
    }

    if (err) {
      handleErrors(err)
    }

    let input

    if (!src) {
      handleErrors(new Error('Error: No TeX document provided.'))
    }

    if (typeof src === 'string') {
      input = strToStream(src)
    } else if (src.pipe) {
      input = src
    } else {
      handleErrors(new Error('Error: Invalid TeX document.'))
    }

    const texInputPath = path.join(tempPath, 'input.tex')
    const texInputFile = fs.createWriteStream(texInputPath)
    input.pipe(texInputFile)

    const cmd = 'latexindent'
    const args = ['input.tex', '-o', 'output.tex']
    const opts = { cwd: tempPath }

    const latexindent = spawn(cmd, args, opts)

    latexindent.on('error', () => {
      handleErrors(new Error('Error: Unable to run latexindent command.'))
    })

    latexindent.on('exit', (code) => {
      if (code !== 0) {
        handleErrors(new Error('Error while running latexindent.'))
        return
      }

      const texOutputPath = path.join(tempPath, 'output.tex')
      const texOutputFile = fs.createReadStream(texOutputPath)
      texOutputFile.pipe(output)

      texOutputFile.on('close', () => fse.removeSync(tempPath))
    })
  })

  return output
}

module.exports = beautify
