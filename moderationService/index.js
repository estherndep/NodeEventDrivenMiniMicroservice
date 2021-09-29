const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const expressJSON = express.json()
const axios = require('axios')


const PORT = process.env.PORT || 4003

const commentsByPost ={}

app.use(expressJSON)


app.post('/events', (req,res) => {
  let {type,data} = req.body

  console.log('Event received:', type)

  if(type === "CommentCreated") {
    const status = data.content.includes('orange') ? 'rejected' : 'approved'

    console.log(status)
    axios.post('http://localhost:4005/events', {
      type: 'CommentModerated',
      data: {...data,status}
    })
    .catch((err) => {
        console.log(err.message);
    }); 
  }

  res.send({});
})

server.listen(PORT, () => {
  console.log(`https server listening on ${PORT}`)
})
