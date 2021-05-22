# express-prettier
> A simple and lightweight beautifier plugin for [Express](https://github.com/expressjs/express).

[![Downloads](https://img.shields.io/npm/dm/express-prettier.svg)](https://npmjs.com/express-prettier)
[![install size](https://packagephobia.com/badge?p=express-prettier)](https://packagephobia.com/result?p=express-prettier)

`express-prettier` has support of beautifying payloads via query parameter to make responses more readable for developers/humans. The plugin itself uses [prettier](https://github.com/prettier/prettier) under the hood and is capable of parsing/formatting anything that prettier can.

`express-prettier` registers itself as an express `middleware` to beautify the response payload before it gets sent.

**Note:** `streams` and `buffers` are excluded in beautification process.

## Install
```
$ npm install express-prettier
```

## Usage

```js
const app = require('express')()
const expressPrettier = require('express-prettier')

app.use(
  expressPrettier(
    { fallbackOnError: false }
  )
)

app.get('/', (req, res) => {
  const obj = {
    blackLivesMatter: true,
    favSinger: 'Ahmet Kaya'
  }

  res
    .setHeader('content-type', 'application/json')
    .send(obj)
})

app.listen(3000, () => {
  console.log('Express server is running on port: 3000')
})

// -------------------------------

// http://localhost:3000 -> will print out below result
/*
{"blackLivesMatter":true,"favSinger":"Ahmet Kaya"}
*/

// http://localhost:3000?pretty=true -> will print out below result
/*
{
  "blackLivesMatter": true,
  "favSinger": "Ahmet Kaya"
}
*/
```

You are allowed to change the query parameter option.

```js
app.use(
  expressPrettier(
    {
      query: {
        name: 'beautify',
        value: 'yes'
      }
    }
  )
)

// -------------------------------

// http://localhost:3000 -> will print out below result
/*
{"blackLivesMatter":true,"favSinger":"Ahmet Kaya"}
*/

// http://localhost:3000?beautify=yes -> will print out below result
/*
{
  "blackLivesMatter": true,
  "favSinger": "Ahmet Kaya"
}
*/
```

You can enable beautification for all outgoing payloads regardless the query parameter.

```js
app.use(
  expressPrettier(
    { alwaysOn: true }
  )
)

// -------------------------------

// http://localhost:3000 -> will print out below result
/*
{
  "blackLivesMatter": true,
  "favSinger": "Ahmet Kaya"
}
*/
```

## Options

| Name                   | Type       | Default                                     | Description                                                                    |
| ---                    | ---        | ---                                         | ---                                                                            |
| alwaysOn               | boolean    | false                                       | To make all the payloads beautified in anyway                                  |
| fallbackOnError        | boolean    | true                                        | If something bad happens, send the original payload. If its `false`, an error will be thrown |
| overrideContentLength  | boolean    | true                                        | Re-calculate `content-length` header for the beautified response               |
| query                  | object     | `{ name: 'pretty', value: 'true' }`         | The query parameter that triggers the plugin to beautify the outgoing payload  |
| prettierOpts           | object     | `{ tabWidth: 2, parser: 'json-stringify' }` | Please take a look prettier [official documentation](https://prettier.io/docs/en/options.html) for more information |
