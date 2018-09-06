const CryptoJs = require('crypto-js')

class Block {
  constructor(index, transactions, difficulty, prevBlockHash, blockDataHash,
    minedBy, nonce, dateCreated, blockHash) {
    this.index = index
    this.transactions = transactions
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
    if (!this.blockDataHash) this.blockDataHash = this.calculateBlockDataHash()
    /**
     *  Calculate blockhash when it's null or undefined
     */
    if (!this.blockHash) this.blockHash = this.calculateBlockHash()
  }

  /**
   * Should be triggered and  will calculate blockhash
   * will set blockhash 256bits hex value
   */
  calculateBlockHash() {
    const stringData = `${this.blockDataHash}|${this.dateCreated}|${this.nonce}`
    return CryptoJs.SHA256(stringData).toString()
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
      dateCreated: new Date(transaction.dateCreated).toISOString(),
      data: transaction.data,
      senderPubKey: transaction.senderPubKey,
      transactionDataHash: transaction.transactionDataHash,
      senderSignature: transaction.senderSignature,
      minedInBlockIndex: transaction.minedInBlockIndex,
      transferSuccessful: transaction.transferSuccessful,
    }))

    /**
     * Block data, values of block
     * should be in order to have exact value
     */
    const blockData = {
      index: this.index,
      transactions,
      difficulty: this.difficulty,
      prevBlockHash: this.prevBlockHash,
      minedBy: this.minedBy,
    }

    const blockDataJSON = JSON.stringify(blockData)
    return CryptoJs.SHA256(blockDataJSON).toString()
  }
}

module.exports = Block
