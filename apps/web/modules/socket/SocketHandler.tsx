import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { Poll } from "types";
import { useSocket } from "../../hooks/useSocket";

export const SocketHandler = () => {
  const socket = useSocket();
  const client = useQueryClient();
  const { query } = useRouter();

  useEffect(() => {
    if (!socket) return;

    socket.on("poll voted", (poll: Poll) => {
      if (client.getQueryData<Poll>(`/polls/${poll._id}`)) {
        client.setQueryData<Poll>(`/polls/${poll._id}`, (cached) => {
          return { ...cached, ...poll };
        });
      }
    });

    socket.on("poll ended", (poll: Poll) => {
      client.setQueryData<Poll>(`/polls/${poll._id}`, (cached) => {
        if (!cached) return poll;

        return { ...cached, ...poll };
      });
    });

    return () => {
      socket.off("poll voted");
      socket.off("poll ended");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    if (!query.id) return;

    socket.emit("join poll", query.id);
  }, [socket, query.id]);

  return null;
};
