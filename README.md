### @gabortorma/mwm

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![code style][code-style-src]][code-style-href]

**M**ulti-repo **W**orkspace **M**anager

## Install globally

```bash
npm install -g @gabortorma/mwm
```

## Usage

```bash
mwm --help
```

### Init

```bash
mwm init --help
```

Init will initalize a new repo in a directory below the one you are positioned in.

```bash
mwm init -fix-replacements
```

```bash
mwm init --fixReplacements
```

This will replace the information in the template repository with the information you supply, either by prompts or command line. If omitted you will be prompted.

```bash
mwm init -organization <name>
```

```bash
mwm init --owner <name>
```

This will set the info of the "author"-field in the package.json to the user/organization <name>. Important: the <name> must exist in the .mwmrc or mwm.config file; see below, however, you will be asked to select a valid entry if you supply one that doesn't exist. If omitted you will be prompted.

```bash
mwm init --name <name>
```

This is the name the of the repo created in the Github of the "owner/author/organization". This will set the info of the"name"-field of the package.json to the <name>. If ommited you will be prompted.

```bash
mwm init -desc <desc>
```

```bash
mwm init --description <desc>
```

This will set the info of the "description"-field of the package.json to <desc>. If ommited you will be prompted.

```bash
mwm init --no-private
```

By default the repo created will be set private, by providing this switch you will make it public. You will not be prompted for this option if omitted.

```bash
mwm init --keywords <keywords>
```

This will set the info of the"keywords"-field of the package.json to <keywords>. The string must be enclosed in " and use commas between the keywords: "one,two,three". You will not be prompted for this option if omitted.

### Release

```bash
mwm release --help
```

### Generate

Generate new submodule from template

```bash
mwm generate --help
```

Required to declare minimum one owner with [GitHub token](https://github.com/settings/tokens) in the config file.

Recommended to use `.mwmrc` file for token and add it to `.gitignore`.

```
owners.NAME_OF_OWNER.token = ghp_xxxxx
```

Required scopes for the token:

- repo
- write:packages
- delete:packages
- delete_repo

## Config

You can use `mwm.config` or `.mwmrc` files for configuration.

MWM uses [unjs/c12](https://github.com/unjs/c12) for reading config files. Check the documentation for more information and all available options.

See the [loadConfig](./src/config.ts#L16) options.

### TypeScript config

You can use `defineMWMConfig` function in `mwm.config.ts` file to define the config with TypeScript support.

```ts
import { defineMWMConfig } from '@gabortorma/mwm'

export default defineMWMConfig({
  // your own config
})
```

## License

[MIT](./LICENSE) License © 2023-PRESENT [Gábor Torma](https://github.com/gabortorma)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@gabortorma/mwm?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/@gabortorma/mwm
[npm-downloads-src]: https://img.shields.io/npm/dm/@gabortorma/mwm?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/@gabortorma/mwm
[license-src]: https://img.shields.io/github/license/gabortorma/mwm.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/gabortorma/mwm/blob/main/LICENSE
[code-style-src]: https://antfu.me/badge-code-style.svg
[code-style-href]: https://github.com/gabortorma/antfu-eslint-config
