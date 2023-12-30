export class ValidationFailed extends Error {
  private errorCode = 0;

  constructor(candidate: string, validation: string) {
    const message = candidate + " failed validation for " + validation;
    super(message);

    Object.setPrototypeOf(this, ValidationFailed.prototype);

    this.name = this.constructor.name;
  }

  getErrorCode(): number {
    return this.errorCode;
  }
}
