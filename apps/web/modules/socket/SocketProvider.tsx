import { io, Socket } from "socket.io-client";
import { ReactNode, useEffect, useMemo, useState, createContext } from "react";

type V = Socket | null;

type Context = {
  socket: V;
  setSocket: (socket: V) => void;
};

export const SocketContext = createContext<Context>({
  socket: null,
  setSocket: () => {}
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<V>(null);

  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_API_URL, {
      rememberUpgrade: true,
      autoConnect: true,
      reconnectionAttempts: 2,
      transports: ["websocket"]
    });

    setSocket(s);
  }, []);

  useEffect(() => {
    if (!socket) return;

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={useMemo(() => ({ socket, setSocket }), [socket])}
    >
      {children}
    </SocketContext.Provider>
  );
};
