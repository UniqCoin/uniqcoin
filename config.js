const port = 5555
const minerPort = 6666
const serverHost = 'http://localhost'

const nullAddress = '0000000000000000000000000000000000000000'
const nullPubKey = '00000000000000000000000000000000000000000000000000000000000000000'
const nullSignature = [
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
]
const genesisDate = new Date('08/06/2018').toISOString()
const coinbaseTxVal = 5000000

const faucetAddress = '454a32d21ca64de48126e11129b3a9172e073720'
const faucetPrivateKey = '355b4ac0bcf5a46d5219376b9f4e220cc2dbd8f81e1d3d55fa84a85897df3495'
const faucetPublicKey = 'a976cee6802f666221b515e0680378899de4bb442b959444f8618795e774da7d1'
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
  { method: 'POST', link: '/transactions/send', description: 'transaction send desc' },
  { method: 'GET', link: '/peers', description: 'peers desc' },
  { method: 'POST', link: '/peers/add', description: 'peers add desc' },
  { method: 'POST', link: '/peers/notify-new-block', description: 'peers notify new block desc' },
  { method: 'GET', link: '/mining/get-mining-job/:minerAddress', description: 'get mining job desc' },
  { method: 'GET', link: '/mining/submit', description: 'mining submit desc' },
  { method: 'GET', link: '/debug/mine/:minerAddress/:difficulty', description: 'debug mine new block desc' },
]

const miningFee = 10

module.exports = {
  port,
  minerPort,
  serverHost,
  nullAddress,
  nullPubKey,
  nullSignature,
  genesisDate,
  coinbaseTxVal,
  minTransfer,
  faucetAddress,
  faucetPrivateKey,
  faucetPublicKey,
  faucetTxVal,
  safeConfirmCount,
  endpoints,
  miningFee,
}
