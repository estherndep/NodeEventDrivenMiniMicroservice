const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const expressJSON = express.json()
const cors = require('cors')

const {randomBytes} = require('crypto')
const axios = require('axios')

const PORT = process.env.PORT || 4000

const posts ={}

app.use(cors())
app.use(expressJSON)

app.get('/posts',(req, res)=>{ res.send(posts)})
app.post('/posts/create',async (req,res)=>{
  const id = randomBytes(4).toString('hex')
  const newPost = {
    id,
    title: req.body.title
  }

  posts[id] = newPost

  await axios.post('http://event-bus-srv:4005/events', {
    type: "PostCreated",
    data: newPost
  })

  return res.status(201).json(posts[id])
})

app.post('/events', (req,res) => {
  const eventReceived = req.body

  console.log('Event received:',eventReceived.type)

  res.send({});
})

server.listen(PORT, () => {
  console.log(`v1234`)
  console.log(`https server listening on ${PORT}`)
})
