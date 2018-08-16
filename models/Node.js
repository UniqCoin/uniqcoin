const uuid4 = require('uuid/v4')

class Node {
  constructor(serverHost, serverPort, chain) {
    this.nodeId = uuid4()
    this.host = serverHost
    this.port = serverPort
    this.selfURL = `http://${serverHost}:${serverPort}`
    this.peers = {}
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
