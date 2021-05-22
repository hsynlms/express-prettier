'use strict'

const prettier = require('prettier')
const isStream = require('is-stream')
const pkg = require('../package.json')

const defaults = {
  query: {
    name: 'pretty',
    value: 'true'
  },
  alwaysOn: false,
  fallbackOnError: true,
  overrideContentLength: true,
  prettierOpts: {
    tabWidth: 2,
    parser: 'json-stringify'
  }
}

function prettierPlugin (opts) {
  const options = Object.assign({}, defaults, opts)

  // amazer :)
  const amazeMe = (content, opts) => {
    let strContent = ''

    if (typeof content === 'function') {
      throw Error(`${pkg.name} cannot beautify 'function' type objects`)
    } else if (typeof content === 'object' || Array.isArray(content)) {
      strContent = JSON.stringify(content)
    } else {
      strContent = content.toString()
    }

    return prettier.format(
      strContent,
      Object.assign({}, options.prettierOpts, opts)
    )
  }

  return function prettierPlugin (req, res, next) {
    // store original response 'send' into a variable
    const originalSend = res.send

    // override response send
    res.send = (body) => {
      // set response 'send' with original to avoid 'double-send'
      res.send = originalSend

      // if the body which is being sent is a stream or a buffer
      // return the original body
      if (isStream(body) || Buffer.isBuffer(body)) return res.send(body)

      // set current body as fallback
      let prettifiedBody = body
      let isPrettified = false

      if (options.alwaysOn === true ||
          // eslint-disable-next-line
          (options.query && req.query[options.query.name] == options.query.value)) {
        try {
          prettifiedBody = amazeMe(prettifiedBody)

          isPrettified = true
        } catch (err) {
          if (options.fallbackOnError === false) {
            // throw the error if fallback is disabled
            throw Error(`${pkg.name} run into an unexpected error: ${err.message}`)
          }
        }
      }

      // reset content-length header with new body length
      // if its enabled in options
      if (isPrettified &&
          prettifiedBody &&
          options.overrideContentLength === true) {
        res.setHeader('content-length', prettifiedBody.length)
      }

      return res.send(prettifiedBody)
    }

    next()
  }
}

module.exports = prettierPlugin
