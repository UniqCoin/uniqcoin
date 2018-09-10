/* eslint-disable class-methods-use-this */
const Block = require('./Block')
const Transaction = require('./Transaction')
const Validation = require('../helpers/Validation')
const config = require('../config')

class Blockchain {
  constructor(blocks = [this.genesisBlock], currentDifficulty = 4) {
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

  get cumulativeDifficulty() {
    let cumulativeDiff = 0
    this.blocks.forEach((block) => {
      cumulativeDiff += 16 ** block.difficulty
    })
    return cumulativeDiff
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
    if (!Validation.isValidAddress(from)) {
      return { errorMsg: `Invalid sender address: ${from}` }
    }
    if (!Validation.isValidAddress(to)) {
      return { errorMsg: `Invalid receiver address: ${to}` }
    }

    const newTransaction = new Transaction(from, to, value, fee, dateCreated, data,
      senderPubKey, senderSignature)

    if (this.getTransactionByHash(newTransaction.transactionDataHash)) {
      return { errorMsg: `Duplicate transaction: ${newTransaction.transactionDataHash}` }
    }

    // TODO: add more validations

    this.pendingTransactions.push(newTransaction)
    return newTransaction
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

    return new Block(0, [initialFaucetTransaction], 0, undefined, undefined, nullAddress,
      0, genesisDate, undefined)
  }

  getConfirmedTransactions() {
    return this.blocks.reduce((acc, cur) => {
      acc.push(...cur.transactions)
      return acc
    }, [])
  }

  getTransactionByHash(transactionDataHash) {
    const { blocks } = this
    let transactionData = null
    let counter = 0

    while (!transactionData && counter < blocks.length) {
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
    let pendingTransactions = JSON.parse(JSON.stringify(this.pendingTransactions))
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
      address
    )

    this.miningJobs[nextBlockCandidate.blockDataHash] = nextBlockCandidate
    return nextBlockCandidate
  }

  getTransactionsByAddress(address) {
    // TODO: add validations
    let transactions = this.getAllTransactions()
    transactions = transactions
      .filter(transaction => transaction.from === address || transaction.to === address)
      .sort((a, b) => a.dateCreated.localeCompare(b.dateCreated))
    return { address, transactions }
  }

  removePendingTransactions(transactions) {
    for (const t of transactions) {
      this.pendingTransactions = this.pendingTransactions.filter(item => item.transactionDataHash !== t.transactionDataHash)
    }
  }

  submitMinedBlock(minedBlock) {
    const block = this.miningJobs[minedBlock.blockDataHash]
    const error = { errorMsg: 'Block not found or already mined' }
    if (!block) return error

    const {
      nonce, dateCreated, blockDataHash, blockHash,
    } = minedBlock
    block.nonce = nonce
    block.dateCreated = dateCreated
    block.blockHash = blockHash
    block.blockDataHash = blockDataHash

    const isValid = this.isBlockValid(block)
    if (!isValid) return error

    this.blocks.push(block)
    this.miningJobs = {}
    this.removeMinedTransactions(block)
    return { message: `Block accepted, reward paid: ${block.transactions[0].value} microcoins` }
  }

  isBlockValid(block) {
    const lastBlock = this.getLastBlock()

    return block.index === this.blocks.length && lastBlock.blockHash === block.prevBlockHash
      && block.calculateBlockHash() === block.blockHash
  }

  removeMinedTransactions(block) {
    const minedTransactionHashes = block.transactions
      .reduce((acc, cur) => acc.add(cur.transactionDataHash), new Set())
    this.pendingTransactions = this.pendingTransactions
      .filter(transaction => !minedTransactionHashes.has(transaction.transactionDataHash))
  }

  updatePendingTransactions() {

  }

  removePendingTransaction(transaction) {
    const indexOfTransaction = this.pendingTransactions
      .findIndex(p => p.transactionDataHash === transaction.transactionDataHash)
    if (indexOfTransaction > 0) {
      this.pendingTransactions.splice(indexOfTransaction, 1)
    }
  }

  getAccountBalanceByAddress(address) {
    const transactions = this.getAccountBalanceByAddress(address)
    const balance = {
      safeBalance: 0,
      confirmedBalance: 0,
      pendingBalance: 0,
    }

    const safeValue = this.blocks.length - config.safeConfirmCount
    transactions.forEach((transaction) => {
      if (transaction.to === address) {
        if (transaction.minedInBlockIndex === null) {
          balance.pendingBalance += transaction.value
        }
        if (transaction.minedInBlockIndex <= safeValue && transaction.transferSuccessful) {
          balance.safeBalance += transaction.value
        }
        if (transaction.minedInBlockIndex >= 1) {
          balance.confirmedBalance += transaction.value
        }
      }
      if (transaction.from === address) {
        balance.pendingBalance -= transaction.fee
        if (transaction.minedInBlockIndex === null) {
          balance.pendingBalance -= transaction.value
        }
        if (transaction.minedInBlockIndex <= safeValue && transaction.transferSuccessful) {
          balance.safeBalance -= transaction.value
        }
        if (transaction.minedInBlockIndex >= 1) {
          balance.confirmedBalance -= transaction.fee
          if (transaction.transferSuccessful) {
            balance.confirmedBalance -= transaction.value
          }
        }
      }
    })
    return balance
  }
}

module.exports = Blockchain
