'use strict'

// get required node modules
const app = require('express')()
const expressPrettier = require('./src/index')
const chalk = require('chalk')

// defaults
const defaults = { port: 3000 }

// register the plugin
app.use(expressPrettier())

// register test route
app.get('/', (req, res) => {
  // create an object
  const obj = {
    blackLivesMatter: true,
    favSinger: 'Ahmet Kaya',
    visitedCities: ['Mardin', 'Diyarbakır', 'Rome', 'Amsterdam', 'Istanbul', 'Kotor', 'Mostar', 'Belgrade'],
    pi: 3.14,
    games: {
      rdr2: 'completed',
      gtfo: 'continues'
    }
  }

  // set return type
  res.setHeader('content-type', 'application/json')

  // return the object
  res.send(obj)
})

// initialize the express server
app.listen(defaults.port, () => {
  console.log(
    chalk.bgYellow(
      chalk.black(`Express server is running on port: ${defaults.port}`)
    )
  )
})
