import { test, describe, beforeEach, afterEach, expect } from 'vitest';
import { configure } from './configure.js';
import {
  InvalidEnvironmentError,
  MissingValuesError,
  MissingEnvironmentError,
  ErrorCodes,
  type IConfigErrorCodes,
} from './errors.js';

export const NodeEnvironments = {
  LOCAL: 'local',
  TEST: 'test',
  DEVELOPMENT: 'dev',
  STAGING: 'staging',
  PRODUCTION: 'production',
} as const;

describe.each`
  env                             | expectedEnvVar
  ${NodeEnvironments.LOCAL}       | ${'someLocalEnvVar'}
  ${NodeEnvironments.DEVELOPMENT} | ${'someDevEnvVar'}
  ${NodeEnvironments.STAGING}     | ${'someStagingEnvVar'}
  ${NodeEnvironments.PRODUCTION}  | ${'someProdEnvVar'}
`('Given environment is $env', ({ env, expectedEnvVar }) => {
  test(`returns ${expectedEnvVar} for the SOME_ENV_VAR key`, () => {
    const sut = configure(
      {
        local: () => ({
          SOME_ENV_VAR: 'someLocalEnvVar',
        }),
        dev: () => ({
          SOME_ENV_VAR: 'someDevEnvVar',
        }),
        staging: () => ({
          SOME_ENV_VAR: 'someStagingEnvVar',
        }),
        production: () => ({
          SOME_ENV_VAR: 'someProdEnvVar',
        }),
        DEFAULT: (source = {}) => ({
          SOME_ENV_VAR: source.SOME_ENV_VAR || 'default',
        }),
      },
      {
        env,
      },
    );
    expect(sut.SOME_ENV_VAR).toEqual(expectedEnvVar);
  });

  test('Should throw an InvalidEnvironmentError ', () => {
    expect.hasAssertions();
    const resolvers = {
      local: () => ({}),
      dev: () => ({}),
      staging: () => ({}),
      production: () => ({}),
      DEFAULT: (source: any) => ({
        SOME_ENV_VAR: source.SOME_ENV_VAR || 'default',
      }),
      [env]: undefined,
    };
    try {
      configure(resolvers, { env });
    } catch (e) {
      const err = e as Error & IConfigErrorCodes;
      expect(err).toBeInstanceOf(InvalidEnvironmentError);
      expect(err.name).toBe('InvalidEnvironmentError');
      expect(err.message).toBe(
        `Environment: ${env} is not valid. Ensure that a resolver is defined in the configuration`,
      );
      expect(err.code).toBe('ERR_INVALID_ENVIRONMENT');
    }
  });
});

test('Given a set of nested configuration, it should merge them together', () => {
  const resolvers = {
    test: () => ({
      single_level_nesting: true,
      nested: {
        double_level_nesting: true,
        nested: {
          triple_level_nesting: true,
        },
      },
      controlTest: true,
    }),
    DEFAULT: () => ({
      single_level_nesting: false,
      nested: {
        double_level_nesting: false,
        nested: {
          triple_level_nesting: false,
        },
      },
      controlDefault: true,
    }),
  };

  const result = configure(resolvers);

  expect(result).toEqual({
    single_level_nesting: true,
    nested: {
      double_level_nesting: true,
      nested: {
        triple_level_nesting: true,
      },
    },
    controlTest: true,
    controlDefault: true,
  });

  expect(configure(resolvers));
});

test('When the configuration resolution identifies missing values, it should throw a MissingValuesError', () => {
  expect.hasAssertions();

  try {
    configure({
      test: (src: any) => ({}),
      DEFAULT: (src) => ({
        foo: { bar: src.BAR },
        fizz: src.FIZZ,
        buzz: null,
      }),
    });
  } catch (e) {
    const err = e as Error & IConfigErrorCodes;
    expect(err).toBeInstanceOf(MissingValuesError);
    expect(err.name).toBe('MissingValuesError');
    expect(err.message).toBe(
      'Missing values in the configuration: foo.bar, fizz. Ensure that these values are provided in the source',
    );
    expect(err.code).toBe('ERR_MISSING_SOURCE_VALUES');
  }
});

describe('Given no environment is provided', () => {
  let env: any;

  beforeEach(() => {
    env = process.env.NODE_ENV;
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env.NODE_ENV = env;
  });

  test('Should throw a MissingEnvironmentError', () => {
    expect.hasAssertions();

    try {
      configure({
        DEFAULT: (src) => ({}),
      });
    } catch (e) {
      const err = e as Error & IConfigErrorCodes;
      expect(err).toBeInstanceOf(MissingEnvironmentError);
      expect(err.name).toBe('MissingEnvironmentError');
      expect(err.message).toBe(
        'Missing environment to resolve configuration. This can be provided as the NODE_ENV, as an option, or specified as a default',
      );
      expect(err.code).toBe('ERR_MISSING_ENVIRONMENT');
    }
  });
});

test('Should export error codes', () => {
  expect(ErrorCodes).toEqual({
    InvalidEnvironment: 'ERR_INVALID_ENVIRONMENT',
    MissingEnvironment: 'ERR_MISSING_ENVIRONMENT',
    MissingValues: 'ERR_MISSING_SOURCE_VALUES',
  });
});
