module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      [
        './plugins/operator-overloading',
        {
          classNames: ['BigDecimal']
        }
      ]
    ]
  };
};
