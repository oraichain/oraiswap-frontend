module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      [
        '@oraichain/operator-overloading',
        {
          classNames: ['BigDecimal']
        },
        "@babel/plugin-proposal-import-wasm-source"
      ]
    ]
  };
};
