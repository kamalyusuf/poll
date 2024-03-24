import {
  Button,
  Container,
  Divider,
  Group,
  Paper,
  Space,
  Text,
  Loader,
  Stack,
  Title
} from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Poll } from "types";
import { NewPollButton } from "./new-poll-button";
import { PollEndedAlert } from "./poll-ended-alert";
import { PollOption } from "./poll-option";
import { SharePollButton } from "./share-poll-button";
import { AbsoluteCenter } from "../../components/absolute-center";
import { PollTimeRemaining } from "./poll-time-remaining";
import TimeAgo from "react-timeago";
import { Alert } from "../../components/alert";
import { type AxiosApiError } from "../../types";

export const PollResultPage = () => {
  const router = useRouter();
  const id = router.query.id as string | undefined;
  const [ended, setended] = useState(false);
  const {
    data: poll,
    isLoading,
    error
  } = useQuery<Poll, AxiosApiError>({
    queryKey: [`/polls/${id}`],
    enabled: !!id
  });

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
          <Stack gap="sm">
            {ended || poll.status === "ended" ? (
              <PollEndedAlert />
            ) : (
              <PollTimeRemaining
                time={poll.expires_at}
                oncomplete={() => setended(true)}
              />
            )}
            <Title c="indigo" order={3}>
              {poll.title}
            </Title>
            <Divider color="gray" />
            <Stack gap={5}>
              {poll.options.map((option) => (
                <PollOption
                  key={option._id}
                  option={option}
                  total={poll.total_votes}
                />
              ))}
              <Space />
              <Text style={{ alignSelf: "end" }} fw={700} size="sm">
                {poll.total_votes} total vote(s)
              </Text>
              <Space h="md" />
              <Group justify="space-between" style={{ width: "100%" }}>
                <Button
                  color="indigo"
                  onClick={() => router.push(`/${poll._id}`)}
                  disabled={ended || poll.status === "ended"}
                >
                  vote
                </Button>
                <SharePollButton />
              </Group>
              <Space h="md" />
              <Group justify="space-between" style={{ width: "100%" }}>
                <Text size="sm">
                  last updated <TimeAgo date={poll.updated_at} />
                </Text>
                <NewPollButton />
              </Group>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    );

  return null;
};
