import { IValidator } from "./interfaces/IValidator";
import { ValidationFailed } from "../errors/ValidationFailed";

export class NotEmptyStringValidator implements IValidator {
  validate(string: string) {
      if (string.length <= 0) {
      throw new ValidationFailed(
        "Empty string",
        this.constructor.name
      );
    }
  }
}
