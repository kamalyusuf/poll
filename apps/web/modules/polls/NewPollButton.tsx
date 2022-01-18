import { Button } from "@mantine/core";
import React from "react";
import { MdOutlineAdd } from "react-icons/md";
import { useRouter } from "next/router";

export const NewPollButton = () => {
  const router = useRouter();

  return (
    <Button
      leftIcon={<MdOutlineAdd />}
      color="dark"
      onClick={() => router.push("/")}
    >
      new poll
    </Button>
  );
};
