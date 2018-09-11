const Miner = require('./models/Miner')
const config = require('./../config')

const miner = new Miner(config.serverHost, config.port, 'qwerty')
miner.mineIndefinitely()
