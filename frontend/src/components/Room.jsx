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
    <div className="bg-[#060b38] min-h-screen flex flex-col md:flex-row">
      <div className="bg-dark-navy-900 min-w-[320px] text-white p-4 flex flex-col items-center md:items-start md:w-1/4">
        <div className="bg-[#4a5a95] text-dark-navy-900 font-bold rounded-md py-2 px-4 mb-4 inline-block">
          Room : {roomId}
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
  );
};

export default RoomEditor;