// import { useState } from 'react'
import React from 'react'
// import './index.css'

function Bot() {
  const [msg,setMsg]=React.useState("");
  const [chat,setChat]=React.useState([{origin:"model",body:" This is a beta-feature and is prone to few errors and malfunctions. Hello! I am your Personal Code_Assistant. How can i help you today ?"}]);
  const [isTyping,setTyping]=React.useState(false);

  async function postPromt(){
      console.log(msg);
      setTyping(true);
      const que={origin:"user",body:msg}
      const a=chat
      a.push(que)
      setChat(a);
      console.log(chat);
      const response =await fetch("https://codespace-kp9s.onrender.com/",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Specify the content type as JSON
        },
        body: JSON.stringify({
          prompt:msg
        })
      })
      if(response.ok){
        setMsg("");
        const data=await response.json();
        setTyping(false);
        // alert("response recieved");
        
        const obj={origin:"model",body:data.output}
        const a=chat
        a.push(obj)
        setChat(a);
        
      }
  } 


  function handleChange(event){
    event.preventDefault();
    const m=event.target.value;
    setMsg(m);
  }
  

  return (
    
      <div className='bg-slate-900'>
      <h1 className='text-center text-6xl text-white font-serif p-5'>Code_Bot</h1>
       <div className=' min-h-[72vh] p-5 '>
        {chat.map(({origin,body})=>{
          if(origin==="user"){
            return (<div className='flex justify-end text-white p-6'>
              <div className=' bg-cyan-800 p-2 max-w-[90%] rounded-md'>{body}</div>
            </div>)
          }
          else{
            return (<div className='flex justify-start  text-white p-6'>
              <div className=' bg-cyan-950 p-2 max-w-[90%] rounded-md'>{body}</div>
            </div>)
          }
        })}
        {isTyping &&<div className='flex justify-center h-16'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#E0FF0E" stroke="#E0FF0E" stroke-width="7" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#E0FF0E" stroke="#E0FF0E" stroke-width="7" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#E0FF0E" stroke="#E0FF0E" stroke-width="7" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg></div>}
       </div>
       <div className='p-5 flex justify-around'>
          <textarea className='w-[90%] bg-slate-800 text-white p-2 h-auto resize-none' placeholder='Type here' value={msg} onChange={handleChange} />
          <button className='bg-blue-700 text-white w-20' onClick={postPromt}>Send</button>
       </div>
      </div>
    
  )
}

export default Bot