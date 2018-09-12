const CryptoJS = require('crypto-js')
const EC = require('elliptic').ec

const secp256k1 = new EC('secp256k1')

class Transaction {
  constructor(from, to, value, fee, dateCreated, data, senderPubKey, senderSignature) {
    this.from = from
    this.to = to
    this.value = value
    this.fee = fee
    this.dateCreated = dateCreated
    this.data = data
    this.senderPubKey = senderPubKey
    this.senderSignature = senderSignature
    this.minedInBlockIndex = null
    this.transferSuccessful = null
    this.transactionDataHash = null
    this.calculateTransactionDataHash()
  }

  calculateTransactionDataHash() {
    const transactionDataJSON = JSON.stringify({
      from: this.from,
      to: this.to,
      value: this.value,
      fee: this.fee,
      dateCreated: this.dateCreated,
      data: this.data,
      senderPubKey: this.senderPubKey,
    })
    this.transactionDataHash = CryptoJS.SHA256(transactionDataJSON).toString()
  }

  verifySignature() {
    const { transactionDataHash, senderPubKey, senderSignature } = this
    const x = senderPubKey.substring(0, 64)
    const y = parseInt(senderPubKey.substring(64), 10)
    const pubKeyPt = secp256k1.curve.pointFromX(x, y)
    const keyPair = secp256k1.keyPair({ pub: pubKeyPt })
    return keyPair.verify(transactionDataHash, { r: senderSignature[0], s: senderSignature[1] })
  }
}

module.exports = Transaction
