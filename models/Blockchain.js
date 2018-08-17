/* eslint-disable class-methods-use-this */
const Block = require('./Block')


// constructor(index, difficulty, prevBlockHash, blockDataHash,
//   minedBy, nonce, dateCreated, blockHash) {
class Blockchain {
  constructor(blocks = [this.genesisBlock],
    transactions = [], currentDifficulty = 1) {
    this.blocks = blocks
    this.transactions = transactions
    this.currentDifficulty = currentDifficulty
    this.miningJobs = {}
  }

  get genesisBlock() {
    return [new Block(0, 0, '000000000000000000000', '', '0000000000000000000000000', 0, new Date(), '')]
  }

  addNewBlock(block) {
    this.blocks.push(block)
  }
}

module.exports = Blockchain
