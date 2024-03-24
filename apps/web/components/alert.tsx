import { Center, Group, Paper, Text, Container } from "@mantine/core";
import {
  IconInfoCircle,
  IconCircleCheck,
  IconAlertTriangle,
  IconAlertCircle
} from "@tabler/icons-react";
import { parseapierror, c } from "../utils";
import { type AxiosError } from "axios";
import type { ApiError } from "types";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  message: AxiosError<ApiError> | string;
}

const icons = {
  warning: IconAlertTriangle,
  success: IconCircleCheck,
  info: IconInfoCircle,
  error: IconAlertCircle
};

export const Alert = ({ type, message }: AlertProps) => {
  const color = c.colors[type];
  const Icon = icons[type];

  return (
    <Container
      size="lg"
      style={{
        marginTop: 60
      }}
    >
      <Center>
        <Paper
          shadow="md"
          p={20}
          radius="md"
          style={{
            backgroundColor: c.colors.shade,
            borderColor: c.colors.shade
          }}
        >
          <Group gap={20} align="center">
            <Icon size={28} strokeWidth={2} color={color} />

            {typeof message === "string" ? (
              <Text fw={500} size="lg" c={color}>
                {message}
              </Text>
            ) : (
              parseapierror(message).map((m) => (
                <Text fw={500} size="lg" c={color}>
                  {m}
                </Text>
              ))
            )}
          </Group>
        </Paper>
      </Center>
    </Container>
  );
};
