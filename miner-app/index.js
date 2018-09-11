const Miner = require('./models/Miner')
const config = require('./../config')

const miner = new Miner(config.serverHost, config.minerPort, 'qwerty')
miner.mineIndefinitely()
