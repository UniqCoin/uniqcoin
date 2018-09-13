const chai = require('chai')
const CryptoJS = require('crypto-js')

const Blockchain = require('../models/Blockchain')
const Block = require('../models/Block')
const Transaction = require('../models/Transaction')
const config = require('../config')
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
      const transaction = new Transaction(wallet1.address, wallet2.address, 50, 10, new Date(), '', wallet1.publicKey, sampleSignature)
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
      const transaction = new Transaction(config.nullAddress, wallet2.address, 50, 10, new Date().toISOString(), '', config.nullPubKey, config.nullSignature)
      assert.equal(blockChain.pendingTransactions.length, 1)
      assert.equal(JSON.stringify(blockChain.pendingTransactions.pop()), JSON.stringify(transaction))
    })
    it('should not add an invalid transaction', () => {
      clearPendingTransactions()
      const transaction = new Transaction('123', '456', 30, 10, timeStamp, wallet1.publicKey, sampleSignature)
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

  describe('getAllTransactions', () => {
    const timeStamp = new Date().toISOString()

    it('should get the list of all the transactions', () => {
      clearPendingTransactions()
      const transaction = new Transaction(wallet1.address, wallet2.address, 30, 10, timeStamp, wallet1.publicKey, sampleSignature)

      blockChain.addNewTransaction(transaction)
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
      const transactions = blockChain.getAllTransactions()
      assert.equal(JSON.stringify(transactions),
        JSON.stringify([blockChain.genesisBlock.transactions[0], transaction]))
    })
  })

  describe('getConfirmedTransactions', () => {
    const timeStamp = new Date().toISOString()
    it('should get the list of confirmed transactions', () => {
      const transactions = []
      blockChain.blocks.forEach((block) => {
        transactions.push(...block.transactions)
      })
      assert.equal(JSON.stringify(transactions),
        JSON.stringify(blockChain.getAllTransactions()))
    })
    it('should not include the pending transactions', () => {
      clearPendingTransactions()
      const transaction = new Transaction(wallet1.address, wallet2.address, 3,
        10, timeStamp, wallet1.publicKey, sampleSignature)
      blockChain.addNewTransaction(transaction)
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
      assert.notEqual(JSON.stringify(blockChain.getConfirmedTransactions()), JSON.stringify([blockChain.genesisBlock.transactions[0], transaction]))
    })
  })

  describe('getTransactionByHash', () => {
    it('should return the transaction by hash', () => {
      const transaction = blockChain.getConfirmedTransactions()[0]
      assert.equal(blockChain.getTransactionByHash(transaction.transactionDataHash), transaction)
    })
  })

  describe('getLastBlockIndex', () => {
    it('should return the index of the last block of the chain', () => {
      const block = new Block(1, [], 1, '', '', '', 5, new Date(), '')
      blockChain.addNewBlock(block)
      assert.equal(blockChain.getLastBlockIndex(), block.index)
    })
  })

  describe('getLastBlock', () => {
    const block = new Block(3, [], 2, '', '', '', 2, new Date(), '')
    const lastBlock = new Block(1, [], 1, '', '', '', 5, new Date(), '')
    it('should return the last block of the chain', () => {
      blockChain.addNewBlock(block)
      blockChain.addNewBlock(lastBlock)
      assert.equal(blockChain.getLastBlock(), lastBlock)
    })
    it('should not return the previous block of the chain', () => {
      blockChain.addNewBlock(block)
      blockChain.addNewBlock(lastBlock)
      assert.notEqual(blockChain.getLastBlock(), block)
    })
  })

  describe('getMiningJob', () => {
    it('should return the next block candidate', () => {
      const mineBlock = blockChain.getMiningJob(config.nullAddress)
      assert.instanceOf(mineBlock, Block)
    })

    it('should return an error message if the address is invalid', () => {
      const invalidAddress = 'invalidaddress'
      assert.equal(blockChain.getMiningJob(invalidAddress).errorMsg, `Invalid miner address: ${invalidAddress}`)
    })
  })

  describe('getTransactionsByAddress', () => {
    const timeStamp = new Date().toISOString()
    const transaction1 = new Transaction(wallet1.address, wallet2.address, 3,
      10, timeStamp, wallet1.publicKey, sampleSignature)
    const transaction2 = new Transaction(wallet2.address, wallet1.address, 1,
      20, timeStamp, wallet2.publicKey, sampleSignature)
    const transaction3 = new Transaction(wallet1.address, '', 2,
      30, timeStamp, wallet1.publicKey, sampleSignature)

    it('should return the list of transactions by address', () => {
      clearPendingTransactions()
      blockChain.addNewTransaction(transaction1)
      blockChain.addNewTransaction(transaction2)
      blockChain.addNewTransaction(transaction3)
      assert.equal(JSON.stringify(blockChain.getTransactionsByAddress(wallet2.address)), JSON.stringify([transaction1, transaction2]))
    })
    it('should not include transactions with no matching address', () => {
      clearPendingTransactions()
      blockChain.addNewTransaction(transaction1)
      blockChain.addNewTransaction(transaction2)
      blockChain.addNewTransaction(transaction3)
      assert.notEqual(JSON.stringify(blockChain.getTransactionsByAddress(wallet2.address)), JSON.stringify([transaction1, transaction2, transaction3]))
    })
  })

  describe('submitMinedBlock', () => {
    const block = new Block(1, [], 1, '', '', '', 5, new Date(), '')
    it('should return a message that the block is accepted and reward is paid', () => {
      const mineBlock = blockChain.getMiningJob(config.nullAddress)
      assert.equal(blockChain.submitMinedBlock(mineBlock).message, `Block accepted, reward paid: ${mineBlock.transactions[0].value} microcoins`)
    })

    it('should return an error message that the block is not found or has already mined', () => {
      assert.equal(blockChain.submitMinedBlock(block).errorMsg, 'Block not found or already mined')
    })
  })
})
