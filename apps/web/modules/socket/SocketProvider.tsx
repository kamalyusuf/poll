import { io, Socket } from "socket.io-client";
import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

type V = Socket | null;

type Context = {
  socket: V;
  setSocket: (socket: V) => void;
};

export const SocketContext = React.createContext<Context>({
  socket: null,
  setSocket: () => {}
});

export const SocketProvider = ({ children }: PropsWithChildren<{}>) => {
  const [socket, setSocket] = useState<V>(null);
  const isConnecting = useRef(false);

  useEffect(() => {
    if (!socket && !isConnecting.current) {
      isConnecting.current = true;
      const s = io(process.env.NEXT_PUBLIC_API_URL, {
        rememberUpgrade: true
      });

      setSocket(s);
      isConnecting.current = false;
    }
  }, [socket]);

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
