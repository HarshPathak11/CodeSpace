import React from 'react';
import { SocketProvider,useSocket } from '../providers/Socket';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const {socket}=useSocket();
  const navigate=useNavigate();
//   socket.emit("join-room",{username:"dummy",roomId:1})
  const [username, setUsername]=React.useState("")
  const [room,setRoom]=React.useState("") 
  
  function GenerateRoom(){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let roomNumber = '';
  const length = 6;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomNumber += characters[randomIndex];
  }
  setRoom(roomNumber)
  }

  function handleSubmit(){
    if(!username || !room)
    alert("Field Cannot be empty")
    else{
    socket.emit("join-room",{username:username,roomId:room})
    navigate(`/room/${room}`,{ state: {roomId:room ,username:username} })}
  }
  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-blue-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-80 md:w-96">
        <div className="flex flex-col items-center">
          <img
            src="https://s3-alpha.figma.com/hub/file/2721803157/3f021816-bde1-4634-80b3-52d7f762bc6b-cover.png"
            alt="CodeSpace Logo"
            className="mb-4 w-16"
          />
          <h1 className="text-2xl text-white font-bold mb-6">CodeSpace</h1>
          <input
            type="text"
            placeholder="Username"
            onChange={event=>{
                setUsername(event.target.value)
            }}
            value={username}
            className="mb-4 w-full px-4 py-2 rounded-full focus:outline-none"
          />
          <input
            type="text"
            placeholder="Room Number"
            onChange={event=>{
                setRoom(event.target.value)
            }}
            value={room}
            className="mb-6 w-full px-4 py-2 rounded-full focus:outline-none"
          />
          <button onClick={handleSubmit} className="bg-orange-500 my-4 text-white px-4 py-2 rounded-full font-bold w-60 hover:bg-orange-600">
            JOIN ROOM
          </button>
          <p className=' text-white'>Want to Generate a Room? <a className=' hover:text-blue-700' onClick={GenerateRoom}>Click here</a></p>
        </div>
      </div>
    </div>
    <footer className="bg-gray-800 py-8 border-t-2">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-center mb-4">
          {/* Instagram icon */}
          <a href="https://www.instagram.com/harshpathak_1110/?next=%2F" className="text-gray-300 hover:text-white mx-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
          {/* GitHub icon */}
          <a href="https://github.com/HarshPathak11" className="text-gray-300 hover:text-white mx-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          </a>
          {/* LinkedIn icon */}
          <a href="https://www.linkedin.com/in/harsh-pathak-818163298/" className="text-gray-300 hover:text-white mx-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
        </div>
        <p className="text-center text-gray-300 text-sm mb-4">Contact: jkpathak83195@gmail.com | Phone: 9984830475</p>
        <p className="text-center text-gray-300 text-sm mb-4">About Us: Discover Teamwork, collaboration and ingenuity on our platform dedicated to sharing knowledge and fostering community.</p>
        <p className="text-center text-gray-300 text-sm">&copy; 2024 CodeSpace | Harsh Pathak. All rights reserved.</p>
      </div>
    </footer>
    </>
  );
};

export default Login;
