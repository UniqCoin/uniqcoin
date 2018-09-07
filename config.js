const port = 5555
const serverHost = 'localhost'

const nullAddress = '0000000000000000000000000000000000000000'
const nullPubKey = '00000000000000000000000000000000000000000000000000000000000000000'
const nullSignature = [
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
]
const genesisDate = new Date('08/06/2018').toISOString()
const coinbaseTxVal = 5000000

const faucetAddress = 'notimplemented'
const faucetTxVal = 1000000000000
const safeConfirmCount = 6

module.exports = {
  port,
  serverHost,
  nullAddress,
  nullPubKey,
  nullSignature,
  genesisDate,
  coinbaseTxVal,
  faucetAddress,
  faucetTxVal,
  safeConfirmCount,
}
