import express from 'express'
import cors from 'cors'
import {Server} from 'socket.io'
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv'

import axios from 'axios';

const app=express();
const io=new Server(
    {cors:true}
);

app.use(express.json())
app.use(cors())

dotenv.config(
  {
      path:'.\env'
  }
)

const emailtoSocketMapping=new Map();
const SocketToUserMapping=new Map();

const roomContent={}

const participants={}

const list=[{ name:'java',code: 'java', version:'5' },
  { name:'python',code: 'python3', version:'3' },
 { name:'cpp' ,code: 'cpp', version:'5' },
 { name:'php', code: 'php', version:'5' },
  { name:'rust' ,code: 'rust', version:'5' },
 { name:'javascript' ,code: 'typescript', version:'0' },
 {name:'typescript' ,code: 'typescript', version:'0' }]



io.on('connection',(socket)=>{
  let connectedUser = { email: null, roomId: null };
    socket.on('join-room',data=>{
        
        
        const {username,roomId}=data
        connectedUser = { username, roomId };
        participants[roomId]=(participants[roomId] || []) 
        participants[roomId].push(username)
        emailtoSocketMapping.set(username,socket.id)
        SocketToUserMapping.set(socket.id,roomId)
        console.log("User",username,"joined",roomId)
        socket.join(roomId)
        const initialContent = roomContent[roomId] || ""; // Get latest content
        // console.log(initialContent)
        if (initialContent || participants[roomId]) {
      socket.emit('initial-content', { content: initialContent ,participants:participants[roomId] }); // Send to new user
    }
        socket.broadcast.to(roomId).emit("user-joined",{username,participants:participants[roomId]})
    })
    socket.on('user-writing',data=>{
        const {content,roomId}=data
        // console.log(content,roomId)
        roomContent[roomId] = content;
        // console.log(roomContent)
        socket.broadcast.to(roomId).emit("data-written",{content})
    })

    socket.on('disconnect',()=>{
      console.log("user disconnected")
      const roomId = SocketToUserMapping.get(socket.id);
  if (roomId) {
    SocketToUserMapping.delete(socket.id); // Cleanup user room association
    // console.log(`User disconnected from room: ${roomId}`);
    // participants[roomId]--;
    participants[roomId] = participants[roomId].filter((e) => e !== connectedUser.username);
    emailtoSocketMapping.delete(connectedUser.username);
    // console.log("particiapnts in",roomId, "are",participants[roomId])
    // console.log(connectedUser)
    // socket.broadcast.to(roomId).emit('user-left', { username: /* username of the disconnected user */ });
    io.to(roomId).emit('user-count-update', { participants: participants[roomId] });
  }
    })
})

const genAI = new GoogleGenerativeAI(process.env.GOOGLE);

app.post("/", async (req, res) => {
  // console.log(req)
  const { prompt } = req.body;
  try {
    const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ output: text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});






app.post('/exec', async (req, res) => {
  // const { language, script } = req.body; 
  // console.log(req.body);
  // console.log(language,script)
  // console.log(req.body.language,req.body.sourceCode);
  const l=req.body.language
  const z=list.find(ele=>l===ele.name)
  


  const postData = JSON.stringify({
    "clientId": `${process.env.CLIENTID}`,
    "clientSecret": `${process.env.CLIENTSECRET}`,
    "script": `${req.body.script}`,
    "stdin": "",
    "language": `${z.code}`,
    "versionIndex": `${z.version}`,
    "compileOnly": false
  });
  //  console.log(postData)
  const options = {
    method: 'post',
    url: 'https://api.jdoodle.com/v1/execute',
    headers: { 'Content-Type': 'application/json' },
    data: postData
  };

  try {
    const response = await axios(options);
    // console.log(response)
    return res.json(response.data); // Send the API response to the client
  } catch (error) {
    console.error('Error making Jdoodle API request:', error);
    res.status(500).send('Internal Server Error'); // Handle errors gracefully
  }
});

app.listen(8000,()=>{
    console.log("Server running on htpp://localhost:8000")
})
io.listen(8001)