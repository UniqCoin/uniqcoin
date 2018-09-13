module.exports = function (app) {
  app.use('/api/coins', {
    get(params) {
      const { nodeURL, minerAddress } = params
      const faucetAddress = app.get('faucetAddress')
      const faucetPrivateKey = app.get('faucetPrivateKey')
      const faucetPublicKey = app.get('faucetAddress')
      const coins = Math.floor(Math.random() * (1000000 - 100000 + 1)) + min

      return Promise.resolve({
        ...params,
        msg: 'Hello from the server',
      })
    },
  })
}
