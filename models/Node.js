/* eslint-disable class-methods-use-this */
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const isUrl = require('is-url')
const Blockchain = require('./Blockchain')
const Block = require('./Block')
const config = require('./../config')

class Node {
  constructor(host, port, chain) {
    this.nodeId = (new Date()).getTime().toString(16) + Math.random().toString(16).substring(2)
    this.selfURL = `${host}:${port}`
    this.host = host
    this.port = port
    this.peers = {}
    this.chain = chain
  }

  /**
   * Should trigger and return the block in specific index
   * @param index , index of the selected block
   */
  getBlockByIndex(index) {
    return this.chain.blocks[index]
  }

  get chainId() {
    return this.chain.genesisBlock.blockHash
  }

  get info() {
    return {
      about: 'UniqCoin',
      nodeId: this.nodeId,
      chainId: this.chain.genesisBlock.blockHash,
      nodeUrl: this.selfURL,
      peers: Object.keys(this.peers).length,
      currentDifficulty: this.chain.currentDifficulty,
      blocksCount: this.chain.blocks.length,
      cumulativeDifficulty: this.chain.cumulativeDifficulty,
      confirmedTransactions: this.chain.getConfirmedTransactions().length,
      pendingTransactions: this.chain.pendingTransactions.length,
    }
  }

  isValidPeerBlockchain(peerBlockchainData, peerInfo) {
    const {
      index, transactions, difficulty,
      minedBy, nonce, dateCreated,
    } = peerBlockchainData.blocks[0]
    const peerGenesisBlock = new Block(index, transactions, difficulty,
      undefined, undefined, minedBy, nonce, dateCreated, undefined)
    const peerGenesisBlockHash = peerGenesisBlock.calculateBlockHash()
    const currentGenesisBlockHash = this.chain.blocks[0].calculateBlockHash()

    if (peerGenesisBlockHash !== currentGenesisBlockHash) {
      return new Error('Invalid genesis')
    }

    const peerBlockchain = new Blockchain(peerBlockchainData, peerInfo.currentDifficulty)

    if (!peerBlockchain.isValid()) {
      return new Error('Invalid peer blockchain')
    }

    return true
  }

  async synchronizeFromPeer(peerInfo) {
    const peerCumulativeDifficulty = peerInfo.cumulativeDifficulty
    const peerBlocksCount = peerInfo.blocksCount

    if (this.cumulativeDifficulty < peerCumulativeDifficulty
      || this.chain.blocks.length < peerBlocksCount) {
      const syncChainResult = await this.synchronizeChainFromPeer(peerInfo)

      if (syncChainResult instanceof Error) {
        return syncChainResult
      }

      const syncPendingTxResult = await this.synchronizePendingTransactionsFromPeer(peerInfo)

      if (syncPendingTxResult instanceof Error) {
        return syncPendingTxResult
      }

      this.chain.miningJobs = {}
    }

    return true
  }

  async synchronizeChainFromPeer(peerInfo) {
    const peerUrl = peerInfo.nodeUrl

    let peerBlockchainData
    try {
      const response = await axios.get(`${peerUrl}/blocks`)
      peerBlockchainData = response.data
    } catch (error) {
      return new Error('Unable to fetch peer blockchain')
    }

    // TODO peer blockchain validation
    const peerValidationResult = this.isValidPeerBlockchain(peerBlockchainData, peerInfo)

    if (peerValidationResult instanceof Error) {
      return peerValidationResult
    }

    this.chain = peerBlockchainData

    const peerNotificationResult = this.notifyPeersOfNewChain(peerInfo)

    if (peerNotificationResult instanceof Error) {
      return peerNotificationResult
    }

    return true
  }

  async synchronizePendingTransactionsFromPeer(peerInfo) {
    const peerUrl = peerInfo.nodeUrl
    const apiUrl = `${peerUrl}/transactions/pending`

    let peerPendingTransactions
    try {
      const response = await axios.get(apiUrl)
      peerPendingTransactions = response.data
    } catch (error) {
      return new Error(`Unable to fetch ${apiUrl}`)
    }

    let a = peerPendingTransactions.length
    while (a--) {
      let isUnique = true
      let b = this.chain.pendingTransactions.length
      while (b--) {
        if (this.chain.pendingTransactions[b].transactionDataHash
          === peerPendingTransactions[a].transactionDataHash) {
          isUnique = false
          break
        }
      }

      if (isUnique) {
        this.chain.pendingTransactions.push(peerPendingTransactions[a])
      }
    }

    return true
  }

  notifyPeersOfNewChain(peerInfo) {
    for (const nodeId in this.peers) {
      if (this.peers[nodeId]) {
        try {
          const { blocksCount, cumulativeDifficulty, nodeUrl } = peerInfo
          const options = {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            data: JSON.stringify({ blocksCount, cumulativeDifficulty, nodeUrl }),
            url: `${this.peers[nodeId]}/peers/notify-new-block`,
          }

          axios(options)
        } catch (error) {
          return new Error(`Unable to notify peers\nMessage: ${error.data}`)
        }
      }
    }

    return true
  }

