import { Button } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { AiOutlineShareAlt } from "react-icons/ai";

export const SharePollButton = ({ disabled }: { disabled?: boolean }) => {
  const clipboard = useClipboard({ timeout: 1500 });

  return (
    <Button
      color="indigo"
      variant="light"
      leftIcon={<AiOutlineShareAlt />}
      disabled={disabled}
      onClick={() => {
        clipboard.copy(window.location);
      }}
    >
      {clipboard.copied ? "copied" : "share"}
    </Button>
  );
};
