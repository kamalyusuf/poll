import { Group, Text } from "@mantine/core";
import { type Option } from "types";

interface PollOptionProps {
  option: Option;
  total: number;
}

const percentage = (votes: number, total: number) =>
  Math.round((votes / total) * 100) || 0;

export const PollOption = ({ option, total }: PollOptionProps) => {
  return (
    <Group justify="space-between" style={{ width: "100%" }} align="center">
      <Text>{option.value}</Text>
      <Group align="center">
        <Text fw={700}>{option.votes} vote(s)</Text>
        <Text>{`(${percentage(option.votes, total)}%)`}</Text>
      </Group>
    </Group>
  );
};
