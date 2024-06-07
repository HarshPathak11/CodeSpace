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
  );
};

export default Login;
