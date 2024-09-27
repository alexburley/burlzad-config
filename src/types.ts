import type { DeepPartial } from './utils/types.js';

export type ConfigSourceVariables = Record<string, string | undefined>;
export type BaseConfiguration = Record<string, unknown>;

export type DefaultConfigResolver<TConfig> = Record<
  'DEFAULT',
  (source: ConfigSourceVariables) => TConfig
>;

export type EnvironmentResolver<TEnv extends string, TConfig> = Record<
  TEnv,
  (source: ConfigSourceVariables) => DeepPartial<TConfig>
>;

export type EnvironmentResolvers<TEnv extends string, TConfig> = Partial<
  EnvironmentResolver<TEnv, TConfig>
> &
  DefaultConfigResolver<TConfig>;

export type ConfigOptions = Partial<{
  source: ConfigSourceVariables;
  env: string;
}>;
