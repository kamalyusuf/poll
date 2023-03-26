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
import { useQuery } from "@tanstack/react-query";
import { Poll, VotePollPayload } from "types";
import { api } from "../../lib/api";
import { useWrappedMutation } from "../../hooks/use-wrapped-mutation";
import { BiUpvote } from "react-icons/bi";
import { SharePollButton } from "./share-poll-button";
import { NewPollButton } from "./new-poll-button";
import { AbsoluteCenter } from "../../components/absolute-center";
import { PollTimeRemaining } from "./poll-time-remaining";
import { TimeAgo } from "../../components/time-ago";
import { Alert } from "../../components/alert";
import { AxiosApiError } from "../../types";
import { useUpdateQuery } from "../../hooks/use-update-query";

const vote = async (poll_id: string, payload: VotePollPayload) =>
  (
    await api.put<{ poll: Poll; vid: string }>(
      `/polls/${poll_id}/vote`,
      payload
    )
  ).data;

export const VotePollPage = () => {
  const router = useRouter();
  const id: string | undefined =
    typeof router.query.id === "string" ? router.query.id : undefined;
  const [value, setValue] = useState("");
  const {
    data: poll,
    error,
    isLoading
  } = useQuery<Poll, AxiosApiError>([`/polls/${id}`], { enabled: !!id });
  const mutation = useWrappedMutation<
    { poll: Poll; vid: string },
    VotePollPayload
  >((variables) => vote(poll?._id ?? "", variables));
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
          <Stack spacing="xs">
            <Box>
              <Title color="indigo" align="center" order={3}>
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
              <Stack spacing={12}>
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

            <Group position="apart">
              <Button
                color="indigo"
                onClick={() => {
                  if (!value) return;

                  mutation
                    .mutateAsync(
                      { option_id: value },
                      {
                        onSuccess: ({ poll }) => {
                          updatequery<Poll>({
                            key: [`/polls/${poll._id}`],
                            updater: (draft) => {
                              Object.assign(draft, poll);
                            }
                          });

                          router.replace(`/${poll._id}/r`);
                        }
                      }
                    )
                    .catch(() => {});
                }}
                loading={mutation.isLoading}
                disabled={mutation.isLoading || ended}
                leftIcon={<BiUpvote />}
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
            <Group position="apart">
              <Text size="sm" color="indigo" style={{ fontWeight: 500 }}>
                Created <TimeAgo date={poll.created_at} />
              </Text>
              <NewPollButton />
            </Group>
          </Stack>
        </Paper>
      </Container>
    );

  return null;
};
