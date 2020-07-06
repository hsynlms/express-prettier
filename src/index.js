'use strict'

// get required modules
const prettier = require('prettier')
const isStream = require('is-stream')
const pkg = require('../package.json')

// options defaults
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

// declaration of prettier plugin for express
function prettierPlugin (opts) {
  // combine defaults with provided options
  const options = Object.assign({}, defaults, opts)

  // amazer :)
  const amazeMe = (content, opts) => {
    // declaration of stringified content
    let strContent = ''

    // validations
    if (typeof content === 'function') {
      throw Error(`${pkg.name} cannot beautify 'function' type objects`)
    } else if (typeof content === 'object' || Array.isArray(content)) {
      strContent = JSON.stringify(content)
    } else {
      strContent = content.toString()
    }

    // return amazed result
    return prettier.format(
      strContent,
      Object.assign({}, options.prettierOpts, opts)
    )
  }

  // return the middleware
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

      // new body variable declaration
      // set current body as fallback
      let prettifiedBody = body

      // indicates if the body is prettified or not
      let isPrettified = false

      // check options
      if (options.alwaysOn === true ||
          // eslint-disable-next-line
          (options.query && req.query[options.query.name] == options.query.value)) {
        try {
          // format the body
          prettifiedBody = amazeMe(prettifiedBody)

          // successfully prettified
          isPrettified = true
        } catch (err) {
          // something bad happened
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

      // sent back the new body
      return res.send(prettifiedBody)
    }

    // done
    next()
  }
}

// export the plugin
module.exports = prettierPlugin
