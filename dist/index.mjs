// src/errors/ValidationFailed.ts
var ValidationFailed = class _ValidationFailed extends Error {
  errorCode = 0;
  constructor(candidate, validation) {
    const message = candidate + " failed validation for " + validation;
    super(message);
    Object.setPrototypeOf(this, _ValidationFailed.prototype);
    this.name = this.constructor.name;
  }
  getErrorCode() {
    return this.errorCode;
  }
};

// src/errors/UndefinedValidationCandidate.ts
var UndefinedValidationCandidate = class _UndefinedValidationCandidate extends Error {
  errorCode = 0;
  constructor(validationAlias) {
    const message = "Undefined validation candidate for " + validationAlias;
    super(message);
    Object.setPrototypeOf(this, _UndefinedValidationCandidate.prototype);
    this.name = this.constructor.name;
  }
  getErrorCode() {
    return this.errorCode;
  }
};

// src/validators/SupraValidator.ts
var SupraValidator = class {
  validatorPresets;
  validators;
  constructor(validators = {}, presets = {}) {
    this.validators = validators;
    this.validatorPresets = presets;
  }
  saveValidatorList(presetAlias) {
    this.validatorPresets[presetAlias] = this.validators;
  }
  removePreset(alias) {
    delete this.validatorPresets[alias];
  }
  usePreset(alias) {
    this.validators = this.validatorPresets[alias];
  }
  addValidator(alias, validator, candidate) {
    this.validators[alias] = { validator, candidate };
  }
  removeValidator(alias) {
    delete this.validators[alias];
  }
  validate(data) {
    const result = { isValid: true, errors: {} };
    for (const alias in this.validators) {
      const { validator, candidate } = this.validators[alias];
      try {
        const injectedData = data?.[alias];
        if (injectedData !== void 0) {
          validator.validate(injectedData);
        } else if (candidate !== void 0) {
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
};

// src/validators/NotEmptyStringValidator.ts
var NotEmptyStringValidator = class {
  validate(string) {
    if (string.length <= 0) {
      throw new ValidationFailed(
        "Empty string",
        this.constructor.name
      );
    }
  }
};
export {
  NotEmptyStringValidator,
  SupraValidator
};
