/* eslint-disable no-plusplus */

const Validator = {
  isValidAddress: address => /^[0-9a-f]{40}$/.test(address),
  isValidPublicAddress: pk => /^[0-9a-f]{65}$/.test(pk),
  isValidDifficulty: (hash, difficulty) => {
    if (Number.isInteger(difficulty)) {
      for (let index = 0; index < difficulty; index++) {
        if (hash[index] !== '0') {
          return false
        }
      }
      return true
    }
    return false
  },
}

module.exports = Validator
