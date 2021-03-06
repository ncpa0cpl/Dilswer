import type { AllDataTypes } from "..";
import type { ParseDataType, ReWrap } from "../type-utils";
import type { ValidationError } from "./validation-error/validation-error";
import { validateType } from "./validators/validate-type";

/**
 * Higher order function that generates a new function which will
 * check the provided `data` against the `dataType` type
 * structure, and if the check is successful then the first
 * callback `onValidationSuccess` is invoked with `data` as it's
 * argument, otherwise the second callback `onValidationError` is
 * invoked with the type validation error as it's argument
 * (unless the callback is not specified).
 */
export const createTypeGuardedFunction = <
  DT extends AllDataTypes,
  R,
  ER = void
>(
  dataType: DT,
  onValidationSuccess: (data: ReWrap<ParseDataType<DT>>) => R,
  onValidationError?: (error: ValidationError, passedData: unknown) => ER
) => {
  const caller = (data: unknown): R | ER => {
    try {
      validateType("$", dataType, data);
      // @ts-expect-error
      return onValidationSuccess(data);
    } catch (e) {
      // @ts-expect-error
      return onValidationError
        ? onValidationError(e as ValidationError, data)
        : void 0;
    }
  };

  return caller;
};

/** Function alias for the `createTypeGuardedFunction`. */
export const createValidatedFunction = createTypeGuardedFunction;
