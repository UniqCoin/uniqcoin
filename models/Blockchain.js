class Blockchain {
    constructor(blocks, pendingTransactions, currentDifficulty, miningJobs) {
        this.blocks = blocks
        this.pendingTransactions = pendingTransactions
        this.currentDifficulty = currentDifficulty
        this.miningJobs = miningJobs
    }
}