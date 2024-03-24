import {
  Container,
  Paper,
  Radio,
  Divider,
  Group,
  Button,
  Box,
  Space,
  Text,
  Loader,
  Stack,
  Title
} from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type Poll, type VotePollPayload } from "types";
import { api } from "../../lib/api";
import { BiUpvote } from "react-icons/bi";
import { SharePollButton } from "./share-poll-button";
import { NewPollButton } from "./new-poll-button";
import { AbsoluteCenter } from "../../components/absolute-center";
import { PollTimeRemaining } from "./poll-time-remaining";
import TimeAgo from "react-timeago";
import { Alert } from "../../components/alert";
import { type AxiosApiError } from "../../types";
import { useUpdateQuery } from "../../hooks/use-update-query";

export const VotePollPage = () => {
  const router = useRouter();
  const id: string | undefined =
    typeof router.query.id === "string" ? router.query.id : undefined;
  const [value, setValue] = useState("");
  const {
    data: poll,
    error,
    isLoading
  } = useQuery<Poll, AxiosApiError>({
    queryKey: [`/polls/${id}`],
    enabled: !!id
  });
  const mutation = useMutation<
    { poll: Poll; vid: string },
    AxiosApiError,
    VotePollPayload
  >({
    mutationFn: async (variables) =>
      (
        await api.put<{ poll: Poll; vid: string }>(
          `/polls/${poll?._id}/vote`,
          variables
        )
      ).data
  });
  const [ended, setended] = useState(poll?.status === "ended");
  const updatequery = useUpdateQuery();

  if (isLoading)
    return (
      <AbsoluteCenter>
        <Loader size="lg" color="indigo" />
      </AbsoluteCenter>
    );

  if (error) return <Alert type="error" message={error} />;

  if (poll)
    return (
      <Container size="md">
        <Paper
          p="xl"
          shadow="sm"
          radius="md"
          style={{
            marginTop: 60,
            position: "relative",
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          <Stack gap="xs">
            <Box>
              <Title c="indigo" ta="center" order={3}>
                vote
              </Title>
              <Divider color="dark" />
            </Box>
            <PollTimeRemaining
              time={poll.expires_at}
              oncomplete={() => setended(true)}
            />

            <Radio.Group
              label={poll.title}
              value={value}
              onChange={setValue}
              withAsterisk
            >
              <Stack gap={12}>
                {poll.options.map((option) => (
                  <Radio
                    key={option._id}
                    value={option._id}
                    label={option.value}
                    disabled={ended}
                  />
                ))}
              </Stack>
            </Radio.Group>
            <Space />

            <Group justify="space-between">
              <Button
                color="indigo"
                onClick={() => {
                  if (!value) return;

                  mutation.mutate(
                    { option_id: value },
                    {
                      onSuccess: ({ poll }) => {
                        updatequery<Poll>([`/polls/${poll._id}`], (draft) => {
                          Object.assign(draft, poll);
                        });

                        void router.replace(`/${poll._id}/r`);
                      }
                    }
                  );
                }}
                loading={mutation.isPending}
                disabled={mutation.isPending || ended}
                leftSection={<BiUpvote />}
              >
                vote
              </Button>
              <SharePollButton disabled={ended} />
              <Button
                color="indigo"
                variant="outline"
                onClick={() => router.push(`/${poll._id}/r`)}
              >
                result
              </Button>
            </Group>
            <Space />
            <Group justify="space-between">
              <Text size="sm" c="indigo" fw={500}>
                created <TimeAgo date={poll.created_at} />
              </Text>
              <NewPollButton />
            </Group>
          </Stack>
        </Paper>
      </Container>
    );

  return null;
};
