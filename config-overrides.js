const { override } = require('customize-cra');

module.exports = override((config) => {
  // Asegúrate de modificar la configuración de Webpack
  if (config.optimization) {
    config.optimization.minimize = false;
  } else {
    config.optimization = {
      minimize: false,
    };
  }

  return config;
});