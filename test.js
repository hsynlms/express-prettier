'use strict'

const express = require('express')
const expressPrettier = require('./src/index')
const request = require('supertest')
const fs = require('fs')
const xml2js = require('xml2js')

const generateServer = (pluginOpts) => {
  const app = express()

  app.use(expressPrettier(pluginOpts))

  return app
}

// test cases

// eslint-disable-next-line
test('prettify empty response', done => {
  const app = generateServer()

  app.get('/', (req, res) => {
    res.send()
  })

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
  const app = generateServer()

  app.get('/', (req, res) => {
    res.send('')
  })

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
  const app = generateServer()

  app.get('/', (req, res) => {
    const obj = {
      test: true,
      format: 'json'
    }

    res.setHeader('content-type', 'application/json')
    res.send(obj)
  })

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
  const app = generateServer()

  app.get('/', (req, res) => {
    fs.readFile('test.json', (err, fileBuffer) => {
      res.send(err || fileBuffer)
    })
  })

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
  const app = generateServer()

  app.get('/', (req, res) => {
    const stream = fs.createReadStream('test.json', 'utf8')
    res.send(stream)
  })

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
  const app = generateServer({
    prettierOpts: {
      parser: 'html',
      htmlWhitespaceSensitivity: 'ignore'
    }
  })

  app.get('/', (req, res) => {
    const obj = {
      test: true,
      format: 'html'
    }

    const response =
      (new xml2js.Builder({ headless: true, renderOpts: false })).buildObject(obj)

    res.setHeader('content-type', 'text/html')
    res.send(response)
  })

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
  const app = generateServer()

  app.get('/', (req, res) => {
    const obj = {
      test: true,
      format: 'json'
    }

    res.setHeader('content-type', 'application/json')
    res.send(obj)
  })

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
  const app = generateServer({ alwaysOn: true })

  app.get('/', (req, res) => {
    const obj = {
      test: true,
      format: 'json'
    }

    res.setHeader('content-type', 'application/json')
    res.send(obj)
  })

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
  const app = generateServer({ alwaysOn: false })

  app.get('/', (req, res) => {
    const obj = {
      test: true,
      format: 'json'
    }

    res.setHeader('content-type', 'application/json')
    res.send(obj)
  })

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
  const app = generateServer(
    {
      query: {
        name: 'beautify',
        value: 'yes'
      }
    }
  )

  app.get('/', (req, res) => {
    const obj = {
      test: true,
      format: 'json'
    }

    res.setHeader('content-type', 'application/json')
    res.send(obj)
  })

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
  const app = generateServer(
    { query: false }
  )

  app.get('/', (req, res) => {
    const obj = {
      test: true,
      format: 'json'
    }

    res.setHeader('content-type', 'application/json')
    res.send(obj)
  })

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
