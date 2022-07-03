import { Alert, Text } from "@mantine/core";
import React from "react";

const PollEndedAlert = () => {
  return (
    <Alert title="oh no!" color="red">
      <Text color="red" style={{ fontSize: 16 }}>
        poll ended
      </Text>
    </Alert>
  );
};

export default PollEndedAlert;
