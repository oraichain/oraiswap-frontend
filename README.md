<h2 align="center">
  Oraidex's Frontend
</h2>

## Overview

This repository provides frontend code for Oraidex of [Oraichain](https://orai.io).

## Prerequisite

- A working contract described [here](https://github.com/oraichain/oraiswap)
- NodeJS 10+

## Installation

1. Git clone this repo to desired directory

```shell
git clone https://github.com/oraichain/oraiswap-frontend.git
```

2. Install required packages

```shell
yarn install
```

3. Dev it or build it

```shell
yarn start
yarn build

# typescript generated for scss
yarn ts-css
```

If there is a problem related to `babel-preset-react-app` go to `node_modules/babel-preset-react-app` and run `yarn` then try again

or add this into package.json

```json
"nohoist": [
      "**/babel-preset-react-app/@babel/runtime"
]
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

Released under the [Apache 2.0 License](LICENSE).

Happy comment
