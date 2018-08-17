const CryptoJS = require('crypto-js')
const EC = require('elliptic').ec

const secp256k1 = new EC('secp256k1')

class Transaction {
  constructor(from, to, value, fee, dateCreated, data, senderPubKey,
    transactionDataHash, senderSignature, minedInBlockIndex,
    transferSuccessful) {
    this.from = from
    this.to = to
    this.value = value
    this.fee = fee
    this.dateCreated = dateCreated
    this.data = data
    this.senderPubKey = senderPubKey
    this.transactionHash = transactionDataHash
    this.senderSignature = senderSignature
    this.minedInBlockIndex = minedInBlockIndex
    this.transactionSuccessful = transferSuccessful
    if (!transactionDataHash) this.calculateTransactionDataHash()
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
    this.transactionHash = CryptoJS.SHA256(transactionDataJSON).toString()
  }

  // sign(privateKey) {
  //   this.senderSignature = signData(this.transactionHash, privateKey)
  // }

  // verify() {
  //   this.transactionSuccessful = verifySignature(this.transactionHash, this.senderPubKey, this.senderSignature)
  // }
}


// function signData(data, privKey) {
  //   const keyPair = secp256k1.keyFromPrivate(privKey)
  //   const signature = keyPair.sign(data)
  //   return [signature.r.toString(16), signature.s.toString(16)]
  // }
  
  // function decompressPublicKey(pubKeyCompressed) {
    //   const pubKeyX = pubKeyCompressed.substring(0, 64)
    //   const pubKeyYOdd = parseInt(pubKeyCompressed.substring(64))
    //   const pubKeyPoint = secp256k1.curve.pointFromX(pubKeyX, pubKeyYOdd)
    //   return pubKeyPoint
    // }
    
    // function verifySignature(data, publicKey, signature) {
      //   const pubKeyPoint = decompressPublicKey(publicKey)
      //   const keyPair = secp256k1.keyPair({ pub: pubKeyPoint })
      //   const result = keyPair.verify(data, { r: signature[0], s: signature[1] })
      //   return result
      // }
module.exports = Transaction
