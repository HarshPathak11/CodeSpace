import React, { useContext, useMemo } from "react";
import { io } from 'socket.io-client';
import { createContext } from "react";
// Create a default context value
const SocketContext = createContext({ socket: null });

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = (props) => {
  const socket = useMemo(() => io("http://localhost:8000"), []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};
