
const Node = require('./models/Node')
const Blockchain = require('./models/Blockchain')
const config = require('./config')

const serverHost = process.env.HOST || config.serverHost
const serverPort = process.env.HTTP_PORT || config.port

const blockchain = new Blockchain()
const node = new Node(serverHost, serverPort, blockchain)

node.start()
