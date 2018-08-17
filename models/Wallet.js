/* eslint-disable class-methods-use-this */

const EC = require('elliptic').ec
const crypto = require('crypto-js')

const secp256k1 = new EC('secp256k1')
const keypair = secp256k1.genKeyPair()

class Wallet {
  constructor(data) {
    /**
     * generate wallet when instantiated and has no private key as param
     */
    if (!data.privateKey) this.generateWallet()
    /**
     *  recover, find wallet given the private key as param
     */
    if (data.privateKey) this.recoverWallet(data.privateKey)
  }

  /**
   * Should be trigger and generate a wallet
   */
  generateWallet() {
    /**
     * generate random private key
     * generated public key from keypair with private key
     * returns address, publicKey from compressed generated publick key
     */
    const generatedPrivKey = keypair.getPrivate('hex')
    const generatedPubkey = keypair.getPublic()
    const { address, publicKey } = this.getCompressedPublicKeyAndAddress(generatedPubkey)
    this.privateKey = generatedPrivKey
    this.setDataAddressAndPublicKey(address, publicKey)
  }

  /**
   *  Should trigger and will return Public key and address
   * @param pk, public key
   */
  getCompressedPublicKeyAndAddress(pk) {
    /**
     * encode given public key that was compressed
     * x, get value from character 2 upto the end of string compressed public key
     * y, get value from character 0 to 2 of string
     * x + remainder of y (odd or even formula) , 0aefafg(0|1)
     * turn string|hash to hash RIPEMD160
     */
    let compressedPubKey = pk.encodeCompressed('hex')
    const x = compressedPubKey.substring(2, compressedPubKey.length)
    const y = compressedPubKey.substring(0, 2)
    compressedPubKey = x + (y % 2)
    const address = crypto.RIPEMD160(compressedPubKey).toString()

    return { publicKey: compressedPubKey, address }
  }

  /**
   * Should trigger and recover wallet given
   * @param  privateKey of user
   */
  recoverWallet(privateKey) {
    this.privateKey = privateKey
    // return 256bits or 32bytes(8bits === 1byte) hex form of string
    const key = secp256k1.keyFromPrivate(privateKey)
    const generatedPubKey = key.getPublic()
    const { address, publicKey } = this.getCompressedPublicKeyAndAddress(generatedPubKey)
    this.setDataAddressAndPublicKey(address, publicKey)
  }

  /**
   * Set fields values, address and public key
   */
  setDataAddressAndPublicKey(address, publicKey) {
    this.address = address
    this.publicKey = publicKey
  }
}

module.exports = Wallet
