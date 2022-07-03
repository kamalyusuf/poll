import ReactCountdown from "react-countdown";
import PollEndedAlert from "./PollEndedAlert";
import { Text } from "@mantine/core";

const Countdown = ReactCountdown as any;

export const PollTimeRemaining = ({
  time,
  onComplete
}: {
  time: string;
  onComplete: () => void;
}) => {
  return (
    <Countdown
      date={time}
      onComplete={() => onComplete()}
      onMount={({ completed }) => {
        if (completed) onComplete();
      }}
      renderer={({ hours, minutes, seconds, completed }) => {
        if (completed) return <PollEndedAlert />;

        return (
          <Text color="yellow" style={{ fontStyle: "italic", fontSize: 16 }}>
            ends in {hours}:{minutes}:{seconds}
          </Text>
        );
      }}
    />
  );
};
