import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './components/login'
import { SocketProvider } from './providers/Socket'
import { JitsiMeetingComponent } from './components/jitsi'
import RoomEditor from './components/Room'
function App() {
  

  return (
    <>
    <SocketProvider>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/room/:roomid' element={<RoomEditor/>}></Route>
        <Route path='/meet' element={<JitsiMeetingComponent/>}></Route>
      </Routes>
    </SocketProvider>
    </>
  )
}


export default App
