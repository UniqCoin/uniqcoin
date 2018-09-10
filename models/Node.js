/* eslint-disable class-methods-use-this */
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const Blockchain = require('./Blockchain')
const config = require('./../config')

class Node {
  constructor(host, port, chain) {
    this.nodeId = (new Date()).getTime().toString(16) + Math.random().toString(16).substring(2)
    this.selfURL = new URL(`${host}:${port}`).origin
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
      pendingTransactions: this.chain.getPendingTransactions().length,
    }
  }

  async synchronizeNodeFromPeer(peerInfo) {
    const peerCumulativeDifficulty = peerInfo.cumulativeDifficulty
    const peerBlocksCount = peerInfo.blocksCount

    if (this.cumulativeDifficulty < peerCumulativeDifficulty
      || this.chain.blocks.length < peerBlocksCount) {
      await this.synchronizeChainFromPeer(peerInfo)
      await this.synchronizePendingTransactionsFromPeer(peerInfo)
      this.chain.miningJobs = {}
    }
  }

  async synchronizeChainFromPeer(peerInfo) {
    const peerUrl = peerInfo.nodeUrl

    let peerBlockchain
    try {
      const response = await axios.get(`${peerUrl}/blocks`)
      peerBlockchain = response.data
    } catch (error) {
      console.log('error', error.response)
    }

    // TODO peer blockchain validation

    this.chain = peerBlockchain
    this.notifyPeersOfNewChain(peerInfo)
  }

  async synchronizePendingTransactionsFromPeer(peerInfo) {
    const peerUrl = peerInfo.nodeUrl

    let peerPendingTransactions
    try {
      const response = await axios.get(`${peerUrl}/transactions/pending`)
      peerPendingTransactions = response.data
    } catch (error) {
      console.log('error', error.response)
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
          console.log(error.data)
        }
      }
    }
  }

  start() {
    const app = express()
    app.use(bodyParser.json())

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
      res.json(this.chain.getPendingTransactions())
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
      res.json(result)
    })

    app.get('/address/:address/balance', (req, res) => {
      // TODO
    })

    app.post('/transaction/send', (req, res) => {
      const result = this.chain.addNewTransaction(req.body)
      const { errorMsg } = result
      if (errorMsg) {
        res.status(404).send(errorMsg)
      }
      res.json(result.transactionDataHash)
    })

    app.get('/peers', (req, res) => {
      res.send(this.peers)
    })

    app.post('/peers/connect', async (req, res) => {
      let peerUrl
      try {
        peerUrl = new URL(req.body.peerUrl)
      } catch (error) {
        res.status(500).send('Invalid Peer URL')
      }

      let response
      try {
        response = await axios.get(`${peerUrl.origin}/info`)
      } catch (error) {
        res.status(500).send(`Could not connect to ${peerUrl.origin}`)
      }

      const peerInfo = response.data
      const { nodeId, chainId } = peerInfo

      if (this.peers[nodeId]) {
        res.status(409).send({
          errorMsg: `Already connected to ${peerUrl.origin}`,
        })
      } else if (this.chainId !== chainId) {
        res.status(400).send({
          errorMsg: `Node chain ID does not match to ${peerUrl.origin} chain ID`,
        })
      } else {
        for (const prop in this.peers) {
          if (this.peers[prop] === peerUrl.origin) {
            delete this.peers[prop]
          }
        }

        this.peers[nodeId] = peerUrl.origin

        await this.synchronizeNodeFromPeer(peerInfo)

        res.status(200).send({
          message: `Connected to peer ${peerUrl.origin}`,
        })
      }
    })

    app.post('/peers/notify-new-block', async (req, res) => {
      const peerInfo = req.body

      await this.synchronizeNodeFromPeer(peerInfo)

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

    app.listen(this.port, () => console.log(`Listening http on port ${this.port}`))
  }
}

module.exports = Node
