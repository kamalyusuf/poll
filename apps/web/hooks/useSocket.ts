import { useContext } from "react";
import { SocketContext } from "../modules/socket/SocketProvider";

export const useSocket = () => useContext(SocketContext).socket;
