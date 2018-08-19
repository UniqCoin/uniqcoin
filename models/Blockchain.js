/* eslint-disable class-methods-use-this */
const Block = require('./Block')
const Transaction = require('./Transaction')


// constructor(index, difficulty, prevBlockHash, blockDataHash,
//   minedBy, nonce, dateCreated, blockHash) {
class Blockchain {
  constructor(blocks = [this.genesisBlock], currentDifficulty = 1) {
    this.blocks = blocks
    this.currentDifficulty = currentDifficulty
    this.miningJobs = {}
    this.pendingTransactions = []
  }

  /**
   * @param block, block to be added in chain
   */
  addNewBlock(block) {
    this.blocks.push(block)
  }

  get confirmedTransactions() {
    return this.blocks.reduce((accumulator, block) => accumulator.concat(block.transactions))
  }

  get cumulativeDifficulty() {
    // TO DO
    return 0
  }

  get genesisBlock() {
    const nullAddress = '0000000000000000000000000000000000000000'
    const nullPubKey = '00000000000000000000000000000000000000000000000000000000000000000'
    const nullSignature = [
      '0000000000000000000000000000000000000000000000000000000000000000',
      '0000000000000000000000000000000000000000000000000000000000000000',
    ]
    const genesisDate = new Date('08/06/2018').toISOString()

    const initialFaucetTransaction = new Transaction(nullAddress, 'faucetAddress', 1000000000, 0,
      genesisDate, 'genesis transaction', nullPubKey, nullSignature)
    initialFaucetTransaction.minedInBlockIndex = 0
    initialFaucetTransaction.transactionSuccessful = true

    return [new Block(0, [initialFaucetTransaction], 0, undefined, undefined, nullAddress,
      0, genesisDate, undefined)]
  }

  getTransactionByHash(transactionDataHash) {
    const { chain } = this
    let transactionData = null
    const { blocks } = chain
    let counter = 0

    while (!transactionData || counter < blocks.length) {
      const currentBlock = blocks[counter]
      counter += 1
      transactionData = currentBlock.transactions.find(transaction => transaction.transactionDataHash === transactionDataHash)
    }

    return transactionData
  }

  addNewTransaction(transaction) {
    const {
      from,
      to,
      value,
      fee,
      dateCreated,
      data,
      senderPubKey,
      senderSignature,
    } = transaction

    // TODO: add validations

    const newTransaction = new Transaction(from, to, value, fee, dateCreated, data,
      senderPubKey, senderSignature)

    if (this.getTransactionByHash(newTransaction.transactionDataHash)) {
      return { errorMsg: `Duplicate transaction: ${newTransaction.transactionDataHash}` }
    }

    // TODO: add more validations

    this.pendingTransactions.push(newTransaction)
    return newTransaction
  }
}

module.exports = Blockchain
