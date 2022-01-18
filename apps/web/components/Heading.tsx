import { Title, TitleProps } from "@mantine/core";
import { Color } from "../types";
import { parseColor } from "../utils/color";

export const Heading = ({
  title,
  color,
  ...props
}: TitleProps & { title: string; color?: Color }) => {
  return (
    <>
      <Title
        order={2}
        sx={(theme) => ({
          color: color ? `${parseColor(theme, color)} !important` : undefined
        })}
        {...props}
      >
        {title}
      </Title>
    </>
  );
};
