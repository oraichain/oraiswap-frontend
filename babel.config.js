module.exports = function (api) {
  api.cache(process.env.NODE_ENV === 'production');
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current'
          }
        }
      ]
    ],
    plugins: [
      [
        './plugins/operator-overloading',
        {
          enabled: true,
          classNames: ['BigDecimal']
        }
      ]
    ],
    ignore: [/node_modules/]
  };
};
