const Wallet = require('../wallet-app/src/models/Wallet')

const wallet1 = new Wallet()
const wallet2 = new Wallet()
const sampleSignature = [
  '1205000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000040000000003000000000000000000000',
]


module.exports = {
  wallet1,
  wallet2,
  sampleSignature,
}
