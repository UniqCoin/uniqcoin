/* eslint-disable class-methods-use-this */
const Block = require('./Block')
const Transaction = require('./Transaction')

const config = require('../config')

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

  calculateCumulativeDifficulty() {
    let totalDifficulty = 0
    this.blocks.forEach((block) => {
      totalDifficulty += block.difficulty
    })
    return totalDifficulty
  }

  get confirmedTransactions() {
    return this.blocks.reduce((accumulator, block) => accumulator.concat(block.transactions))
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


  get cumulativeDifficulty() {
    // TO DO
    return 0
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

  getAllTransactions() {
    return this.getConfirmedTransactions().concat(this.pendingTransactions)
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

  getConfirmedTransactions() {
    /**
     * verify initially,  'curr' returns [ Block{, transactions[,Transaction{}]}]
     * not Block[transactions[,Transaction{}]]
     */
    return this.blocks.reduce((acc, cur) => ([...acc, ...cur[0].transactions]), [])
  }

  getTransactionByHash(transactionDataHash) {
    const { chain } = this
    let transactionData = null
    const { blocks } = chain
    let counter = 0

    while (!transactionData || counter < blocks.length) {
      const currentBlock = blocks[counter]
      counter += 1
      transactionData = currentBlock.transactions
        .find(transaction => transaction.transactionDataHash === transactionDataHash)
    }

    return transactionData
  }

  getLastBlockIndex() {
    return this.getLastBlock().index
  }

  getLastBlock() {
    return this.blocks[this.blocks.length - 1]
  }

  /* eslint-disable no-restricted-syntax */
  getMiningJob(address) {
    const nextBlockIndex = this.blocks.length
    /* get pending transactions in json and parse and sort it */
    let pendingTransactions = JSON.parse(JSON.stringify(this.getPendingTransactions()))
      .sort((a, b) => a.fee - b.fee)
    /* create coinbase transaction and get confirmed transactions balances */
    const coinbaseTransaction = this.createCoinbaseTransaction(address)
    const balances = this.getAccountBalances()

    /**
      * looping pending transactions
      * and assigning pending balances default to zero if not exist to avoid bug
      */
    for (const transaction of pendingTransactions) {
      balances[transaction.from] = balances[transaction.from] || 0
      balances[transaction.to] = balances[transaction.to] || 0
      /* validate if balances of current account is greater than fee to create transaction */
      if (balances[transaction.from] >= transaction.fee) {
        transaction.minedInBlockIndex = nextBlockIndex
        balances[transaction.from] -= transaction.fee
        coinbaseTransaction.value += transaction.fee
        /* checks after fee the current value to be transacted not greater than current balance */
        if (balances[transaction.from] >= transaction.value) {
          balances[transaction.from] -= transaction.value
          balances[transaction.to] += transaction.value
          transaction.transferSuccessful = true
        } else {
          transaction.transferSuccessful = false
        }
      } else {
        /* remove a transaction when it does meet the above requirements */
        this.removePendingTransaction(transaction)
        pendingTransactions = pendingTransactions
          .filter(t => t.transactionDataHash !== transaction.transactionDataHash)
      }
    }
    /* auto calculate the hash */
    coinbaseTransaction.calculateTransactionDataHash()
    pendingTransactions = [coinbaseTransaction, ...pendingTransactions]

    const prevBlockHash = this.blocks[this.blocks.length - 1].blockHash
    const nextBlockCandidate = new Block(
      nextBlockIndex,
      pendingTransactions,
      this.currentDifficulty,
      prevBlockHash,
      address,
    )

    this.miningJobs[nextBlockCandidate.blockDataHash] = nextBlockCandidate
    return nextBlockCandidate
  }

  getPendingTransactions() {
    return this.pendingTransactions
  }

  getTransactionsByAddress(address) {
    // TODO: add validations
    let transactions = this.getAllTransactions()
    transactions = transactions
      .filter(transaction => transaction.from === address || transaction.to === address)
      .sort((a, b) => a.dateCreated.localeCompare(b.dateCreated))
    return { address, transactions }
  }

  removePendingTransaction(transaction) {
    const indexOfTransaction = this.pendingTransactions
      .findIndex(p => p.transactionDataHash === transaction.transactionDataHash)
    if (indexOfTransaction > 0) {
      this.pendingTransactions.splice(indexOfTransaction, 1)
    }
  }
}

module.exports = Blockchain