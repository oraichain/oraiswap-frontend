module.exports = function (api) {
  api.cache(process.env.NODE_ENV === 'production');
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
