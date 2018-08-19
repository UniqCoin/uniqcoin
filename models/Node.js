class Node {
  constructor(serverHost, serverPort, chain) {
    this.nodeId = (new Date()).getTime().toString(16) + Math.random().toString(16).substring(2)
    this.host = serverHost
    this.port = serverPort
    this.selfURL = `http://${serverHost}:${serverPort}`
    this.peers = []
    this.chain = chain
  }

  /**
   * Should trigger and return the block in specific index
   * @param index , index of the selected block
   */
  getBlockByIndex(index) {
    return this.chain.blocks[index]
  }

  get info() {
    return {
      about: 'UniqCoin',
      nodeId: this.nodeId,
      chainId: this.chain.genesisBlock.blockHash,
      nodeUrl: this.selfUrl,
      peers: this.peers.length,
      currentDifficulty: this.chain.currentDifficulty,
      blocksCount: this.chain.blocks.length,
      cumulativeDifficulty: this.chain.cumulativeDifficulty,
      confirmedTransactions: this.chain.confirmedTransactions.length,
      pendingTransactions: this.chain.pendingTransactions.length,
    }
  }
}

module.exports = Node
