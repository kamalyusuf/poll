import { Group, Text } from "@mantine/core";
import type { Option } from "types";

interface PollOptionProps {
  option: Option;
  total: number;
}

const percentage = ({ total, votes }: { total: number; votes: number }) =>
  Math.round((votes / total) * 100) || 0;

export const PollOption = ({ option, total }: PollOptionProps) => {
  const percent = percentage({ total, votes: option.votes });

  return (
    <Group justify="space-between" style={{ width: "100%" }} align="center">
      <Text>{option.value}</Text>
      <Group align="center">
        <Text>{`${percent}%`}</Text>
        <Text fw={700}>({option.votes} votes)</Text>
      </Group>
    </Group>
  );
};
