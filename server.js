const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

app.get('/', (req, res) => {
  res.send(`Hello World! --- for the audio demo go to: <a href='http://localhost:${port}/audio'>http://localhost:${port}/audio</a>`)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}/audio`)
})