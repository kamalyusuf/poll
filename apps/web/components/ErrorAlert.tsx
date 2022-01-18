import { Container, Alert, Text } from "@mantine/core";
import { AxiosError } from "axios";
import { ApiError } from "types";
import { parseApiError } from "../utils/error";

export const ErrorAlert = ({ error }: { error: AxiosError<ApiError> }) => {
  if (!error) return null;

  const messages = parseApiError(error);

  return (
    <Container size="md">
      <Alert
        title="oops! failed to fetch poll"
        color="red"
        style={{
          marginTop: 60,
          width: 300,
          marginLeft: "auto",
          marginRight: "auto"
        }}
        variant="filled"
      >
        <Text color="white" style={{ fontSize: 16 }}>
          {messages.map((m, idx) => (
            <p key={m + idx}>{m}</p>
          ))}
        </Text>
      </Alert>
    </Container>
  );
};
