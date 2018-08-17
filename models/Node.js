class Node {
    constructor(nodeId, selfURL, peers, chain) {
        this.nodeId = nodeId
        this.selfURL = selfURL
        this.peers = peers
        this.chain = chain
    }
}

module.exports = Node
