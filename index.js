'use strict'

const otherwise = require('otherwise')
const toMap = require('2/map')
const toString = require('2/string')

const duplicate = Symbol('duplicate')

module.exports = function mapAbbrs (map, options = {}) {
  const {ci = false} = options
  const abbrevMap = new Map()
  map = toMap(map, {mirror: true})
  for (const [key, to] of map) {
    let from = toString(key)
    if (!from.length) throw new Error('Keys must be non-empty strings')
    if (ci) from = from.toLowerCase()

    for (let i = 1; i <= from.length; i++) {
      const a = from.substring(0, i)
      if (i < from.length && abbrevMap.has(a)) {
        if (!map.has(a) && abbrevMap.get(a) !== duplicate && !Object.is(abbrevMap.get(a), to)) {
          abbrevMap.set(a, duplicate)
        }
      } else {
        abbrevMap.set(a, to)
      }
    }
  }
  return function mapAbbr (input) {
    let abbr = toString(input)
    if (abbr.length) {
      if (ci) abbr = abbr.toLowerCase()
      if (abbrevMap.has(abbr) && abbrevMap.get(abbr) !== duplicate) {
        return abbrevMap.get(abbr)
      }
    }
    return otherwise(options, {defaultErrorClass: RangeError, args: [input]})
  }
}
