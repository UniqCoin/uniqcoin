const Block = require('./Block')
const Transaction = require('./Transaction')

class Blockchain {
  constructor(blocks = [this.genesisBlock],
    pendingTransactions = [], currentDifficulty = 1) {
    this.blocks = blocks
    this.pendingTransactions = pendingTransactions
    this.currentDifficulty = currentDifficulty
    this.miningJobs = {}
  }

  get genesisBlock() {
    const nullAddress = "0000000000000000000000000000000000000000";
    const nullPubKey = "00000000000000000000000000000000000000000000000000000000000000000";
    const nullSignature = [
        "0000000000000000000000000000000000000000000000000000000000000000",
        "0000000000000000000000000000000000000000000000000000000000000000"
    ];
    const genesisDate = '2018-01-01T00:00:00.000Z'

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

}

module.exports = Blockchain
