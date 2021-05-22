'use strict'

const app = require('express')()
const expressPrettier = require('./src/index')
const chalk = require('chalk')

const defaults = { port: 3000 }

app.use(expressPrettier())

app.get('/', (req, res) => {
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

  res.setHeader('content-type', 'application/json')
  res.send(obj)
})

app.listen(defaults.port, () => {
  console.log(
    chalk.bgYellow(
      chalk.black(`Express server is running on port: ${defaults.port}`)
    )
  )
})
