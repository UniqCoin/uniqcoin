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
  }
}

module.exports = Block
