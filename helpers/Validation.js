/* eslint-disable no-plusplus */

const Validator = {
  isValidAddress: address => /^[0-9a-f]{40}$/.test(address),
  isValidPublicAddress: pk => /^[0-9a-f]{65}$/.test(pk),
  isValidDifficulty: (hash, difficulty) => {
    if (Number.isInteger(difficulty)) {
      const regEx = /^(0+)g/.exec(hash)
      if (regEx) {
        return regEx[0].length === difficulty
      }
      return false
    }
    return false
  },
}

module.exports = Validator
