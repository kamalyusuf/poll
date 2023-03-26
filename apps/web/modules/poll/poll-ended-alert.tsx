import { Alert, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

export const PollEndedAlert = () => {
  return (
    <Alert icon={<IconAlertCircle strokeWidth={2} />} color="red">
      <Text color="red" style={{ fontSize: 16 }}>
        poll ended
      </Text>
    </Alert>
  );
};
