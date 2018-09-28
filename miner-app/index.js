const Miner = require('./models/Miner')
const config = require('./../config')

const minerAddress = process.env.MINER_ADDRESS || 'asjdflkjsad'
const nodePort = process.env.NODE_PORT || config.port

const miner = new Miner(config.serverHost, nodePort, minerAddress)
miner.mineIndefinitely()
