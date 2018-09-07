const Miner = require('./models/Miner')

const miner = new Miner('http://127.0.0.1:5555/', 'qwerty')
miner.mineIndefinitely()
