import axios from 'axios'

const post = (data, endpoint) => {
  const options = {
    method: "POST",
    headers: { "content-type": "application/json" },
    data: JSON.stringify(data),
    url: `http://localhost:3000${endpoint}`
  }
  return axios(options);
}

const get = (endpoint) => {
  return axios.get(`http://localhost:3000${endpoint}`)
}

const nodeServices = {
  sendSignedTransaction: (transaction) => {
    return post(transaction, '/transaction/send')
  },

}

export default nodeServices
