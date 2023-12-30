var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  NotEmptyStringValidator: () => NotEmptyStringValidator,
  SupraValidator: () => SupraValidator
});
module.exports = __toCommonJS(src_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NotEmptyStringValidator,
  SupraValidator
});
