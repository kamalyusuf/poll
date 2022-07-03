import { MantineTheme } from "@mantine/core";

export const styles = {
  TextInput: (theme: MantineTheme) => ({
    input: {
      "&:focus": {
        borderColor: theme.colors.indigo[6]
      }
    },
    required: {
      color: theme.primaryColor
    }
  }),
  Input: (theme: MantineTheme) => ({
    input: {
      "&:focus": {
        borderColor: theme.colors.indigo[6]
      }
    },
    required: {
      color: theme.primaryColor
    }
  }),
  PasswordInput: (theme: MantineTheme) => ({
    input: {
      "&:focus": {
        borderColor: theme.colors.indigo[6]
      }
    },
    required: {
      color: theme.primaryColor
    }
  }),
  Menu: (theme: MantineTheme) => ({
    itemHovered: {
      backgroundColor: theme.colors.gray[2]
    }
  })
};
