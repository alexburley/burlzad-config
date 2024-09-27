<!-- ⚠️ This README has been generated from the file(s) "blueprint.md" ⚠️-->

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#burlzadconfig)

# ➤ @burlzad/config

A zero dependency utility library to build configs

## Introduction

`@burlzad/config` organizes configuration for your service.

It allows you to define different environments in which to run and
provide a system to resolve environment variables to configuration values.

It leans upon static typing to ensure access is valid and is simply a thin
layer to validate config is loaded correctly and allow you to access the types
you defined.

## Principles

- _Simple_ - Get started fast
- _Lightweight_ - A thin layer to abstract your config
- _Zero dependency_ - No worries about complicated dependency resolution

## Quick Start

1. Install

```bash
npm i @burlzad/config
```

2. Configure

```ts
export const config = configure({
  test: () => ({
    SOME_ENV_VAR: 'someTestEnvVar',
  }),
  production: () => ({
    SOME_ENV_VAR: 'someProdEnvVar',
  }),
  DEFAULT: (source = {}) => ({
    SOME_ENV_VAR: source.SOME_ENV_VAR || 'default',
  }),
});
```

3. Use

```ts
import config from './config';

if (config.SOME_ENV_VAR === 'someProdEnvVar') {
  doSomething();
}
```
