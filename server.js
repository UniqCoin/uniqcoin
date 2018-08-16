const express = require('express')
const bodyParser = require('body-parser')
const WebSocket = require('ws')

const httpPort = process.env.HTTP_PORT || 3001
const p2pPort = process.env.P2P_PORT || 6001
const initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : []

const initHttpServer = () => {
  const app = express()
  app.use(bodyParser.json())

  app.get('/info', (req, res) => {
    // TODO
  })

  app.get('/debug', (req, res) => {
    res.send(JSON.stringify(node))
  })

  app.get('/debug/reset-chain', (req, res) => {
    // TODO
  })

  app.get('/blocks', (req, res) => {
    // TODO
  })

  app.get('/blocks/:index', (req, res) => {
    // TODO
  })

  app.get('/transactions/pending', (req, res) => {
    // TODO
  })

  app.get('/transactions/confirmed', (req, res) => {
    // TODO
  })

  app.get('/transactions/:hash', (req, res) => {
    // TODO
  })

  app.get('/balances', (req, res) => {
    // TODO
  })

  app.get('/address/:address/transactions', (req, res) => {
    // TODO
  })

  app.get('/address/:address/balance', (req, res) => {
    // TODO
  })

  app.post('/transaction/send', (req, res) => {
    // TODO
  })

  app.get('/peers', (req, res) => {
    // TODO
  })

  app.post('/peers/connect', (req, res) => {
    // TODO
  })

  app.post('/peers/notify-new-block', (req, res) => {
    // TODO
  })

  app.get('/mining/get-mining-job', (req, res) => {
    // TODO
  })

  app.post('/mining/submit', (req, res) => {
    // TODO
  })
}
