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
  isValidFee: fee => Validator.isInteger(fee) && fee >= config.miningFee,
  isValidTransferVal: val => Validator.isInteger(val) && val > 0,
  isValidDate: (date) => {
    const isoDateRegex = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/
    return isoDateRegex.test(date) && new Date(date).getUTCFullYear() >= 2018
  },
  isValidSignature: (signature) => {
    const regex = /^[0-9a-f]{64}$/
    return Array.isArray(signature) && signature.length === 2
      && regex.test(signature[0]) && regex.test(signature[1])
  },
  isInteger: digit => typeof digit === 'number' && Number.isInteger(digit),
}

module.exports = Validator
