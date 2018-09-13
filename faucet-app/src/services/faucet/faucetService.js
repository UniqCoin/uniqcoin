module.exports = function (app) {
  app.use('/api/coins', {
    get(params) {
      const { nodeURL, minerAddress } = params

      return Promise.resolve({
        ...params,
        msg: 'Hello from the server',
      })
    } 
  });
};