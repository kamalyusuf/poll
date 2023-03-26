import { Center, Group, Paper, Text, Container } from "@mantine/core";
import { c } from "../utils/constants";
import {
  IconInfoCircle,
  IconCircleCheck,
  Icon,
  IconAlertTriangle,
  IconAlertCircle
} from "@tabler/icons-react";
import { parseapierror } from "../utils/error";
import { AxiosError } from "axios";
import type { ApiError } from "types";

interface Props {
  type: "success" | "error" | "warning" | "info";
  message: AxiosError<ApiError> | string | Error;
}

const icons: Record<Props["type"], Icon> = {
  warning: IconAlertTriangle,
  success: IconCircleCheck,
  info: IconInfoCircle,
  error: IconAlertCircle
};

export const Alert = ({ type, message }: Props) => {
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
          sx={{
            backgroundColor: c.colors.shade,
            borderColor: c.colors.shade
          }}
        >
          <Group spacing={20} align="center">
            <Icon size={28} strokeWidth={2} color={color} />
            <Text weight={500} size="lg" style={{ color }}>
              {msg(message)}
            </Text>
          </Group>
        </Paper>
      </Center>
    </Container>
  );
};

function msg(message: Props["message"]): string {
  if (typeof message === "string") return message;

  if (message instanceof AxiosError) return parseapierror(message)[0];

  return message.message;
}
