import {
  MissingEnvironmentError,
  InvalidEnvironmentError,
  MissingValuesError,
} from './errors.js';
import type {
  BaseConfiguration,
  EnvironmentResolvers,
  ConfigOptions,
} from './types.js';
import { flatten } from './utils/flatten.js';
import { merge } from './utils/merge.js';
import type { DeepReadonly } from './utils/types.js';

export const configure = <
  TEnv extends string,
  TConfig extends BaseConfiguration,
>(
  resolvers: EnvironmentResolvers<TEnv, TConfig>,
  options: ConfigOptions = {},
) => {
  const source = options.source || process.env;
  const env = options.env || process.env.NODE_ENV;

  const resolver = validate(resolvers, env);
  const configuration = merge(resolvers.DEFAULT(source), resolver(source));
  return verify(configuration);
};

const validate = <TEnv extends string, TConfig extends BaseConfiguration>(
  resolvers: EnvironmentResolvers<TEnv, TConfig>,
  env: string | undefined,
) => {
  if (!env) {
    throw new MissingEnvironmentError();
  }

  const resolver = resolvers[env as TEnv];

  if (!resolver) {
    throw new InvalidEnvironmentError(env);
  }

  return resolver;
};

const verify = <TConfig extends BaseConfiguration>(config: TConfig) => {
  const flattened = flatten(config);
  const invalid = Object.keys(flattened).flatMap((key) => {
    if (flattened[key] === undefined) {
      return [key];
    }
    return [];
  });

  if (invalid.length) {
    throw new MissingValuesError(invalid);
  }

  return config as DeepReadonly<TConfig>;
};
