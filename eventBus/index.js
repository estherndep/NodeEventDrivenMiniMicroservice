const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const expressJSON = express.json()
const cors = require('cors')
const axios = require('axios')
const PORT = process.env.PORT || 4005

let events = []


app.use(cors())
app.use(expressJSON)

app.get('/events', (req,res) => {res.send(events)})

app.post('/events', (req,res) => {
    const eventReceived = req.body

    events.push(eventReceived)

    console.log(eventReceived.type)
    axios.post('http://posts-cluster-ip-srv:4000/events', eventReceived)
    .catch((err) => {
        console.log(err.message);
    });
    // axios.post('http://localhost:4001/events', eventReceived)
    // .catch((err) => {
    //     console.log('comments',err.message);
    // });
    // axios.post('http://localhost:4002/events', eventReceived)
    // .catch((err) => {
    //     console.log('query',err.message);
    // })
    // //moderation service
    // axios.post('http://localhost:4003/events', eventReceived)
    // .catch((err) => {
    //     console.log('moderation',err.message);
    // })
    
    res.send({ status: 'OK' });
})

server.listen(PORT, () => {
  console.log(`https server listening on ${PORT}`)
})
