import { useRouter } from "next/router";
import { useEffect } from "react";
import { Poll } from "types";
import { useSocket } from "../../hooks/use-socket";
import { useUpdateQuery } from "../../hooks/use-update-query";

export const SocketHandler = () => {
  const socket = useSocket();
  const { query } = useRouter();
  const updatequery = useUpdateQuery();

  useEffect(() => {
    if (!socket) return;

    socket.on("poll voted", (poll: Poll) => {
      updatequery<Poll>({
        key: [`/polls/${poll._id}`],
        updater: (draft) => {
          Object.assign(draft, poll);
        }
      });
    });

    socket.on("poll ended", (poll: Poll) => {
      updatequery<Poll>({
        key: [`/polls/${poll._id}`],
        updater: (draft) => {
          Object.assign(draft, poll);
        }
      });
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [socket]);

  useEffect(() => {
    if (socket && query.id) socket.emit("join poll", query.id);
  }, [socket, query.id]);

  return null;
};
