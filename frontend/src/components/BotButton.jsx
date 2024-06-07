import React from 'react'
// import './index.css'
import Bot from './Bot';

function BotButton() {
  
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      {isChatOpen ? (
        <div className="chat-popup bg-slate-900">
          
          <button className="close-btn bg-red-600 rounded p-2 px-4 text-white m-1" onClick={toggleChat}>X</button>
          <Bot />
        </div>
      ) : (
        <button className="open-btn bg-blue-600 rounded p-5 font-sans font-bold" onClick={toggleChat}>CODE_BOT</button>
      )}
    </div>
  );

}

export default BotButton






