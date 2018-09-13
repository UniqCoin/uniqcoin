const Wallet = require('../wallet-app/src/models/Wallet')

const wallet1 = new Wallet()
const wallet2 = new Wallet()
const sampleSignature = [
  '1205000000000010000000000000000000000000000000000000000000000000',
  '0000000000001000000000000000000004000000000300000000000000000000',
]


module.exports = {
  wallet1,
  wallet2,
  sampleSignature,
}
