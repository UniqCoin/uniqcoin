/* eslint-disable class-methods-use-this */
const axios = require('axios')
const CryptoJS = require('crypto-js')
const cluster = require('cluster')
const os = require('os')

class Miner {
  constructor(nodeURL, address) {
    this.nodeURL = new URL(nodeURL)
    this.address = address
    this.cpuCount = os.cpus().length
  }

  postBlock(blockData) {
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(blockData),
      url: `${this.nodeURL.origin}/mining/submit`,
    }

    return axios(options)
  }

  calculateHash(blockDataHash, timestamp, nonce) {
    return CryptoJS.SHA256(`${blockDataHash}|${timestamp}|${nonce}`).toString()
  }

  getMiningJob() {
    return axios.get(`${this.nodeURL.origin}/mining/get-mining-job/${this.address}`)
  }

  getBlockByIndex(index) {
    return axios.get(`${this.nodeURL.origin}/blocks/${index}`)
  }

  async mineBlock() {
    let miningJobResponse
    try {
      miningJobResponse = await this.getMiningJob()
    } catch (error) {
      console.log('Failed to get mining job')
    }

    const { difficulty, blockDataHash } = miningJobResponse.data
    const isValidHash = blockHash => blockHash.substring(0, difficulty) === Array(difficulty + 1).join('0')

    let nonce = -1
    let nextHash
    let nextTimeStamp
    do {
      nonce += 1
      nextTimeStamp = new Date().toISOString()
      nextHash = this.calculateHash(blockDataHash, nextTimeStamp, nonce)
    } while (!isValidHash(nextHash))

    const result = {
      blockDataHash,
      nonce,
      dateCreated: nextTimeStamp,
      blockHash: nextHash,
    }

    return result
  }

  async getMiningJobBlockIndex() {
    const response = await this.getMiningJob()
    const block = response.data

    return block.index
  }

  async mineIndefinitely() {
    if (cluster.isMaster) {
      let minerJobBlockIndex
      const spawnMiner = () => {
        const miner = cluster.fork()

        miner.on('message', async (msg) => {
          if (msg === 'START_NEW_MINING_JOB') {
            spawnMiner()

            try {
              minerJobBlockIndex = await this.getMiningJobBlockIndex()
            } catch (error) {
              console.log('Failed to get mining job')
            }

            miner.kill()
          }
        })

        return miner
      }
      let miner = spawnMiner()

      try {
        minerJobBlockIndex = await this.getMiningJobBlockIndex()
      } catch (error) {
        console.log('Failed to get mining job')
      }

      setInterval(async () => {
        let latestJobBlockIndex
        try {
          latestJobBlockIndex = await this.getMiningJobBlockIndex()
        } catch (error) {
          console.log('Failed to get mining job')
        }

        if (minerJobBlockIndex !== latestJobBlockIndex) {
          miner.kill()
          miner = spawnMiner()
          minerJobBlockIndex = latestJobBlockIndex
        }
      }, 2000)
    } else {
      const candidateBlockMined = await this.mineBlock()

      let postBlockResponse
      try {
        const result = await this.postBlock(candidateBlockMined)
        postBlockResponse = result.data
      } catch (error) {
        postBlockResponse = 'Failed to submit mined block'
      }

      console.log(postBlockResponse)
      process.send('START_NEW_MINING_JOB')
    }
  }
}

module.exports = Miner
