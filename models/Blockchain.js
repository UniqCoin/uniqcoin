/* eslint-disable class-methods-use-this */
const Block = require('./Block')
const Transaction = require('./Transaction')

const config = require('../config')


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
    let cumulativeDiff = 0
    this.blocks.forEach((block) => {
      cumulativeDiff += 16 ** block.difficulty
    })
    return cumulativeDiff
  }

  get genesisBlock() {
    const {
      nullAddress, nullPubKey, nullSignature, genesisDate, faucetAddress, faucetTxVal,
    } = config

    const initialFaucetTransaction = new Transaction(nullAddress, faucetAddress, faucetTxVal, 0,
      genesisDate, 'genesis transaction', nullPubKey, nullSignature)
    initialFaucetTransaction.minedInBlockIndex = 0
    initialFaucetTransaction.transferSuccessful = true

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

  getConfirmedTransactions() {
    return this.blocks.reduce((acc, cur) => {
      acc.push(...cur.transactions)
      return acc
    }, [])
  }

  getAllTransactions() {
    return this.getConfirmedTransactions().concat(this.pendingTransactions)
  }

  getAccountBalances() {
    const transactions = this.getConfirmedTransactions()
    const balances = transactions.reduce((acc, cur) => {
      const {
        from, to, fee, value, transferSuccessful,
      } = cur
      acc[from] = acc[from] || 0
      acc[to] = acc[to] || 0
      acc[from] -= fee
      if (transferSuccessful) {
        acc[from] -= value
        acc[to] += value
      }
      return acc
    }, {})

    // Remove all negative balances except for the genesis address
    Object.keys(balances).forEach((address) => {
      if (balances[address] < 0 && address !== config.nullAddress) {
        delete balances[address]
      }
    })
    return balances
  }

  getTransactionsByAddress(address) {
    // TODO: add validations
    let transactions = this.getAllTransactions()
    transactions = transactions.filter(transaction => transaction.from === address || transaction.to === address)
      .sort((a, b) => a.dateCreated.localeCompare(b.dateCreated))
    return { address, transactions }
  }

  getLastBlock() {
    return this.blocks.pop()
  }

  getLastBlockIndex() {
    return this.getLastBlock().index
  }

  createCoinbaseTransaction(toAddress) {
    const {
      nullAddress, coinbaseTxVal, nullPubKey, nullSignature,
    } = config
    const transaction = new Transaction(
      nullAddress,
      toAddress,
      coinbaseTxVal,
      0,
      new Date().toISOString(),
      'coinbase tx',
      nullPubKey,
      nullSignature,
    )
    transaction.minedInBlockIndex = this.getLastBlockIndex() + 1
    transaction.transferSuccessful = true
    return transaction
  }
}

module.exports = Blockchain
