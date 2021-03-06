import {
  Container,
  Paper,
  RadioGroup,
  Radio,
  Divider,
  Group,
  Button,
  Box,
  Space,
  Text,
  Loader
} from "@mantine/core";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Heading } from "../../components/Heading";
import { useQuery } from "react-query";
import { ApiError, Poll, VotePollPayload, PollStatus } from "types";
import { api } from "../../lib/api";
import { useWrappedMutation } from "../../hooks/useWrappedMutation";
import { BiUpvote } from "react-icons/bi";
import ReactTimeAgo from "react-timeago";
import { AxiosError } from "axios";
import { ErrorAlert } from "../../components/ErrorAlert";
import { SharePollButton } from "./SharePollButton";
import { NewPollButton } from "./NewPollButton";
import { AbsoluteCenter } from "../../components/AbsoluteCenter";
import { PollTimeRemaining } from "./PollTimeRemaining";
import { useMounted } from "../../hooks/useMounted";

const TimeAgo = ReactTimeAgo as any;

const vote = async (id: string, payload: VotePollPayload) =>
  (
    await api
      .post<{ poll: Poll; vid: string }>(`/polls/${id}/vote`, payload)
      .catch((e) => {
        throw e;
      })
  ).data;

export const VotePollPage = () => {
  const mounted = useMounted();
  const router = useRouter();
  const id: string | undefined =
    typeof router.query.id === "string" ? router.query.id : undefined;
  const {
    data: poll,
    error,
    isLoading: isLoadingPoll
  } = useQuery<Poll, AxiosError<ApiError>>(`/polls/${id}`, {
    enabled: Boolean(id && mounted)
  });
  const [value, setValue] = useState("");
  const { mutateAsync, isLoading } = useWrappedMutation<
    { poll: Poll; vid: string },
    VotePollPayload
  >((variables) => vote(poll._id, variables), {
    onSuccess: ({ poll }) => {
      router.push(`/${poll._id}/r`);
    }
  });
  const [ended, setEnded] = useState(poll?.status === PollStatus.ENDED);

  if (isLoadingPoll)
    return (
      <AbsoluteCenter>
        <Loader size="lg" color="indigo" />
      </AbsoluteCenter>
    );

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
        <Group direction="column" spacing="xs" grow>
          <Box>
            <Heading
              title="cast a vote"
              color="indigo"
              align="center"
              order={3}
            />
            <Divider color="dark" />
          </Box>
          <PollTimeRemaining
            time={poll.expires_at}
            onComplete={() => setEnded(true)}
          />
          <RadioGroup
            label={poll.title}
            required
            color="indigo"
            spacing="md"
            value={value}
            onChange={setValue}
          >
            {poll.options.map((option) => (
              <Radio key={option._id} value={option._id} disabled={ended}>
                {option.value}
              </Radio>
            ))}
          </RadioGroup>
          <Space />
          <Group position="apart">
            <Button
              color="indigo"
              onClick={() => {
                if (!value) return;

                mutateAsync({ option_id: value }).catch(() => {});
              }}
              loading={isLoading}
              disabled={isLoading || ended}
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
        </Group>
      </Paper>
    </Container>
  );
};