  start() {
    const app = express()
    app.use(bodyParser.json())
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      next()
    })
    app.get('/', (req, res) => {
      const { endpoints } = config
      const rowItems = endpoints.map(endpoint => (
        `<tr>
          <td style="border:1px solid black; padding: 10px">
            ${endpoint.method}
          </td>
          <td style="border:1px solid black; padding: 10px">
            <a href="${endpoint.link}">
              ${endpoint.link}
            </a>
          </td>
          <td style="border:1px solid black; padding: 10px">
            ${endpoint.description}
          </td>  
        </tr>`
      ))

      res.send(
        `<h1>UniqCoin Block Explorer</h1>
          <table style="border:2px solid black">
          <tr>
            <th style="border:2px solid black; padding: 5px">Method</th>
            <th style="border:2px solid black; padding: 5px">Path</th>
            <th style="border:2px solid black; padding: 5px">Desciption</th>
          </tr>
           ${rowItems.join('')}
        </table>`,
      )
    })

    app.get('/info', (req, res) => {
      res.json(this.info)
    })

    app.get('/debug', (req, res) => {
      res.json(this)
    })

    app.get('/debug/reset-chain', (req, res) => {
      this.chain = new Blockchain()
      res.json({ message: 'The chain was reset to its genesis block' })
    })

    app.get('/blocks', (req, res) => {
      const { blocks } = this.chain
      res.json({ blocks })
    })

    app.get('/blocks/:index', (req, res) => {
      const { index } = req.params
      const block = this.getBlockByIndex(index)
      if (!block) res.status(404).send('Not found')
      res.json({ block })
    })

    app.get('/transactions/pending', (req, res) => {
      res.json(this.chain.pendingTransactions)
    })

    app.get('/transactions/confirmed', (req, res) => {
      res.json(this.chain.getConfirmedTransactions())
    })

    app.get('/transactions/:hash', (req, res) => {
      const { hash } = req.params
      const transaction = this.chain.getTransactionByHash(hash)
      if (transaction) res.json(transaction)
      else res.status(404).send('Not found')
    })

    app.get('/balances', (req, res) => {
      res.json(this.chain.getAccountBalances())
    })

    app.get('/address/:address/transactions', (req, res) => {
      const { address } = req.params
      const result = this.chain.getTransactionsByAddress(address)
      const { errorMsg } = result
      if (errorMsg) res.status(404).send(errorMsg)
      res.json({ address, transactions: result })
    })

    app.get('/address/:address/balance', (req, res) => {
      const { address } = req.params
      const result = this.chain.getAccountBalanceByAddress(address)
      const { errorMsg } = result
      if (errorMsg) res.status(404).send(errorMsg)
      res.json(result)
    })

    app.post('/transactions/send', (req, res, next) => {
      const result = this.chain.addNewTransaction(req.body)
      const { errorMsg } = result
      if (errorMsg) {
        res.status(400).send({ message: errorMsg })
      }
      res.json(result.transactionDataHash)
    })

    app.get('/peers', (req, res) => {
      res.send(this.peers)
    })

    app.post('/peers/connect', async (req, res) => {
      if (!isUrl(req.body.peerUrl)) {
        res.status(500).send('Invalid Peer URL')
      }

      const { peerUrl } = req.body

      let response
      try {
        response = await axios.get(`${peerUrl}/info`)
      } catch (error) {
        res.status(500).send(`Could not connect to ${peerUrl}`)
      }

      const peerInfo = response.data
      const { nodeId, chainId } = peerInfo

      if (this.nodeId === nodeId) {
        res.status(409).send({
          errorMsg: 'Cannot connect to own node',
        })
      } else if (this.peers[nodeId]) {
        res.status(409).send({
          errorMsg: `Already connected to ${peerUrl}`,
        })
      } else if (this.chainId !== chainId) {
        res.status(400).send({
          errorMsg: `Node chain ID does not match to ${peerUrl} chain ID`,
        })
      } else {
        for (const prop in this.peers) {
          if (this.peers[prop] === peerUrl) {
            delete this.peers[prop]
          }
        }

        this.peers[nodeId] = peerUrl

        try {
          await axios.post(`${peerUrl}/peers/connect`, {
            peerUrl: this.selfURL,
          })
        } catch (error) {
          console.log(`Connected to peer ${this.selfURL}`)
        }

        const syncFromPeerResult = await this.synchronizeFromPeer(peerInfo)

        if (syncFromPeerResult instanceof Error) {
          res.status(500).json(syncFromPeerResult.toString())
        } else {
          res.status(200).send({
            message: `Connected to peer ${peerInfo.nodeUrl}`,
          })
        }
      }
    })

    app.post('/peers/notify-new-block', async (req, res) => {
      const peerInfo = req.body

      await this.synchronizeFromPeer(peerInfo)

      res.status(200).send({
        message: 'Thank you for the notification.',
      })
    })

    app.get('/mining/get-mining-job/:minerAddress', (req, res) => {
      /* initial sample call and to be modified changing params to user pub address */
      const { minerAddress } = req.params
      const miningJob = this.chain.getMiningJob(minerAddress)

      res.json(miningJob)
    })

    app.post('/mining/submit', (req, res) => {
      // TODO
      const minedBlock = req.body
      const result = this.chain.submitMinedBlock(minedBlock)
      res.send(result)
    })

    app.get('/debug/mine/:minerAddress/:difficulty', (req, res) => {
      const { minerAddress, difficulty } = req.params
      const response = this.chain.mineNewBlock(minerAddress, difficulty)
      const { errorMsg } = response
      if (errorMsg) res.status(500).send({ message: errorMsg })
      return res.send(response)
    })

    app.listen(this.port, () => console.log(`Listening http on port ${this.port}`))
  }
}

module.exports = Node
