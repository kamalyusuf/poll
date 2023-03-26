import { Group, Text } from "@mantine/core";
import { Option } from "types";

interface Props {
  option: Option;
  total: number;
}

const percentage = (votes: number, total: number) =>
  Math.round((votes / total) * 100) || 0;

export const PollOption = ({ option, total }: Props) => {
  return (
    <Group position="apart" style={{ width: "100%" }} align="center">
      <Text>{option.value}</Text>
      <Group align="center">
        <Text weight={700}>{option.votes} vote(s)</Text>
        <Text>{`(${percentage(option.votes, total)}%)`}</Text>
      </Group>
    </Group>
  );
};
