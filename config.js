const port = 5555
const serverHost = 'http://localhost'

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
const minTransfer = 10

const endpoints = [
  { method: 'GET', link: '/info', description: 'info desc' },
  { method: 'GET', link: '/debug', description: 'debug desc' },
  { method: 'GET', link: '/debug/reset-chain', description: 'debug reset desc' },
  { method: 'GET', link: '/blocks', description: 'blocks desc' },
  { method: 'GET', link: '/blocks/:index', description: 'blocks index desc' },
  { method: 'GET', link: '/transactions/pending', description: 'transactions pending desc' },
  { method: 'GET', link: '/transactions/confirmed', description: 'transactions confirmed desc' },
  { method: 'GET', link: '/transactions/:hash', description: 'transactions hash desc' },
  { method: 'GET', link: '/balances', description: 'balances desc' },
  { method: 'GET', link: '/address/:address/transactions', description: 'address transaction desc' },
  { method: 'GET', link: '/address/:address/balance', description: 'address balance desc' },
  { method: 'POST', link: '/transaction/send', description: 'transaction send desc' },
  { method: 'GET', link: '/peers', description: 'peers desc' },
  { method: 'POST', link: '/peers/add', description: 'peers add desc' },
  { method: 'POST', link: '/peers/notify-new-block', description: 'peers notify new block desc' },
  { method: 'GET', link: '/mining/get-mining-job', description: 'get mining job desc' },
  { method: 'GET', link: '/mining/submit', description: 'mining submit desc' },
]

const miningFee = 10

module.exports = {
  port,
  serverHost,
  nullAddress,
  nullPubKey,
  nullSignature,
  genesisDate,
  coinbaseTxVal,
  minTransfer,
  faucetAddress,
  faucetTxVal,
  safeConfirmCount,
  endpoints,
  miningFee,
}
