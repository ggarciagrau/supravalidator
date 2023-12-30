export class UndefinedValidationCandidate extends Error {
    private errorCode = 0;
  
    constructor(validationAlias: string) {
      const message = "Undefined validation candidate for " + validationAlias;
      super(message);
  
      Object.setPrototypeOf(this, UndefinedValidationCandidate.prototype);
  
      this.name = this.constructor.name;
    }
  
    getErrorCode(): number {
      return this.errorCode;
    }
  }
  