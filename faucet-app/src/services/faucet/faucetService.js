const CryptoJS = require('crypto-js')
const isUrl = require('is-url')
const elliptic = require('elliptic')
const axios = require('axios')
const Wallet = require('./../../models/Wallet')

const secp256k1 = new elliptic.ec('secp256k1')

module.exports = function (app) {
  app.use('/api/coins', {
    async get(params) {
      const { nodeURL, minerAddress } = params

      if (!isUrl(nodeURL)) {
        return Promise.resolve({ errorMsg: `Invalid node URL ${nodeURL}` })
      }

      const privateKey = app.get('faucetPrivateKey')
      const wallet = new Wallet({ privateKey })
      const { address, publicKey } = wallet
      const coins = Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000
      const transaction = {
        from: address,
        to: minerAddress,
        value: coins,
        fee: 10,
        dateCreated: new Date().toISOString(),
        senderPubKey: publicKey,
      }
      const transactionJSON = JSON.stringify(transaction)
      const transactionDataHash = CryptoJS.SHA256(transactionJSON).toString()
      const keyPair = secp256k1.keyFromPrivate(privateKey)
      const signature = keyPair.sign(transactionDataHash)
      const senderSignature = [signature.r.toString(16), signature.s.toString(16)]
      const signedTransaction = Object.assign(transaction, { transactionDataHash, senderSignature })
      const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify(signedTransaction),
        url: `${nodeURL.endsWith('/') ? nodeURL : `${nodeURL}/`}transactions/send`,
      }

      let sendTxResponse
      try {
        const res = await axios(options)
        sendTxResponse = {
          message: `Tx hash ${res.data}!`
            + `\nSuccessfully sent ${coins} coins to ${minerAddress}`,
        }
      } catch (error) {
        console.log(error)
        console.log(signature)
        console.log(senderSignature)
        console.log('error')
        sendTxResponse = { message: 'Internal server Error' }
      }

      return Promise.resolve(sendTxResponse)
    },
  })
}
