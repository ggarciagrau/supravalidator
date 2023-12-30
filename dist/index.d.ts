interface IValidator {
    validate: (candidate: any) => void;
}

type ValidationResult = {
    isValid: boolean;
    errors: {
        [key: string]: string;
    };
};

type ValidatorList = {
    [alias: string]: {
        validator: IValidator;
        candidate?: any;
    };
};
type ValidatorPresetList = {
    [alias: string]: ValidatorList;
};
declare class SupraValidator {
    private validatorPresets;
    private validators;
    constructor(validators?: ValidatorList, presets?: ValidatorPresetList);
    saveValidatorList(presetAlias: string): void;
    removePreset(alias: string): void;
    usePreset(alias: string): void;
    addValidator(alias: string, validator: IValidator, candidate: any): void;
    removeValidator(alias: string): void;
    validate(data?: {
        [alias: string]: any;
    }): ValidationResult;
}

declare class NotEmptyStringValidator implements IValidator {
    validate(string: string): void;
}

export { type IValidator, NotEmptyStringValidator, SupraValidator, type ValidationResult };
