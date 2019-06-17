// 需要使用node 12.0.0 以下版本
const express = require('express')
const spdy = require('spdy')
const path = require('path')
const fs = require('fs')

const app = express()

const PORT = 3000

app.get('/api', (req, res) => {
    res.status(200)
      .json({ message: 'hello world with http2' })
})

app.get('/', function (req, res) {
    res.send('hello world with http2')
})


const options = {
    key: fs.readFileSync(require.resolve(__dirname + '/configs/server.key')),
    cert:  fs.readFileSync(require.resolve(__dirname + '/configs/server.crt'))
}


spdy
  .createServer(options, app)
  .listen(PORT, (error) => {
    if (error) {
      console.error('woopsy', error)
      return process.exit(1)
    } else {
      console.log(`Listening at https://localhost:${PORT}`)
    }
  })