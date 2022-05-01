const express = require(`express`)
const path = require('path')

const app = express()

// include and initialize the rollbar library with your access token
const Rollbar = require('rollbar')
const rollbar = new Rollbar({
  accessToken: 'd214e1ef982b4cb4a0176495826c4a43',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
    rollbar.info(`file served`)
})

// app.get('/style', (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/styles.css'))
//     rollbar.info(`css file served`)
// })

app.use(express.static(path.join(__dirname, '../public')))

let students = []

app.post('/api/student', (req, res)=>{
    let {name} = req.body
    name = name.trim()

    const index = students.findIndex(studentName=> studentName === name)

    if(index === -1 && name !== ''){
        students.push(name)
        rollbar.log('Student added successfully', {author: 'Scott', type: 'manual entry'})
        res.status(200).send(students)
    } else if (name === ''){
        rollbar.error('No name given')
        res.status(400).send('must provide a name.')
    } else {
        rollbar.critical('student already exists')
        res.status(400).send('that student already exists')
    }

})

app.use(rollbar.errorHandler())

const port = process.env.PORT || 4545

app.listen(port, () => console.log(`Take us to warp ${port}!`))