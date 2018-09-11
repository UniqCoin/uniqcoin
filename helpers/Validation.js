/* eslint-disable no-plusplus */
const config = require('../config')

const Validator = {
  isValidAddress: address => /^[0-9a-f]{40}$/.test(address),
  isValidPublicAddress: pk => /^[0-9a-f]{65}$/.test(pk),
  isValidDifficulty: (hash, difficulty) => {
    if (Validator.isInteger(difficulty)) {
      const regEx = /^(0+)/g.exec(hash)
      if (regEx) {
        return regEx[0].length === difficulty
      }
      return false
    }
    return false
  },
  isValidAmountTransfer: (value) => {
    if (Validator.isInteger(value)) {
      return value >= config.minTransfer
    }
    return false
  },
  isInteger: digit => Number.isInteger(digit),
}

module.exports = Validator
