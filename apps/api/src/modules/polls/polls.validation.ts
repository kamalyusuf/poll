import {
  useCheckString,
  useCheckValidationResult,
  useCheckArrayOfType,
  useIsValidObjectId
} from "../../middlewares/validation";
import { RouteValidation } from "../../types";
import { isIsoDate } from "../../utils/is-iso-date";

const idOnly = [useIsValidObjectId(), useCheckValidationResult];

export const v: RouteValidation<"create" | "vote" | "get-by-id"> = {
  create: [
    useCheckString({
      path: "body.title",
      length: {
        min: 2
      }
    }),
    useCheckArrayOfType({
      type: "string",
      field_name: "options",
      length: {
        min: 2
      }
    }),
    useCheckString({
      path: "body.expires_at",
      escape: false,
      customs: [
        {
          fn: (value) => {
            if (!isIsoDate(value)) {
              throw new Error(`expected expires_at to be a valid iso string`);
            }

            return true;
          }
        }
      ]
    }),
    useCheckValidationResult
  ],
  vote: idOnly,
  "get-by-id": idOnly
};
