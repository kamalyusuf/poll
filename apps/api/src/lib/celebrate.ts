import { Modes, celebrator } from "celebrate";

export const celebrate = celebrator(
  { mode: Modes.FULL },
  {
    allowUnknown: false,
    presence: "required",
    abortEarly: false,
    errors: {
      wrap: {
        label: false
      }
    },
    messages: {
      "any.invalid": "invalid {#label}"
    }
  }
);
