export const ErrorCodes = {
  MissingEnvironment: 'ERR_MISSING_ENVIRONMENT',
  InvalidEnvironment: 'ERR_INVALID_ENVIRONMENT',
  MissingValues: 'ERR_MISSING_SOURCE_VALUES',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export type IConfigErrorCodes = {
  code: ErrorCode;
};

export class MissingEnvironmentError
  extends Error
  implements IConfigErrorCodes
{
  code = ErrorCodes.MissingEnvironment;
  constructor() {
    super(
      `Missing environment to resolve configuration. This can be provided as the NODE_ENV, as an option, or specified as a default`,
    );
    this.name = 'MissingEnvironmentError';
  }
}

export class InvalidEnvironmentError
  extends Error
  implements IConfigErrorCodes
{
  code = ErrorCodes.InvalidEnvironment;
  constructor(env: string) {
    super(
      `Environment: ${env} is not valid. Ensure that a resolver is defined in the configuration`,
    );
    this.name = 'InvalidEnvironmentError';
  }
}

export class MissingValuesError extends Error implements IConfigErrorCodes {
  code = ErrorCodes.MissingValues;
  constructor(values: string[]) {
    super(
      `Missing values in the configuration: ${values.join(
        ', ',
      )}. Ensure that these values are provided in the source`,
    );
    this.name = 'MissingValuesError';
  }
}
