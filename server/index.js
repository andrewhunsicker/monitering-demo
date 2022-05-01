const express = require(`express`)
const path = require('path')

const app = express()

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: 'd214e1ef982b4cb4a0176495826c4a43',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'))
    rollbar.info('file served')
})

const port = process.env.PORT || 4545

// app.listen(port, () => console.log(`take us to warp ${port}`))

let students = []

app.post('/api/student', (req, res) => {
    let {name} = req.body
    name = name.trim()

    students.push(name)

    rollbar.log(`student added successfully`, {author: `Andrew`, type: `manual entry` })

    res.status(200).send(students)
})

app.use(rollbar.errorHandler())

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})