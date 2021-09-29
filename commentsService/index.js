const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const expressJSON = express.json()
const cors = require('cors')
const axios = require('axios')


const {randomBytes} = require('crypto')

const PORT = process.env.PORT || 4001

const commentsByPost ={}

app.use(cors())
app.use(expressJSON)

app.get('/posts/:id/comments',(req, res)=>{ 
    const comments = commentsByPost[req.params.id] || [] 
    res.send(comments)
})

app.post('/posts/:id/comments/create',async (req,res)=>{
  const postId = req.params.id

  let comments = commentsByPost[postId] || []
  let newComment = {
    id: randomBytes(4).toString('hex'),
    content: req.body.content,
    status: 'pending'
  }
  
  comments.push(newComment)
  commentsByPost[postId] = comments

  axios.post('http://localhost:4005/events', {
    type: "CommentCreated",
    data: {...newComment,postId}
  }).catch((error) => console.log(error))

  return res.status(201).json(commentsByPost[postId])
})

app.post('/events', (req,res) => {
  const {type, data} = req.body

  console.log('Event received:',type)

  if (type === "CommentModerated") {
    const  {postId,id,status} = data
    const comments = commentsByPost[postId]
    const comment = comments.find((element) => element.id === id)

    comment.status = status

    axios.post('http://localhost:4005/events', {
      type: "CommentUpdated",
      data: {...comment,postId}
    }).catch((error) => console.log(error))
  }

  res.send({});
})

server.listen(PORT, () => {
  console.log(`https server listening on ${PORT}`)
})
