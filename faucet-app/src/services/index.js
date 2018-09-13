// eslint-disable-next-line no-unused-vars
const faucetService = require('./faucet/faucetService')

module.exports = function (app) {
  app.configure(faucetService)
};
