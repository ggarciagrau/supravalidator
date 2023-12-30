import { ValidationFailed } from "../errors/ValidationFailed";
import { UndefinedValidationCandidate } from "../errors/UndefinedValidationCandidate";
import { IValidator } from "./interfaces/IValidator";
import { ValidationResult } from "./types/ValidationResult";

type ValidatorList = {
  [alias: string]: { validator: IValidator; candidate?: any };
};

type ValidatorPresetList = {
  [alias: string]: ValidatorList;
};

export class SupraValidator {
  private validatorPresets: ValidatorPresetList;
  private validators: ValidatorList;

  constructor(
    validators: ValidatorList = {},
    presets: ValidatorPresetList = {}
  ) {
    this.validators = validators;
    this.validatorPresets = presets;
  }

  saveValidatorList(presetAlias: string) {
    this.validatorPresets[presetAlias] = this.validators;
  }

  removePreset(alias: string) {
    delete this.validatorPresets[alias];
  }

  usePreset(alias: string) {
    this.validators = this.validatorPresets[alias];
  }

  addValidator(alias: string, validator: IValidator, candidate: any) {
    this.validators[alias] = { validator, candidate };
  }

  removeValidator(alias: string) {
    delete this.validators[alias];
  }

  validate(data?: { [alias: string]: any }): ValidationResult {
    const result: ValidationResult = { isValid: true, errors: {} };

    for (const alias in this.validators) {
      const { validator, candidate } = this.validators[alias];
      try {
        const injectedData = data?.[alias];

        if (injectedData !== undefined) {
          validator.validate(injectedData);
        } else if (candidate !== undefined) {
          validator.validate(candidate);
        } else {
          throw new UndefinedValidationCandidate(alias);
        }
      } catch (ex) {
        if (ex instanceof ValidationFailed) {
          result.isValid = false;
          result.errors[alias] = ex.message;
        } else {
          throw ex;
        }
      }
    }

    return result;
  }
}
