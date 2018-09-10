import axios from 'axios'

import { nodeServerHost, nodePort } from './config'

const url = `${nodeServerHost}:${nodePort}`

const post = (data, endpoint) => {
  const options = {
    method: "POST",
    headers: { "content-type": "application/json" },
    data: JSON.stringify(data),
    url: `${port}${endpoint}`
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

}

export default nodeServices
