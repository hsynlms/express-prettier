'use strict'

// get required node modules
const express = require('express')
const expressPrettier = require('./src/index')
const request = require('supertest')
const fs = require('fs')
const xml2js = require('xml2js')

// express server generator
const generateServer = (pluginOpts) => {
  // initialize express server
  const app = express()

  // register the plugin
  app.use(expressPrettier(pluginOpts))

  // return the instance
  return app
}

// test cases

// eslint-disable-next-line
test('prettify empty response', done => {
  // initialize a express server
  const app = generateServer()

  // define a route
  app.get('/', (req, res) => {
    // send response
    res.send()
  })

  // test
  request(app)
    .get('/')
    .then((res) => {
      // eslint-disable-next-line
      expect(res.text).toBe('')
      done()
    })
})

// eslint-disable-next-line
test('prettify empty string response', done => {
  // initialize a express server
  const app = generateServer()

  // define a route
  app.get('/', (req, res) => {
    // send response
    res.send('')
  })

  // test
  request(app)
    .get('/?pretty=true')
    .then((res) => {
      // eslint-disable-next-line
      expect(res.text).toEqual('')
      done()
    })
})

// eslint-disable-next-line
test('prettify json response', done => {
  // initialize a express server
  const app = generateServer()

  // define a route
  app.get('/', (req, res) => {
    // variable definition
    const obj = {
      test: true,
      format: 'json'
    }

    // set return type
    res.setHeader('content-type', 'application/json')

    // send response
    res.send(obj)
  })

  // test
  request(app)
    .get('/?pretty=true')
    .then((res) => {
      // eslint-disable-next-line
      expect(
        /\{\n\s\s"test":\strue,\n\s\s"format":\s"json"\n\}/gi.test(res.text)
      ).toBe(true)
      done()
    })
})

// eslint-disable-next-line
test('buffer response returned as it is', done => {
  // initialize a express server
  const app = generateServer()

  // define a route
  app.get('/', (req, res) => {
    // send file buffer response
    fs.readFile('test.json', (err, fileBuffer) => {
      res.send(err || fileBuffer)
    })
  })

  // test
  request(app)
    .get('/')
    .then((res1) => {
      request(app)
        .get('/?pretty=true')
        .then((res2) => {
          // eslint-disable-next-line
          expect(res2.text).toBe(res1.text)
          done()
        })
    })
})

// eslint-disable-next-line
test('stream response returned as it is', done => {
  // initialize a express server
  const app = generateServer()

  // define a route
  app.get('/', (req, res) => {
    // create test file read stream
    const stream = fs.createReadStream('test.json', 'utf8')

    // send stream response
    res.send(stream)
  })

  // test
  request(app)
    .get('/')
    .then((res1) => {
      request(app)
        .get('/?pretty=true')
        .then((res2) => {
          // eslint-disable-next-line
          expect(res2.text).toBe(res1.text)
          done()
        })
    })
})

// eslint-disable-next-line
test('prettify html response', done => {
  // initialize a express server
  const app = generateServer({
    prettierOpts: {
      parser: 'html',
      htmlWhitespaceSensitivity: 'ignore'
    }
  })

  // define a route
  app.get('/', (req, res) => {
    // variable definition
    const obj = {
      test: true,
      format: 'html'
    }

    // generate xml
    const response = (new xml2js.Builder({ headless: true, renderOpts: false })).buildObject(obj)

    // set return type
    res.setHeader('content-type', 'text/html')

    // send response
    res.send(response)
  })

  // test
  request(app)
    .get('/?pretty=true')
    .then((res) => {
      // eslint-disable-next-line
      expect(
        /<root>\n\s\s<test>true<\/test>\n\s\s<format>html<\/format>\n<\/root>/gi.test(res.text)
      ).toBe(true)
      done()
    })
})

// eslint-disable-next-line
test('non-prettified response', done => {
  // initialize a express server
  const app = generateServer()

  // define a route
  app.get('/', (req, res) => {
    // variable definition
    const obj = {
      test: true,
      format: 'json'
    }

    // set return type
    res.setHeader('content-type', 'application/json')

    // send response
    res.send(obj)
  })

  // test
  request(app)
    .get('/')
    .then((res) => {
      // eslint-disable-next-line
      expect(res.text).toBe('{"test":true,"format":"json"}')
      done()
    })
})

// eslint-disable-next-line
test('alwaysOn option of the plugin active', done => {
  // initialize a express server
  const app = generateServer({ alwaysOn: true })

  // define a route
  app.get('/', (req, res) => {
    // variable definition
    const obj = {
      test: true,
      format: 'json'
    }

    // set return type
    res.setHeader('content-type', 'application/json')

    // send response
    res.send(obj)
  })

  // test
  request(app)
    .get('/')
    .then((res) => {
      // eslint-disable-next-line
      expect(
        /\{\n\s\s"test":\strue,\n\s\s"format":\s"json"\n\}/gi.test(res.text)
      ).toBe(true)
      done()
    })
})

// eslint-disable-next-line
test('alwaysOn option of the plugin passive', done => {
  // initialize a express server
  const app = generateServer({ alwaysOn: false })

  // define a route
  app.get('/', (req, res) => {
    // variable definition
    const obj = {
      test: true,
      format: 'json'
    }

    // set return type
    res.setHeader('content-type', 'application/json')

    // send response
    res.send(obj)
  })

  // test
  request(app)
    .get('/')
    .then((res) => {
      // eslint-disable-next-line
      expect(
        !(/\{\n\s\s"test":\strue,\n\s\s"format":\s"json"\n\}/gi.test(res.text))
      ).toBe(true)
      done()
    })
})

// eslint-disable-next-line
test('query option of the plugin active', done => {
  // initialize a express server
  const app = generateServer(
    {
      query: {
        name: 'beautify',
        value: 'yes'
      }
    }
  )

  // define a route
  app.get('/', (req, res) => {
    // variable definition
    const obj = {
      test: true,
      format: 'json'
    }

    // set return type
    res.setHeader('content-type', 'application/json')

    // send response
    res.send(obj)
  })

  // test
  request(app)
    .get('/?beautify=yes')
    .then((res) => {
      // eslint-disable-next-line
      expect(
        /\{\n\s\s"test":\strue,\n\s\s"format":\s"json"\n\}/gi.test(res.text)
      ).toBe(true)
      done()
    })
})

// eslint-disable-next-line
test('query option of the plugin passive', done => {
  // initialize a express server
  const app = generateServer(
    { query: false }
  )

  // define a route
  app.get('/', (req, res) => {
    // variable definition
    const obj = {
      test: true,
      format: 'json'
    }

    // set return type
    res.setHeader('content-type', 'application/json')

    // send response
    res.send(obj)
  })

  // test
  request(app)
    .get('/?pretty=true')
    .then((res) => {
      // eslint-disable-next-line
      expect(
        !(/\{\n\s\s"test":\strue,\n\s\s"format":\s"json"\n\}/gi.test(res.text))
      ).toBe(true)
      done()
    })
})
