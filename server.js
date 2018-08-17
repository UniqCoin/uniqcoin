const express = require('express')
const bodyParser = require('body-parser')
const WebSocket = require('ws')
const Node = require('./models/Node')
const Blockchain = require('./models/Blockchain')

const serverHost = process.env.HOST || 'localhost'
const serverPort = process.env.HTTP_PORT || 5555
const p2pPort = process.env.P2P_PORT || 6001
const initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : []

const sockets = []

const blockchain = new Blockchain()
const node = new Node(serverHost, serverPort, blockchain)

const initConnection = (ws) => {
  sockets.push(ws)
}

const initP2PServer = () => {
  const server = new WebSocket.Server({ port: p2pPort })
  server.on('connection', ws => initConnection(ws))
}

const connectToPeers = (newPeers) => {
  newPeers.forEach((peer) => {
    const ws = new WebSocket(peer)
    ws.on('open', () => initConnection(ws))
    ws.on('error', () => console.log('Connection failed'))
  })
}

const initHttpServer = () => {
  const app = express()
  app.use(bodyParser.json())

  app.get('/info', (req, res) => {
    // TODO
  })

  app.get('/debug', (req, res) => {
    res.json(node)
  })

  app.get('/debug/reset-chain', (req, res) => {
    node.chain = new Blockchain()
    res.json({ message: 'The chain was reset to its genesis block' })
  })

  app.get('/blocks', (req, res) => {
    // TODO
  })

  app.get('/blocks/:index', (req, res) => {
    // TODO
  })

  app.get('/transactions/pending', (req, res) => {
    // TODO
  })

  app.get('/transactions/confirmed', (req, res) => {
    // TODO
  })

  app.get('/transactions/:hash', (req, res) => {
    const { hash } = req.params
    const transaction = node.getTransactionByHash(hash)
    if (transaction) res.json(transaction)
    else res.status(404).send('Not found')
  })

  app.get('/balances', (req, res) => {
    // TODO
  })

  app.get('/address/:address/transactions', (req, res) => {
    // TODO
  })

  app.get('/address/:address/balance', (req, res) => {
    // TODO
  })

  app.post('/transaction/send', (req, res) => {
    // TODO
  })

  app.get('/peers', (req, res) => {
    res.send(sockets.map(s => `${s._socket.remoteAddress} : ${s._socket.remotePort}`))
  })

  app.post('/peers/add', (req, res) => {
    connectToPeers([req.body.peer])
    res.send()
  })

  app.post('/peers/notify-new-block', (req, res) => {
    // TODO
  })

  app.get('/mining/get-mining-jon', (req, res) => {
    // TODO
  })

  app.post('/mining/submit', (req, res) => {
    // TODO
  })

  app.listen(serverPort, () => console.log(`Listening http on port ${serverPort}`))
}

connectToPeers(initialPeers)
initHttpServer()
initP2PServer()
