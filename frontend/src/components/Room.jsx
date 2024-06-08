import React from 'react';
import { SocketProvider,useSocket } from '../providers/Socket';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import BotButton from './BotButton';
 import Editor from '@monaco-editor/react';
import { LanguageDropdown } from './langauge';
import Output from './result';





const RoomEditor = () => {

  const [light,setLight]=React.useState(false)  
  const [text,setText]=React.useState("");
  const [userCount,setUserCount]=React.useState(1)
  const [lang,setLang]=React.useState('javascript')
  const [call,setcall]=React.useState(false);

  
  const {socket}=useSocket();
  const location = useLocation()
  const roomId = location.state.roomId;
  const t=location.state.username;
  const [part, setPart]=React.useState([t])


  function handleModeChange(){
    const a=!light
    setLight(a)
  }
  const onSelect=(lng)=>{
    setLang(lng)
  }

  function goLive(){
    setcall(true)
  }



React.useEffect(() => {
  // Event listeners for Socket.IO events
  socket.on('data-written', (data) => {
    console.log("Received data-written:", data);
    setText(data.content); // Update the textarea with received content
  });

  socket.on('user-joined', (data) => {
    console.log("User joined:", data);
    
    setPart(data.participants)
    setUserCount(data.participants.length)
  });

  socket.on('initial-content', (data) => {
    console.log("Initial content:", data);
    setText(data.content); // Update text with initial content upon joining
    setPart(data.participants)
    setUserCount(data.participants.length); // Update user count
  });

  socket.on('user-count-update', (data) => {
    console.log("User count update:", data);
    setPart(data.participants)
    setUserCount(data.participants.length); // Update user count
  });

  // Cleanup function: Remove event listeners on unmount
  return () => {
    socket.off('data-written');
    socket.off('user-joined');
    socket.off('initial-content');
    socket.off('user-count-update');
  };
}, [socket]);

  return (
    <>
    <div className="bg-[#060b38] min-h-screen flex flex-col md:flex-row">
      <div className="bg-dark-navy-900 min-w-[320px] text-white p-4 flex flex-col items-center md:items-start md:w-1/4">
        <div className="bg-[#4a5a95] text-dark-navy-900 font-bold rounded-md py-2 px-4 mb-4 inline-block ">
          Room : {roomId}
          <button className=' ml-5 pt-1' onClick={()=>{navigator.clipboard.writeText(roomId)}}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></button>
        </div>
        <div className="bg-[#4a5a95] text-dark-navy-900 font-bold rounded-md py-2 px-4 mb-4 inline-block">
         No. of Participants: {userCount}
        </div>
        <div className="grid grid-cols-4">
          {part.map(ele=>{return <div className="bg-red-500 text-white w-16 h-16 flex items-center justify-center font-bold m-2">{ele.length<6?ele:ele.slice(0,6)}</div>})}
        </div>
        <div className='mt-5'>
          <BotButton/>
        </div>
      </div>
      <div className="flex-1 bg-blue-950 text-white p-4">
        <div className="text-gray-400 mb-4 inline-block">Code Editor Space</div>
        {light&&<button onClick={handleModeChange} className='mx-5 bg-slate-900 text-white px-2 py-1 rounded-md'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg></button>}
        {!light&&<button onClick={handleModeChange} className='mx-5 bg-white text-black px-2 py-1 rounded-md'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg></button>}
        <div>
        {!light && <Editor height="75vh" theme='vs-dark' defaultValue="// some comment" language={lang} className='my-1' value={text} onChange={text=>{
                setText(text)
                socket.emit("user-writing",{content:text,roomId:roomId})
            }}/>}
        {light && <Editor height="75vh" defaultValue="// some comment" language={lang} className='my-1' value={text} onChange={text=>{
                setText(text)
                socket.emit("user-writing",{content:text,roomId:roomId})
            }}/>}
        <LanguageDropdown language={lang} onSelect={onSelect}/>
        <Output language={lang} sourceCode={text}/>
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

export default RoomEditor;