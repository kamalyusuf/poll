import {
  Divider,
  Group,
  Paper,
  TextInput,
  InputWrapper,
  ActionIcon,
  Box,
  Button,
  ScrollArea
} from "@mantine/core";
import React, { useState, useEffect } from "react";
import { AbsoluteCenter } from "../../components/AbsoluteCenter";
import { Heading } from "../../components/Heading";
import {
  Formik,
  ArrayHelpers,
  Field,
  FieldArray as FormikFieldArray,
  FieldProps,
  Form
} from "formik";
import { MdOutlineAdd } from "react-icons/md";
import { AiOutlineMinus } from "react-icons/ai";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";
import { api } from "../../lib/api";
import { useRouter } from "next/router";
import { useWrappedMutation } from "../../hooks/useWrappedMutation";
import { toast } from "react-toastify";
import { CreatePollPayload, Poll } from "types";

const DatePicker = ReactDatePicker as any;
const FieldArray = FormikFieldArray as any;

const create = async (payload: CreatePollPayload) =>
  (
    await api.post<Poll>("/polls", payload).catch((e) => {
      throw e;
    })
  ).data;

export const CreatePollPage = () => {
  const [sd, setSd] = useState<Date | null>(null);
  const router = useRouter();
  const { mutateAsync } = useWrappedMutation<Poll, CreatePollPayload>(create, {
    onSuccess: (poll) => {
      router.push(`/${poll._id}`);
    }
  });

  useEffect(() => {
    setSd(new Date());
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
          padding={"xl"}
          shadow={"sm"}
          style={{
            position: "relative",
            backgroundColor: "#fff"
          }}
        >
          <Heading
            title="create a poll"
            color="indigo"
            order={3}
            align="center"
          />
          <Divider color="gray" labelPosition="center" />

          <Formik
            initialValues={{
              title: "",
              options: ["", ""],
              expires_at: new Date()
            }}
            onSubmit={async (values) => {
              const additional = 300000;
              const min = new Date().getTime() + additional;
              const difference = min - values.expires_at.getTime();

              if (Math.sign(difference) === 1)
                return toast.warn(
                  "poll end time must be at least 5 minutes from now"
                );

              return mutateAsync({
                ...values,
                expires_at: values.expires_at.toISOString()
              });
            }}
          >
            {({ isSubmitting, values }) => (
              <Form>
                <Group grow direction="column">
                  <Field name="title">
                    {({ field }: FieldProps) => (
                      <TextInput label="Title" required {...field} />
                    )}
                  </Field>

                  <FieldArray name="options">
                    {({ remove, push }: ArrayHelpers) => (
                      <Box>
                        <InputWrapper
                          label="Options"
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
                              if (values.options.length === 5) {
                                return;
                              }

                              push("");
                            }}
                          >
                            <MdOutlineAdd />
                          </ActionIcon>
                        </InputWrapper>

                        {values.options.length > 0 && (
                          <Group grow direction="column">
                            {values.options.map((options, idx) => (
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
                          </Group>
                        )}
                      </Box>
                    )}
                  </FieldArray>

                  <Field name="expires_at">
                    {({ field, form }: FieldProps) => {
                      const { setFieldValue } = form;
                      const { value } = field;

                      return (
                        <InputWrapper label="Ends" labelElement="div" required>
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
                        </InputWrapper>
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
                </Group>
              </Form>
            )}
          </Formik>
        </Paper>
      </ScrollArea>
    </AbsoluteCenter>
  );
};
