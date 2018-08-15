import Block from './Block'

class Blockchain {
  constructor(pendingTransactions, currentDifficulty, miningJobs) {
    this.blocks = []
    this.pendingTransactions = pendingTransactions
    this.currentDifficulty = currentDifficulty
    this.miningJobs = miningJobs

    this.generateGenesisBlock()
  }

  generateGenesisBlock() {
    this.blocks = [new Block(0, [], 0, 0, 'w7da92eb4249cb5ff4f9da36e2a7f8d5d61999221ed6910180948153e71cc97f', 'uniqcoin', 1, new Date(), '078a2df4d5fb65f43b57463023430b01e218462c729852ae98109c86864d8150')]
  }
}

export default Blockchain
