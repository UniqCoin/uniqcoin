const CryptoJs = require('crypto-js')
const Transaction = require('./Transaction')

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

  isTransactionsValid() {
    let isValid = true
    for (let a = 0, txLen = this.transactions.length; a < txLen; a++) {
      const txData = this.transactions[a]
      const { transactionDataHash, minedInBlockIndex } = txData
      const tx = new Transaction(txData.from, txData.to,
        txData.value, txData.fee, txData.dateCreated,
        txData.data, txData.senderPubKey, txData.senderSignature)
      const txDataHashRecalculated = tx.transactionDataHash

      if (transactionDataHash !== txDataHashRecalculated
        || this.index !== minedInBlockIndex) {
        // TODO transferSuccessful recalculation?
        isValid = false
        break
      }
    }

    return isValid
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
      dateCreated: transaction.dateCreated,
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
