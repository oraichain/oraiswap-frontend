## Installation

```bash
# go to oraichain-wallet-v2/packages(cosmos|types|wc-client|wc-qrcode-modal|common) then yarn link
# then go back to the project
yarn link "@owallet/cosmos"
yarn link "@owallet/types"
yarn link "@owallet/wc-client"
yarn link "@owallet/wc-qrcode-modal"
yarn link "@owallet/common"

yarn && yarn start
```

## Build code

```bash
yarn build
```

If there is problem releated to `babel-preset-react-app` go to `node_modules/babel-preset-react-app` and run `yarn` then try again
