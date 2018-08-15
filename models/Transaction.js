const CryptoJS = require('crypto-js')
const EC = require("elliptic").ec
const secp256k1 = new EC('secp256k1')

class Transaction {
    constructor(from, to, value, fee, dateCreated, data, senderPubKey) {
        this.from = from
        this.to = to
        this.value = value
        this.fee = fee
        this.dateCreated = dateCreated
        this.data = data
        this.senderPubKey = senderPubKey
    }

    calculateTransactionHash() {
        let transactionDataJSON = JSON.stringify(this)
        this.transactionHash = CryptoJS.SHA256(transactionDataJSON).toString()
    }

    sign(privateKey) {
        this.senderSignature = signData(this.transactionHash, privateKey)
    }
    
    verify() {
        this.transactionSuccessful = verifySignature(this.transactionHash, this.senderPubKey, this.senderSignature)
    }
}

function signData(data, privKey) {
    let keyPair = secp256k1.keyFromPrivate(privKey)
    let signature = keyPair.sign(data)
    return [signature.r.toString(16), signature.s.toString(16)]
}

function decompressPublicKey(pubKeyCompressed) {
    let pubKeyX = pubKeyCompressed.substring(0, 64)
    let pubKeyYOdd = parseInt(pubKeyCompressed.substring(64))
    let pubKeyPoint = secp256k1.curve.pointFromX(pubKeyX, pubKeyYOdd)
    return pubKeyPoint
}

function verifySignature(data, publicKey, signature) {
    let pubKeyPoint = decompressPublicKey(publicKey)
    let keyPair = secp256k1.keyPair({ pub: pubKeyPoint })
    let result = keyPair.verify(data, { r: signature[0], s: signature[1] })
    return result
}
