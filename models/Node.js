class Node {
  constructor(serverHost, serverPort, chain) {
    this.nodeId = (new Date()).getTime().toString(16) + Math.random().toString(16).substring(2)
    this.host = serverHost
    this.port = serverPort
    this.selfURL = `http://${serverHost}:${serverPort}`
    this.peers = []
    this.chain = chain
  }

  getTransactionByHash(transactionDataHash) {
    const { chain } = this
    let transactionData = null
    const { blocks } = chain
    let counter = 0

    while (!transactionData || counter < blocks.length) {
      const currentBlock = blocks[counter]
      counter += 1
      transactionData = currentBlock.transactions.find(transaction => transaction.transactionDataHash === transactionDataHash)
    }

    return transactionData
  }
}

module.exports = Node
