import {
  Divider,
  Paper,
  TextInput,
  Input,
  ActionIcon,
  Box,
  Button,
  ScrollArea,
  Stack,
  Title
} from "@mantine/core";
import { useState, useEffect, type ComponentType } from "react";
import { AbsoluteCenter } from "../../components/absolute-center";
import {
  Formik,
  ArrayHelpers,
  Field,
  FieldArray as FormikFieldArray,
  FieldArrayConfig,
  FieldProps,
  Form
} from "formik";
import { MdOutlineAdd } from "react-icons/md";
import { AiOutlineMinus } from "react-icons/ai";
import ReactDatePicker, { ReactDatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";
import { api } from "../../lib/api";
import { useRouter } from "next/router";
import { useWrappedMutation } from "../../hooks/use-wrapped-mutation";
import { CreatePollPayload, Poll } from "types";

const FieldArray = FormikFieldArray as ComponentType<FieldArrayConfig>;
const DatePicker = ReactDatePicker as ComponentType<ReactDatePickerProps>;

const create = async (payload: CreatePollPayload) =>
  (await api.post<Poll>("/polls", payload)).data;

export const CreatePollPage = () => {
  const [sd, setsd] = useState<Date | null>(null);
  const router = useRouter();
  const { mutateAsync } = useWrappedMutation<Poll, CreatePollPayload>(create);

  useEffect(() => {
    setsd(new Date());
  }, []);

  if (!sd) return null;

  return (
    <AbsoluteCenter>
      <ScrollArea
        style={{
          width: 500,
          height: 600
        }}
      >
        <Paper
          p="xl"
          shadow="sm"
          style={{
            position: "relative",
            backgroundColor: "#fff"
          }}
        >
          <Title color="indigo" order={3} align="center">
            create poll
          </Title>

          <Divider color="gray" labelPosition="center" />

          <Formik
            initialValues={{
              title: "",
              options: ["", ""],
              expires_at: new Date()
            }}
            onSubmit={async (values) => {
              return mutateAsync(
                {
                  ...values,
                  expires_at: values.expires_at.toISOString()
                },
                {
                  onSuccess: (poll) => {
                    router.push(`/${poll._id}`);
                  }
                }
              ).catch(() => {});
            }}
          >
            {({ isSubmitting, values }) => (
              <Form>
                <Stack>
                  <Field name="title">
                    {({ field }: FieldProps) => (
                      <TextInput
                        label="title"
                        required
                        {...field}
                        autoComplete="off"
                      />
                    )}
                  </Field>

                  <FieldArray name="options">
                    {({ remove, push }: ArrayHelpers) => (
                      <Box>
                        <Input.Wrapper
                          label="options"
                          labelElement="div"
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                          required
                        >
                          <ActionIcon
                            variant="filled"
                            color="indigo"
                            radius="xl"
                            size="sm"
                            onClick={() => {
                              if (values.options.length === 5) return;

                              push("");
                            }}
                          >
                            <MdOutlineAdd />
                          </ActionIcon>
                        </Input.Wrapper>

                        {values.options.length > 0 && (
                          <Stack>
                            {values.options.map((_options, idx) => (
                              <Field
                                name={`options.${idx}`}
                                key={`options.${idx}`}
                              >
                                {({ field }: FieldProps) => (
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center"
                                    }}
                                  >
                                    <TextInput
                                      sx={{ flex: 0.97 }}
                                      {...field}
                                      placeholder={`option #${idx + 1}`}
                                      autoComplete="off"
                                    />
                                    <ActionIcon
                                      variant="filled"
                                      size="sm"
                                      color="red"
                                      radius="xl"
                                      onClick={() => {
                                        if (values.options.length === 2) {
                                          return;
                                        }

                                        remove(idx);
                                      }}
                                    >
                                      <AiOutlineMinus />
                                    </ActionIcon>
                                  </div>
                                )}
                              </Field>
                            ))}
                          </Stack>
                        )}
                      </Box>
                    )}
                  </FieldArray>

                  <Field name="expires_at">
                    {({ field, form }: FieldProps) => {
                      const { setFieldValue } = form;
                      const { value } = field;

                      return (
                        <Input.Wrapper label="ends" labelElement="div" required>
                          <DatePicker
                            showTimeInput
                            {...field}
                            minDate={sd}
                            maxDate={addDays(sd, 7)}
                            timeIntervals={15}
                            showDisabledMonthNavigation
                            dateFormat="MMMM d, yyyy h:mm aa"
                            selected={value}
                            onChange={(val) => {
                              setFieldValue("expires_at", val);
                            }}
                            inline
                          />
                        </Input.Wrapper>
                      );
                    }}
                  </Field>

                  <Button
                    color="indigo"
                    type="submit"
                    disabled={
                      isSubmitting ||
                      values.options.length < 2 ||
                      !values.title.trim() ||
                      !values.expires_at ||
                      values.options.some((option) => !option)
                    }
                    loading={isSubmitting}
                  >
                    create
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Paper>
      </ScrollArea>
    </AbsoluteCenter>
  );
};
