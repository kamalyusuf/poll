import {
  Button,
  Container,
  Divider,
  Group,
  Paper,
  Space,
  Text,
  Loader
} from "@mantine/core";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { ApiError, Poll, PollStatus } from "types";
import { ErrorAlert } from "../../components/ErrorAlert";
import { Heading } from "../../components/Heading";
import { NewPollButton } from "./NewPollButton";
import PollEndedAlert from "./PollEndedAlert";
import { PollOption } from "./PollOption";
import { SharePollButton } from "./SharePollButton";
import TimeAgo from "react-timeago";
import { AbsoluteCenter } from "../../components/AbsoluteCenter";
import { PollTimeRemaining } from "./PollTimeRemaining";

export const PollResultPage = () => {
  const router = useRouter();
  const id = router.query.id as string | undefined;
  const {
    data: poll,
    error,
    isLoading
  } = useQuery<Poll, AxiosError<ApiError>>(`/polls/${id}`, {
    enabled: !!id
  });
  const [ended, setEnded] = useState(false);

  if (isLoading) {
    return (
      <AbsoluteCenter>
        <Loader size="lg" color="indigo" />
      </AbsoluteCenter>
    );
  }

  if (error) return <ErrorAlert error={error} />;

  if (!poll) return null;

  return (
    <Container size="md">
      <Paper
        padding={"xl"}
        shadow={"sm"}
        radius="md"
        style={{
          marginTop: 60,
          position: "relative",
          maxWidth: 600,
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
        <Group direction="column" grow spacing="sm">
          {ended || poll.status === PollStatus.ENDED ? (
            <PollEndedAlert />
          ) : (
            <PollTimeRemaining
              time={poll.expires_at}
              onComplete={() => setEnded(true)}
            />
          )}
          <Heading title={poll.title} color="indigo" order={3} />
          <Divider color="gray" />
          <Group direction="column" spacing={5}>
            {poll.options.map((option) => (
              <PollOption
                key={option._id}
                option={option}
                total={poll.total_votes}
              />
            ))}
            <Space />
            <Text sx={{ alignSelf: "end" }} weight={700} size="sm">
              {poll.total_votes} total vote(s)
            </Text>
            <Space h="md" />
            <Group position="apart" style={{ width: "100%" }}>
              <Button
                color="indigo"
                onClick={() => router.push(`/${poll._id}`)}
                disabled={ended || poll.status === PollStatus.ENDED}
              >
                cast a vote
              </Button>
              <SharePollButton />
            </Group>
            <Space h="md" />
            <Group position="apart" style={{ width: "100%" }}>
              <Text size="sm">
                last updated <TimeAgo date={poll.updated_at} />
              </Text>
              <NewPollButton />
            </Group>
          </Group>
        </Group>
      </Paper>
    </Container>
  );
};
