const path = require('path');

module.exports = {
  // ...otras configuraciones de webpack
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      // Agrega otros polyfills si es necesario
    },
  },
  // ...otras configuraciones de webpack
};
