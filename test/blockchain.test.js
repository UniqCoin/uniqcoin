const chai = require('chai')
const CryptoJS = require('crypto-js')

const Blockchain = require('../models/Blockchain')
const Block = require('../models/Block')
const Transaction = require('../models/Transaction')

const testData = require('./testData')

const { assert } = chai

describe('Blockchain unit test: ', () => {
  let blockChain
  const { wallet1, wallet2, sampleSignature } = testData

  beforeEach(() => {
    blockChain = new Blockchain()
  })

  const clearPendingTransactions = () => {
    blockChain.pendingTransactions = []
  }

  describe('Blockchain initialization(constructor)', () => {
    it('should initialize a genesis block', () => {
      const { genesisBlock } = blockChain
      const firstBlock = blockChain.blocks[0]
      assert.equal(JSON.stringify(genesisBlock), JSON.stringify(firstBlock))
    })
  })

  describe('addNewBlock', () => {
    it('should add a block', () => {
      const transaction = new Transaction(wallet1.address, wallet2.address, 0.5, 0.0005, new Date(), '', wallet1.publicKey, sampleSignature)
      const block = new Block(1, [transaction], 1, '', '', '', 5, new Date(), '')
      blockChain.addNewBlock(block)
      assert.equal(blockChain.blocks.length, 2)
    })
  })

  describe('get cumulativeDifficulty', () => {
    it('should calculate commulative difficulty', () => {

    })
  })

  describe('addNewTransaction', () => {
    const timeStamp = new Date().toISOString()

    it('should add a new valid transaction', () => {
      clearPendingTransactions()
      const transaction = new Transaction(wallet1.address, wallet2.address, 0.3, 0.0001, timeStamp, wallet1.publicKey, sampleSignature)
      blockChain.addNewTransaction(transaction)
      assert.equal(blockChain.pendingTransactions.length, 1)
      assert.equal(JSON.stringify(blockChain.pendingTransactions.pop()), JSON.stringify(transaction))
    })
    it('should not add an invalid transaction', () => {
      clearPendingTransactions()
      const transaction = new Transaction('123', '456', 0.3, 0.0001, timeStamp, wallet1.publicKey, sampleSignature)
      const result = blockChain.addNewTransaction(transaction)
      assert.isOk(result.hasOwnProperty('errorMsg'))
      assert.equal(blockChain.pendingTransactions.length, 0)
    })
  })

  describe('createCoinbaseTransaction', () => {
    it('should create a coinbase transaction', () => {
      const receiver = '4bd452364e694e47615b4883096df03754be0012'
      const coinbaseTx = blockChain.createCoinbaseTransaction(receiver)
      const transaction = {
        from: '0000000000000000000000000000000000000000',
        to: '4bd452364e694e47615b4883096df03754be0012',
        value: 5000000,
        fee: 0,
        dateCreated: new Date().toISOString(),
        data: 'coinbase tx',
        senderPubKey: '00000000000000000000000000000000000000000000000000000000000000000',
        senderSignature: [
          '0000000000000000000000000000000000000000000000000000000000000000',
          '0000000000000000000000000000000000000000000000000000000000000000',
        ],
        minedInBlockIndex: blockChain.blocks.length,
        transferSuccessful: true,
      }
      const transactionDataHash = CryptoJS.SHA256(JSON.stringify({
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        fee: transaction.fee,
        dateCreated: transaction.dateCreated,
        data: transaction.data,
        senderPubKey: transaction.senderPubKey,
      })).toString()
      transaction.transactionDataHash = transactionDataHash
      assert.equal(JSON.stringify(coinbaseTx), JSON.stringify(transaction))
    })
  })

  describe('getAccountBalances', () => {
    it('should get the list of account balances', () => {

    })
  })
})
