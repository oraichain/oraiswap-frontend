<h2 align="center">
  Oraidex Explorer's Frontend
</h2>

# Oraichain

![Banner!](https://cdn.discordapp.com/attachments/1014117272132010017/1014117366407381073/Full_Logo_Horizontal_BG-white.png)

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
```

If there is problem releated to `babel-preset-react-app` go to `node_modules/babel-preset-react-app` and run `yarn` then try again

or add this into package.json

```json
"nohoist": [
      "**/babel-preset-react-app/@babel/runtime"
]
```

## Contributing
Please read [CONTRIBUTING.md](https://github.com/oraichain/oraiswap-frontend/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

Released under the [Apache 2.0 License](https://github.com/oraichain/oraiswap-frontend/LICENSE).
