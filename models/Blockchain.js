const Block = require('./Block')
const Transaction = require('./Transaction')

class Blockchain {
  constructor(blocks = [this.genesisBlock], currentDifficulty = 1) {
    this.blocks = blocks
    this.currentDifficulty = currentDifficulty
    this.miningJobs = {}
    this.pendingTransactions = []
  }

  get genesisBlock() {
    const nullAddress = "0000000000000000000000000000000000000000";
    const nullPubKey = "00000000000000000000000000000000000000000000000000000000000000000";
    const nullSignature = [
        "0000000000000000000000000000000000000000000000000000000000000000",
        "0000000000000000000000000000000000000000000000000000000000000000"
    ];
    const genesisDate = new Date('08/06/2018').toISOString()

    const initialFaucetTransaction = new Transaction(
      nullAddress,
      'faucetAddress',
      1000000000,
      0,
      genesisDate,
      'genesis transaction',
      nullPubKey,
      undefined,
      nullSignature,
      0,
      true
    )
    return [new Block(
      0,
      [initialFaucetTransaction],
      0, 
      undefined, 
      undefined, 
      nullAddress, 
      0, 
      genesisDate, 
      undefined
    )]
  }

  get confirmedTransactions() {
    return this.blocks.reduce((accumulator, block) => accumulator.concat(block.transactions))
  }

  get cumulativeDifficulty() {
    //TO DO
    return 0
  }
}

module.exports = Blockchain
