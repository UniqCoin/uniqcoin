import axios from 'axios'

import { nodeServerHost, nodePort } from './config'

const url = `http://${nodeServerHost}:${nodePort}`

const post = async (data, endpoint) => {
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    data: JSON.stringify(data),
    url: `${url}${endpoint}`
  }
  return axios(options);
}

const get = (endpoint) => {
  return axios.get(`${url}${endpoint}`)
}

const nodeServices = {
  sendSignedTransaction: (transaction) => {
    return post(transaction, '/transaction/send')
  },
  getBalances: (address) => {
    return get(`/address/${address}/balance`)
  },
  getTransactions: (address) => {
    return get(`/address/${address}/transactions`)
  }
}

export default nodeServices
