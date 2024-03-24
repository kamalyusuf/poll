import { io, type Socket } from "socket.io-client";
import {
  type ReactNode,
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext
} from "react";

interface Context {
  socket: Socket | null;
}

const SocketContext = createContext<Context>({
  socket: null
});

export const useSocket = () => useContext(SocketContext).socket;

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setsocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_API_URL!, {
      rememberUpgrade: true,
      autoConnect: true,
      reconnectionAttempts: 2,
      transports: ["websocket"]
    });

    setsocket(s);
  }, []);

  useEffect(() => {
    if (!socket) return;

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={useMemo(() => ({ socket }), [socket])}>
      {children}
    </SocketContext.Provider>
  );
};
