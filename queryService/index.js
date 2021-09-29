const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const expressJSON = express.json()
const cors = require('cors')

const PORT = process.env.PORT || 4002

const posts ={}

app.use(cors())
app.use(expressJSON)

app.get('/posts',(req, res)=>{ 
  res.send(posts)
})

app.post('/events', (req,res) => {
  const {type,data} = req.body

  console.log('Event received:',type)

  if(type == 'PostCreated') {
    const {id,title} = data

    posts[id] = {id, title, comments: []}
  }

  if(type == 'CommentCreated') {
    const {id,postId,content,status} = data

    posts[postId].comments.push({id, content,status})
  }

  if(type == 'CommentUpdated') {
    const {id,postId,content,status} = data

    const comment = posts[postId].comments
      .find((element) => element.id === id)

    comment.status = status
    comment.content = content
  }

  res.send({});
})

server.listen(PORT, async () => {
  console.log(`https server listening on ${PORT}`)

  try {
    const res = await axios.get("http://localhost:4005/events");
 
    for (let event of res.data) {
      console.log("Processing event:", event.type);
 
      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
})
