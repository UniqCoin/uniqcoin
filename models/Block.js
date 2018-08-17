const CryptoJs = require('crypto-js')

class Block {
  constructor(index, difficulty, prevBlockHash, blockDataHash,
    minedBy, nonce, dateCreated, blockHash) {
    this.index = index
    this.transactions = []
    this.difficulty = difficulty
    this.prevBlockHash = prevBlockHash
    this.blockDataHash = blockDataHash
    this.minedBy = minedBy
    this.nonce = nonce
    this.dateCreated = dateCreated
    this.blockHash = blockHash

    /**
     * Calculate blockdatahash when its undefined
     */
    if (!this.blockDataHash) this.calculateBlockDataHash()
    /**
     *  Calculate blockhash when it's null or undefined
     */
    if (!this.blockHash) this.calculateBlockHash()
  }

  /**
   * Should be triggered and  will calculate blockhash
   * will set blockhash 256bits hex value
   */
  calculateBlockHash() {
    const stringData = `${this.blockDataHash}|${this.dateCreated}|${this.nonce}`
    this.blockHash = CryptoJs.SHA256(stringData)
  }

  /**
   * Should triggered and will calculate blockdatahash
   * will set blockdatahash with 256bits hex value
   */
  calculateBlockDataHash() {
    const transactions = this.transactions.map(transaction => ({
      to: transaction.to,
      value: transaction.value,
      fee: transaction.fee,
      dateCreated: transaction.dateCreated,
      data: transaction.data,
      senderPubKey: transaction.senderPubKey,
      transactionDataHash: transaction.transactionDataHash,
      senderSignature: transaction.senderSignature,
      minedInBlockIndex: transaction.minedInBlockIndex,
      transferSuccessful: transaction.transferSuccessful,
    }))

    const blockData = {
      index: this.index,
      transactions,
      difficulty: this.difficulty,
      prevBlockHash: this.prevBlockHash,
      minedBy: this.minedBy,
    }

    const blockDataJSON = JSON.stringify(blockData)
    this.blockDataHash = CryptoJs.SHA256(blockDataJSON)
  }
}

module.exports = Block
