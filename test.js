'use strict'

const assert = require('assert')
const mapAbbrs = require('.')

describe('mapAbbrs()', function () {
  {
    const mapAbbr = mapAbbrs({one: 1, two: 2, too: 2}, {ci: true})

    const tests = [
      [['o', 'on', 'one', 'One'], 1],
      [['t', 'tw', 'two', 'Two'], 2],
      [['t', 'to', 'too'], 2],
      [['x']],
    ]

    for (const [froms, to] of tests) {
      for (const from of froms) {
        it(`should normalize “${from}” to “${to}”`, function () {
          assert.strictEqual(mapAbbr(from), to)
        })
      }
    }
  }

  it('should support the `elseReturn` parameter', function () {
    const elseReturn = Symbol('elseReturn')
    const mapAbbr = mapAbbrs({}, {elseReturn})
    assert.strictEqual(mapAbbr('x'), elseReturn)
  })

  it('should support the `elseCall` parameter', function () {
    const called = Symbol('called')
    const mapAbbr = mapAbbrs({}, {elseCall: (fallback, input) => {
      assert.strictEqual(input, 'x')
      return called
    }})
    assert.strictEqual(mapAbbr('x'), called)
  })

  it('should resort to fallback behavior if there’s an ambiguity', function () {
    const mapAbbr = mapAbbrs({
      test: 1,
      testing: 2,
    }, {
      elseThrow: true,
    })
    assert.throws(() => { mapAbbr('t') })
    assert.strictEqual(mapAbbr('testi'), 2)
  })

  it('should match an abbreviation to an exact match if it exists', function () {
    {
      const mapAbbr = mapAbbrs({
        testing: 2,
        test: 1,
      }, {
        elseThrow: true,
      })
      assert.throws(() => { mapAbbr('t') })
      assert.strictEqual(mapAbbr('test'), 1)
      assert.strictEqual(mapAbbr('testi'), 2)
    }
    {
      const mapAbbr = mapAbbrs({
        test: 1,
        testing: 2,
      }, {
        elseThrow: true,
      })
      assert.throws(() => { mapAbbr('t') })
      assert.strictEqual(mapAbbr('test'), 1)
      assert.strictEqual(mapAbbr('testi'), 2)
    }
  })
})
