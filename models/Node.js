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
}

module.exports = Node
