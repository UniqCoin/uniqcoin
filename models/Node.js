const uuid4 = require('uuid/v4')

class Node {
  constructor(selfURL, peers, chain) {
    this.nodeId = uuid4()
    this.selfURL = selfURL
    this.peers = peers
    this.chain = chain
  }
}

export default Node
