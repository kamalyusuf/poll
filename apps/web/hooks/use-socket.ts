import { useContext } from "react";
import { SocketContext } from "../modules/socket/socket-provider";

export const useSocket = () => useContext(SocketContext).socket;
