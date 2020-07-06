# express-prettier
> A simple and lightweight beautifier plugin for [Express](https://github.com/expressjs/express).

[![NPM](https://nodei.co/npm/express-prettier.png)](https://nodei.co/npm/express-prettier/)

`express-prettier` has support of beautifying responses via query parameter by default to make responses more readable for developers/humans. The plugin itself uses [prettier](https://github.com/prettier/prettier) under the hood and is capable of parsing/formatting anything that prettier can.

`express-prettier` registers itself as an exress `middleware` to beautify the response/payload before it gets sent.

**Note:** `streams` and `buffers` are excluded for beautification by default.

## Options

| Name              | Type               | Default                             | Description                                                                                                          |
| ---               | ---                | ---                                 | ---                                                                                                                  |
| alwaysOn         | boolean | false                                | To make all responses beautified automatically in anyway                                                 |
| fallbackOnError         | boolean            | true                                | If something bad happens while beautifying, fallback/send previous response/payload. If its `false`, error will be thrown                                      |
| overrideContentLength  | boolean            | true                               | Re-calculate `content-length` header for new beautified response/payload                         |
| query          | object              | `{ name: 'pretty', value: 'true' }` | Request query parameter that triggers the plugin for the beautified response. It works when `alwaysOn` is disabled |
| prettierOpts          | object              | `{ tabWidth: 2, parser: 'json-stringify' }` | Prettier plugin options. Please take a look prettier [official documentation](https://prettier.io/docs/en/options.html) for more information |

## Examples

```js
// get required modules
const app = require('express')()
const expressPrettier = require('express-prettier')

// register express-prettier plugin
app.use(
  expressPrettier(
    { fallbackOnError: false }
  )
)

// test express server route
app.get('/', (req, res) => {
  // create an object
  const obj = {
    blackLivesMatter: true,
    favSinger: 'Ahmet Kaya'
  }

  // set return type
  res.setHeader('content-type', 'application/json')

  // return the object
  res.send(obj)
})

// initialize the exress server
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

You are allowed to change query parameter name and value as you desire.

```js
// register express-prettier plugin
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

You can enable beautifier for all outgoing responses regardless query parameter when the plugin is registered in Express.

```js
// register express-prettier plugin
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

## Installation
`npm install express-prettier`

## Contribution
Contributions and pull requests are kindly welcomed!

## License
This project is licensed under the terms of the [MIT license](https://github.com/hsynlms/express-prettier/blob/master/LICENSE).
