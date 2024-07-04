import type { ComponentType } from "react";
import ReactCountdown, { type CountdownProps } from "react-countdown";
import { PollEndedAlert } from "./poll-ended-alert";
import { Text } from "@mantine/core";

const Countdown = ReactCountdown as ComponentType<CountdownProps>;

export const PollTimeRemaining = ({
  time,
  oncomplete
}: {
  time: string;
  oncomplete: () => void;
}) => {
  return (
    <Countdown
      date={time}
      onComplete={() => oncomplete()}
      onMount={({ completed }) => {
        if (completed) oncomplete();
      }}
      renderer={({ hours, minutes, seconds, completed }) => {
        if (completed) return <PollEndedAlert />;

        return (
          <Text c="yellow" fs="italic" fz={16}>
            ends in {hours}:{minutes}:{seconds}
          </Text>
        );
      }}
    />
  );
};
